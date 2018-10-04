import { InlineAst } from "../Ast/Ast";

export interface Abstraction {
  type: "Abstraction";
  head: string;
  body: InlineAst;
}
