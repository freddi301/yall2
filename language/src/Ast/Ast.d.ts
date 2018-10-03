export type PurescriptAst<Identifier, Source> =
  | Reference<Identifier, Source>
  | Application<Identifier, Source>
  | Abstraction<Identifier, Source>;

export class Reference<Identifier, Source> {
  public value0: Identifier;
  public value1: Source;
  public static create: <Identifier>(
    identifier: Identifier
  ) => <Source>(source: Source) => Reference<Identifier, Source>;
}

export class Application<Identifier, Source> {
  public value0: PurescriptAst<Identifier, Source>;
  public value1: PurescriptAst<Identifier, Source>;
  public value2: Source;
  public static create: <Identifier, Source>(
    left: PurescriptAst<Identifier, Source>
  ) => (
    right: PurescriptAst<Identifier, Source>
  ) => (source: Source) => Reference<Identifier, Source>;
}

export class Abstraction<Identifier, Source> {
  public value0: Identifier;
  public value1: PurescriptAst<Identifier, Source>;
  public value2: Source;
  public static create: <Identifier>(
    head: Identifier
  ) => <Source>(
    body: PurescriptAst<Identifier, Source>
  ) => (source: Source) => Reference<Identifier, Source>;
}
