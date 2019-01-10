import { BasicAst } from "src/AstComponents/Ast/Ast";
import { toPurescriptAst } from "./toPurescriptAst";
import {
  debugLazySymbolic,
  next,
  getResult,
  nextWith,
  nextNoRecur
  // reify
} from "../language/Yall.External";
import { End } from "../language/Yall.Pauseable";
import { fromPurescriptAst } from "./fromPurescriptAst";

// key value distributed store (eventual consistency)
interface Store<Key extends Serializable, Value extends Serializable> {
  read(key: Key): Promise<{ value: Value; dependencies: Key[] }>;
  save(value: Value, dependencies: Key[]): Promise<Key>;
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
  execute(termPointer: Key): Promise<Result<Key>>;
  run(termPointer: Key): Promise<Key>;
}

interface Client {
  run(ast: BasicAst): Promise<BasicAst>;
}

type Serializable = any;

class LocalInMemoryStore implements Store<string, BasicAst> {
  private data = {} as Record<
    string,
    { value: BasicAst; dependencies: string[] }
  >;
  private nextKey = 0;
  public async read(key: string) {
    const entry = this.data[key];
    if (entry) {
      return entry;
    }
    throw new Error("not found");
  }
  public async save(value: BasicAst, dependencies: string[]) {
    const key = String(this.nextKey++);
    this.data[key] = { value, dependencies };
    return key;
  }
}

class LocalSingleThreadedCluster<Key extends Serializable>
  implements Cluster<Key> {
  constructor(private store: Store<Key, BasicAst>) {}
  public async execute(termKey: Key): Promise<Result<Key>> {
    const term = await this.store.read(termKey);
    let step = debugLazySymbolic(
      toPurescriptAst({ ast: term.value, path: [] })
    );
    let computationQuota = 19;
    while (computationQuota-- && !(step instanceof End)) {
      step = next(step);
    }
    if (step instanceof End) {
      const resultUri = await this.store.save(
        fromPurescriptAst(getResult(step)),
        term.dependencies
      );
      return { type: "result", term: resultUri };
    }
    const intermediate = getResult(step);
    const intermediateUri = await this.store.save(
      fromPurescriptAst(intermediate),
      term.dependencies
    );
    const placeholder = this.makePlaceholder(intermediateUri);
    step = nextWith(placeholder)(step);
    while (!(step instanceof End)) {
      step = nextNoRecur(step);
    }
    const resultUri = await this.store.save(
      fromPurescriptAst(getResult(step)),
      term.dependencies.concat([intermediateUri])
    );
    return { type: "fork", parent: resultUri, child: intermediateUri };
  }
  public async run(termKey: Key): Promise<Key> {
    const result = await this.execute(termKey);
    switch (result.type) {
      case "result":
        return result.term;
      case "fork": {
        return result.parent;
        // const parentTask = this.run(result.parent).then(k =>
        //   this.store.read(k)
        // );
        // const childTask = this.run(result.child).then(k => this.store.read(k));
        // const [parent, child] = await Promise.all([parentTask, childTask]);
        // const continuation = reify(result.child)(
        //   toPurescriptAst({ ast: child, path: [] })
        // )(toPurescriptAst({ ast: parent, path: [] }));
        // const continuationPointer = await this.store.save(
        //   fromPurescriptAst(continuation)
        // );
        // return this.run(continuationPointer);
      }
    }
  }
  private makePlaceholder(key: Key) {
    return toPurescriptAst({
      ast: { type: "Provided", value: (key as any) as string },
      path: []
    });
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
      const sourcePointer = await store.save(source, []);
      const resultPointer = await cluster.run(sourcePointer);
      const { value } = await store.read(resultPointer);
      return value;
    }
  };
}

const store = new LocalInMemoryStore();
const cluster = new LocalSingleThreadedCluster(store);
export const distributedExecutionDemo = LocalClient({ store, cluster });
