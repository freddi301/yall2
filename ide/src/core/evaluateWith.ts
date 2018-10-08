import { PurescriptAst } from "../language/Yall.Ast";
import { debug } from "./debug";

export const evaluateWith = {
  eager({
    ast,
    decorator
  }: {
    ast: PurescriptAst<string, string[], string>;
    decorator(
      ast: PurescriptAst<string, string[], string>
    ): PurescriptAst<string, string[], string>;
  }) {
    const stepper = debug.eager(decorator(ast));
    let lastValue = ast;
    let cycle = 0;
    while (cycle++ < 1000) {
      const next = decorator(lastValue);
      const { done, value } = stepper.next(next);
      if (done) {
        return lastValue;
      } else {
        lastValue = value;
      }
    }
    throw new Error("Execution limitexceeded");
  }
};
