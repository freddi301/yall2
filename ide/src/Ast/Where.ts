import { InlineAst } from "./Ast";

export interface Where {
  type: "Application";
  body: InlineAst;
  scope: Array<{ identifier: string; body: Where | InlineAst }>;
}
