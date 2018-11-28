import {
  debugEager,
  debugLazy,
  debugSymbolic,
  debugLazySymbolic
} from "../language/Yall.External";
import { Intermediate, End } from "../language/Yall.Pauseable";
import { PurescriptAst } from "../language/Yall.Ast";
import { PurescriptSymbol } from "src/language/Yall.Evaluate.Symbol";

function debuggerFactory(debug: (ast: any) => any) {
  function* stepper(
    ast: PurescriptAst<PurescriptSymbol<string, number>, string[], string>
  ): IterableIterator<
    PurescriptAst<PurescriptSymbol<string, number>, string[], string>
  > {
    let step = debug(ast);
    while (true) {
      if (step instanceof End) {
        yield step.value0;
        return;
      } else if (step instanceof Intermediate) {
        const modified = yield step.value0;
        step = step.value1(modified || step.value0);
      } else {
        throw new Error("Debugger error");
      }
    }
  }
  return stepper;
}

export const debug = {
  eager: debuggerFactory(debugEager),
  lazy: debuggerFactory(debugLazy),
  symbolic: debuggerFactory(debugSymbolic),
  lazySymbolic: debuggerFactory(debugLazySymbolic)
};
