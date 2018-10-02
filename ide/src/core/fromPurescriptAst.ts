import { Ast } from "../Ast/Ast";
import { Abstraction, Application, Reference } from "../language/Yall.Ast";
import { PurescriptAst } from "./PurescriptAst";

export function fromPurescriptAst(
  ast: PurescriptAst
): Ast & {
  source: string[];
} {
  if (ast instanceof Reference) {
    return { type: "Reference", identifier: ast.value0, source: ast.value1 };
  } else if (ast instanceof Application) {
    return {
      type: "Application",
      left: fromPurescriptAst(ast.value0),
      right: fromPurescriptAst(ast.value1),
      source: ast.value2
    };
  } else if (ast instanceof Abstraction) {
    return {
      type: "Abstraction",
      head: ast.value0,
      body: fromPurescriptAst(ast.value1),
      source: ast.value2
    };
  } else {
    throw new Error();
  }
}
