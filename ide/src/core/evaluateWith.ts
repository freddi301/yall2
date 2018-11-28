import { PurescriptAst } from "../language/Yall.Ast";
import { debug } from "./debug";
import { PurescriptSymbol } from "src/language/Yall.Evaluate.Symbol";

export const evaluateWith = {
  eager({
    ast,
    decorator
  }: {
    ast: PurescriptAst<PurescriptSymbol<string, number>, string[], string>;
    decorator(
      ast: PurescriptAst<PurescriptSymbol<string, number>, string[], string>
    ): PurescriptAst<PurescriptSymbol<string, number>, string[], string>;
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
