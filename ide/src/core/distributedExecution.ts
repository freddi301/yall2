import { BasicAst } from "src/AstComponents/Ast/Ast";
import { toPurescriptAst } from "./toPurescriptAst";
import {
  debugLazySymbolic,
  next,
  getResult,
  nextWith,
  nextNoRecur,
  replace
} from "../language/Yall.External";
import { End } from "../language/Yall.Pauseable";
import { fromPurescriptAst } from "./fromPurescriptAst";

// key value distributed store (eventual consistency)
interface Store<Key extends Serializable, Value extends Serializable> {
  read(key: Key): Promise<Value>;
  save(value: Value): Promise<Key>;
  incrementReferenceCount(key: Key): Promise<void>;
  decrementReferenceCount(key: Key): Promise<void>;
}

type Result<Key extends Serializable> =
  | { type: "result"; term: Key }
  | {
      type: "fork";
      parent: Key;
      child: Key;
    };

// serverless cloud
interface Cluster<Key extends Serializable> {
  remoteRun(termPointer: Key): Promise<Key>;
}

interface Client {
  run(ast: BasicAst): Promise<BasicAst>;
}

type Serializable = any;

class LocalInMemoryStore implements Store<string, BasicAst> {
  private data = {} as Record<
    string,
    { value: BasicAst; referenceCount: number }
  >;
  private nextKey = 0;
  public async read(key: string) {
    const entry = this.data[key];
    if (entry) {
      return entry.value;
    }
    throw new Error("not found");
  }
  public async save(value: BasicAst) {
    const key = String(this.nextKey++);
    this.data[key] = { value, referenceCount: 1 };
    return key;
  }
  public async incrementReferenceCount(key: string) {
    this.data[key].referenceCount++;
  }
  public async decrementReferenceCount(key: string) {
    this.data[key].referenceCount--;
    if (this.data[key].referenceCount <= 0) {
      delete this.data[key];
    }
  }
}

export class LocalSingleThreadedCluster<Key extends Serializable>
  implements Cluster<Key> {
  constructor(private store: Store<Key, BasicAst>) {}
  private async execute(termKey: Key): Promise<Result<Key>> {
    const term = await this.store.read(termKey);
    let step = debugLazySymbolic(toPurescriptAst({ ast: term, path: [] }));
    let computationQuota = 19;
    while (computationQuota-- && !(step instanceof End)) {
      step = next(step);
    }
    if (step instanceof End) {
      const resultUri = await this.store.save(
        fromPurescriptAst(getResult(step))
      );
      return { type: "result", term: resultUri };
    }
    const intermediate = getResult(step);
    const intermediateUri = await this.store.save(
      fromPurescriptAst(intermediate)
    );
    const placeholder = this.makePlaceholder(intermediateUri);
    step = nextWith(placeholder)(step);
    while (!(step instanceof End)) {
      step = nextNoRecur(step);
    }
    const resultUri = await this.store.save(fromPurescriptAst(getResult(step)));
    return { type: "fork", parent: resultUri, child: intermediateUri };
  }
  protected async run(termKey: Key): Promise<Key> {
    const result = await this.execute(termKey);
    switch (result.type) {
      case "result": {
        await this.store.decrementReferenceCount(termKey);
        return result.term;
      }
      case "fork": {
        const parentTask = this.remoteRun(result.parent).then(async k => ({
          parentKey: k,
          parent: await this.store.read(k)
        }));
        const childTask = this.remoteRun(result.child).then(async k => ({
          childKey: k,
          child: await this.store.read(k)
        }));
        const [{ parentKey, parent }, { childKey, child }] = await Promise.all([
          parentTask,
          childTask
        ]);
        const continuation = replace(this.makePlaceholder(result.child))(
          toPurescriptAst({ ast: child, path: [] })
        )(toPurescriptAst({ ast: parent, path: [] }));
        const continuationPointer = await this.store.save(
          fromPurescriptAst(continuation)
        );
        await this.store.decrementReferenceCount(parentKey);
        await this.store.decrementReferenceCount(childKey);
        return this.remoteRun(continuationPointer);
      }
    }
  }
  public remoteRun(termPointer: Key) {
    return this.run(termPointer);
  }
  private makePlaceholder(key: Key) {
    return toPurescriptAst({
      ast: { type: "Provided", value: (key as any) as string },
      path: []
    });
  }
}

export class RestClusterClient implements Cluster<string> {
  constructor(private url: string) {}
  public async remoteRun(termPointer: string) {
    const response = await fetch(
      this.url + "?termKey=" + encodeURIComponent(termPointer)
    );
    const result = await response.text();
    return result;
  }
}

function LocalClient<Key extends Serializable>({
  store,
  cluster
}: {
  store: Store<Key, BasicAst>;
  cluster: Cluster<Key>;
}): Client {
  return {
    async run(ast: BasicAst) {
      const source = ast;
      const sourcePointer = await store.save(source);
      const resultPointer = await cluster.remoteRun(sourcePointer);
      const value = await store.read(resultPointer);
      await store.decrementReferenceCount(sourcePointer);
      await store.decrementReferenceCount(resultPointer);
      return value;
    }
  };
}

export class KeyvaluexyzStore implements Store<string, BasicAst> {
  public async read(key: string) {
    const value = await fetch(key).then(res => res.json());
    return value;
  }
  public async save(term: BasicAst) {
    const key = await fetch("https://api.keyvalue.xyz/new/key", {
      method: "POST"
    }).then(res => res.text());
    await fetch(key, { method: "POST", body: JSON.stringify(term) });
    return key;
  }
  public async incrementReferenceCount() {
    return;
  }
  public async decrementReferenceCount() {
    return;
  }
}

export const localStore = new LocalInMemoryStore();
export const xyzStore = new KeyvaluexyzStore();
export const restClusterClient = new RestClusterClient(
  "https://distributed-lambda-calculus.now.sh/run.js"
  // "http://localhost:8080"
);
export const localClusterWithXYZStore = new LocalSingleThreadedCluster(
  xyzStore
);
export const localClusterWithInMemoryStore = new LocalSingleThreadedCluster(
  localStore
);

export const distributedExecutionDemo = LocalClient({
  store: xyzStore,
  cluster: restClusterClient
});
