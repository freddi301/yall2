import { InlineAst } from "./Ast";

export interface Abstraction {
  type: "Abstraction";
  head: string;
  body: InlineAst;
}
