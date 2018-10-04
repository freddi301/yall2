import { Ast } from "../AstComponents/Ast/Ast";
import {
  Abstraction,
  Application,
  Reference,
  PurescriptAst
} from "../language/Yall.Ast";

export function toPurescriptAst({
  ast,
  path
}: {
  ast: Ast;
  path: string[];
}): PurescriptAst<string, string[]> {
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
    case "Infix":
      return Application.create(
        Application.create(
          toPurescriptAst({ ast: ast.operator, path: path.concat("operator") })
        )(toPurescriptAst({ ast: ast.left, path: path.concat("left") }))(path)
      )(toPurescriptAst({ ast: ast.right, path: path.concat("right") }))(path);
    case "Where":
      return ast.scope
        .slice()
        .reverse()
        .reduce((memo, { identifier, body }, index, { length }) => {
          const position = length - 1 - index;
          const bodyAst = toPurescriptAst({
            ast: body,
            path: path.concat(["scope", String(position), "body"])
          });
          const supplyScope = Abstraction.create(identifier)(memo)(path);
          return Application.create(supplyScope)(bodyAst)(path);
        }, toPurescriptAst({ ast: ast.body, path: path.concat("body") }));
  }
}
