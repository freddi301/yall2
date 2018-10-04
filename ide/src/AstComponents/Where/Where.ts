import { InlineAst } from "../Ast/Ast";

export interface Where {
  type: "Where";
  body: InlineAst;
  scope: WhereScope[];
}

export interface WhereScope {
  type: "WhereScope";
  identifier: string;
  body: Where | InlineAst;
}
