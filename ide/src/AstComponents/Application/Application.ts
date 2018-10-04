import { InlineAst } from "../Ast/Ast";

export interface Application {
  type: "Application";
  left: InlineAst;
  right: InlineAst;
}
