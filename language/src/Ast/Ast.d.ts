export type PurescriptAst<Identifier, Source, Provided> =
  | Reference<Identifier, Source, Provided>
  | Application<Identifier, Source, Provided>
  | Abstraction<Identifier, Source, Provided>;

export class Reference<Identifier, Source, Provided> {
  public value0: Identifier;
  public value1: Source;
  public static create: <Identifier, Provided>(
    identifier: Identifier
  ) => <Source>(source: Source) => Reference<Identifier, Source, Provided>;
}

export class Application<Identifier, Source, Provided> {
  public value0: PurescriptAst<Identifier, Source, Provided>;
  public value1: PurescriptAst<Identifier, Source, Provided>;
  public value2: Source;
  public static create: <Identifier, Source, Provided>(
    left: PurescriptAst<Identifier, Source, Provided>
  ) => (
    right: PurescriptAst<Identifier, Source, Provided>
  ) => (source: Source) => Reference<Identifier, Source, Provided>;
}

export class Abstraction<Identifier, Source, Provided> {
  public value0: Identifier;
  public value1: PurescriptAst<Identifier, Source, Provided>;
  public value2: Source;
  public static create: <Identifier>(
    head: Identifier
  ) => <Source, Provided>(
    body: PurescriptAst<Identifier, Source, Provided>
  ) => (source: Source) => Reference<Identifier, Source, Provided>;
}
