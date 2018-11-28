export type PurescriptSymbol<Identifier, Variation> = Symbol<
  Identifier,
  Variation
>;

export class Symbol<Identifier, Variation> {
  public value0: Identifier;
  public value1: Variation;
  public static create: <Identifier>(
    identifier: Identifier
  ) => <Variation>(variation: Variation) => Symbol<Identifier, Variation>;
}
