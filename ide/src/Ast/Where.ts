import { Ast } from "./Ast";
import { Abstraction } from "./Abstraction";

export interface Where {
  type: "Where";
  body: Ast;
  scope: Abstraction[];
  source: string[];
}
