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
import * as firebase from "firebase/app";
import "firebase/database";

// key value distributed store (eventual consistency)
interface Store<Key extends Serializable, Value extends Serializable> {
  read(key: Key): Promise<{ value: Value }>;
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
    { value: BasicAst; referenceCount: number }
  >;
  private nextKey = 0;
  public async read(key: string) {
    const entry = this.data[key];
    if (entry) {
      return entry;
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
  public async run(termKey: Key): Promise<Key> {
    const result = await this.execute(termKey);
    switch (result.type) {
      case "result": {
        await this.store.decrementReferenceCount(termKey);
        return result.term;
      }
      case "fork": {
        const parentTask = this.run(result.parent).then(async k => ({
          parentKey: k,
          parent: await this.store.read(k)
        }));
        const childTask = this.run(result.child).then(async k => ({
          childKey: k,
          child: await this.store.read(k)
        }));
        const [{ parentKey, parent }, { childKey, child }] = await Promise.all([
          parentTask,
          childTask
        ]);
        const continuation = replace(this.makePlaceholder(result.child))(
          toPurescriptAst({ ast: child.value, path: [] })
        )(toPurescriptAst({ ast: parent.value, path: [] }));
        const continuationPointer = await this.store.save(
          fromPurescriptAst(continuation)
        );
        await this.store.decrementReferenceCount(parentKey);
        await this.store.decrementReferenceCount(childKey);
        return this.run(continuationPointer);
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
      const sourcePointer = await store.save(source);
      const resultPointer = await cluster.run(sourcePointer);
      const { value } = await store.read(resultPointer);
      await store.decrementReferenceCount(sourcePointer);
      await store.decrementReferenceCount(resultPointer);
      return value;
    }
  };
}

class FirebaseStore implements Store<string, BasicAst> {
  private app = firebase.initializeApp({
    apiKey: "AIzaSyA-_VwJwwTIYRP3h9wReqTZjmRRhD7pP0o",
    authDomain: "distributed-lambda-calculus.firebaseapp.com",
    databaseURL: "https://distributed-lambda-calculus.firebaseio.com",
    projectId: "distributed-lambda-calculus",
    storageBucket: "",
    messagingSenderId: "900059068998"
  });
  private data = this.app.database().ref("data");
  public async read(key: string) {
    const result = (await this.data.child(key).once("value")).val();
    return result as any;
  }
  public async save(value: BasicAst) {
    const ref = this.data.push();
    await ref.set({ value, referenceCount: 1 });
    return ref.key as string;
  }
  public async incrementReferenceCount(key: string) {
    await this.updateReference(key, n => n + 1);
  }
  public async decrementReferenceCount(key: string) {
    const newRefCount = await this.updateReference(key, n => n - 1);
    if (newRefCount <= 0) {
      await this.data.child(key).remove();
    }
  }
  private async updateReference(
    key: string,
    f: (refCount: number) => number
  ): Promise<number> {
    const actual: number = (await this.data
      .child("key")
      .child("referenceCount")
      .once("value")).val() as any;
    const newCount = f(actual);
    await this.data
      .child(key)
      .child("referenceCount")
      .set(newCount);
    return newCount;
  }
}

export const localStore = new LocalInMemoryStore();
export const firebaseStore = new FirebaseStore();
const store = firebaseStore;
const cluster = new LocalSingleThreadedCluster(store);
export const distributedExecutionDemo = LocalClient({ store, cluster });
