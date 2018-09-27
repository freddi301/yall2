import { Ast } from "./Ast";
export interface Application {
  type: "Application";
  left: Ast;
  right: Ast;
  source: string[];
}
