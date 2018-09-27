import { Ast } from "./Ast";

export interface Abstraction {
  type: "Abstraction";
  head: string;
  body: Ast;
  source: string[];
}
