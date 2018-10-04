import { InlineAst } from "../Ast";

export interface Infix {
  type: "Infix";
  operator: InlineAst;
  left: InlineAst;
  right: InlineAst;
}
