import { debugEager, debugLazy } from "../language/Yall.External";
import { Intermediate, End } from "../language/Yall.Pauseable";
import { PurescriptAst } from "./PurescriptAst";

function debuggerFactory(debug: (ast: any) => any) {
  function* stepper(ast: PurescriptAst): IterableIterator<PurescriptAst> {
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
  lazy: debuggerFactory(debugLazy)
};
