import { Ast } from "../Ast/Ast";
import { Abstraction, Application, Reference } from "../language/Yall.Ast";
import {
  evaluateEager,
  evaluateLazy,
  evaluateSymbolic
} from "../language/Yall.External";

type PurescriptAst = any;

// TODO: add source based on path
export function toPurescriptAst(ast: Ast): PurescriptAst {
  switch (ast.type) {
    case "Reference":
      return Reference.create(ast.identifier)([]);
    case "Application":
      return Application.create(toPurescriptAst(ast.left))(
        toPurescriptAst(ast.right)
      )([]);
    case "Abstraction":
      return Abstraction.create(ast.head)(toPurescriptAst(ast.body))([]);
  }
}

export function fromPurescriptAst(
  ast: PurescriptAst
): Ast & { source: string[] } {
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
  },
  symbolic(ast: PurescriptAst): PurescriptAst {
    return evaluateSymbolic(ast);
  }
};

export type EvaluationStrategy = keyof (typeof evaluate);
