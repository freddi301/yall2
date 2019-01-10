import {
  debugEager,
  debugLazy,
  debugSymbolic,
  debugLazySymbolic,
  getResult,
  nextWith
} from "../language/Yall.External";
import { WaitRecur, Wait, Recur, End } from "../language/Yall.Pauseable";
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
        yield getResult(step);
        return;
      } else if (
        step instanceof Wait ||
        step instanceof Recur ||
        step instanceof WaitRecur
      ) {
        const result = getResult(step);
        const modified = yield result;
        step = nextWith(modified || result)(step);
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
