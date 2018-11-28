import { Ast } from "../AstComponents/Ast/Ast";
import {
  Abstraction,
  Application,
  Reference,
  PurescriptAst,
  Provided
} from "../language/Yall.Ast";
import { PurescriptSymbol, Symbol } from "../language/Yall.Evaluate.Symbol";

export function toPurescriptAst({
  ast,
  path
}: {
  ast: Ast;
  path: string[];
}): PurescriptAst<PurescriptSymbol<string, number>, string[], string> {
  switch (ast.type) {
    case "Reference":
      return Reference.create(Symbol.create(ast.identifier)(0))(path);
    case "Application":
      return Application.create(
        toPurescriptAst({ ast: ast.left, path: path.concat("left") })
      )(toPurescriptAst({ ast: ast.right, path: path.concat("right") }))(path);
    case "Abstraction":
      return Abstraction.create(Symbol.create(ast.head)(0))(
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
          const scopePath = path.concat(["scope", String(position)]);
          const supplyScope = Abstraction.create(Symbol.create(identifier)(0))(
            memo
          )(scopePath);
          return Application.create(supplyScope)(bodyAst)(path);
        }, toPurescriptAst({ ast: ast.body, path: path.concat("body") }));
    case "Provided":
      return Provided.create(ast.value)(path);
  }
}
