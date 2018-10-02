import { Ast } from "../Ast/Ast";
import { Abstraction, Application, Reference } from "../language/Yall.Ast";
import { PurescriptAst } from "./PurescriptAst";

export function toPurescriptAst({
  ast,
  path
}: {
  ast: Ast;
  path: string[];
}): PurescriptAst {
  switch (ast.type) {
    case "Reference":
      return Reference.create(ast.identifier)(path);
    case "Application":
      return Application.create(
        toPurescriptAst({ ast: ast.left, path: path.concat("left") })
      )(toPurescriptAst({ ast: ast.right, path: path.concat("right") }))(path);
    case "Abstraction":
      return Abstraction.create(ast.head)(
        toPurescriptAst({ ast: ast.body, path: path.concat("body") })
      )(path);
  }
}
