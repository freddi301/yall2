import { PurescriptAst } from "../language/Yall.Ast/Ast";
import { debug } from "./debug";

export const evaluateWith = {
  eager({
    ast,
    decorator
  }: {
    ast: PurescriptAst<string, string[]>;
    decorator(
      ast: PurescriptAst<string, string[]>
    ): PurescriptAst<string, string[]>;
  }) {
    const stepper = debug.eager(ast);
    let step = { done: false, value: ast };
    while (!step.done) {
      const next = decorator(step.value);
      step = stepper.next(next);
    }
    return step.value;
  }
};