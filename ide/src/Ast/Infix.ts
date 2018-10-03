import { Ast } from "./Ast";

export interface Infix {
  type: "Infix";
  operator: Ast;
  left: Ast;
  right: Ast;
}
