import { InlineAst } from "../Ast";

export interface Application {
  type: "Application";
  left: InlineAst;
  right: InlineAst;
}
