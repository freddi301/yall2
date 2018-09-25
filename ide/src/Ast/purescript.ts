import { Abstraction, Application, Reference } from "../language/Yall.Ast";
import { evaluateEager, evaluateLazy } from "../language/Yall.External";
import { Ast } from "./Ast";

type PurescriptAst = any;

export function toPurescriptAst(ast: Ast): PurescriptAst {
  switch (ast.type) {
    case "Reference":
      return Reference.create(ast.identifier)(ast.source);
    case "Application":
      return Application.create(toPurescriptAst(ast.left))(
        toPurescriptAst(ast.right)
      )(ast.source);
    case "Abstraction":
      return Abstraction.create(ast.head)(toPurescriptAst(ast.body))(
        ast.source
      );
  }
}

export function fromPurescriptAst(ast: PurescriptAst): Ast {
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

export const evaluate = {
  eager(ast: PurescriptAst): PurescriptAst {
    return evaluateEager(ast);
  },
  lazy(ast: PurescriptAst): PurescriptAst {
    return evaluateLazy(ast);
  }
};
