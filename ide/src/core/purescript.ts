import { Ast } from "../Ast/Ast";
import { Abstraction, Application, Reference } from "../language/Yall.Ast";
import {
  evaluateEager,
  evaluateLazy,
  evaluateSymbolic,
  debugEager,
  debugLazy
} from "../language/Yall.External";
import { Intermediate, End } from "../language/Yall.Pauseable";

type PurescriptAst = any;

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

function debuggerFactory(debug: (ast: any) => any) {
  function* stepper(ast: PurescriptAst): IterableIterator<PurescriptAst> {
    let step = debug(ast);
    while (true) {
      if (step instanceof End) {
        yield step.value0;
        return;
      } else if (step instanceof Intermediate) {
        yield step.value0;
        step = step.value1(step.value0);
      } else {
        throw new Error("Debugger error");
      }
    }
  }
  return stepper;
}

export const debug = {
  eager: debuggerFactory(debugEager),
  lazy: debuggerFactory(debugLazy)
};
