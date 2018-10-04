import { Ast } from "../Ast";

export interface TextComment {
  type: "TextComment";
  ast: Ast;
  text: string;
}
