import { Ast } from "../Ast/Ast";

export interface TextComment {
  type: "TextComment";
  ast: Ast;
  text: string;
}
