import { InlineAst } from "../Ast/Ast";

export interface Infix {
  type: "Infix";
  operator: InlineAst;
  left: InlineAst;
  right: InlineAst;
}
