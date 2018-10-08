export type PurescriptAst<Identifier, Source, ProvidedValue> =
  | Reference<Identifier, Source, ProvidedValue>
  | Application<Identifier, Source, ProvidedValue>
  | Abstraction<Identifier, Source, ProvidedValue>
  | Provided<Identifier, Source, ProvidedValue>;

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

export class Provided<Identifier, Source, ProvidedValue> {
  public value0: ProvidedValue;
  public value1: Source;
  public static create: <Identifier, ProvidedValue>(
    value: ProvidedValue
  ) => <Source>(source: Source) => Provided<Identifier, Source, ProvidedValue>;
}
