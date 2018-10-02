import {
  evaluateEager,
  evaluateLazy,
  evaluateSymbolic
} from "../language/Yall.External";
import { PurescriptAst } from "./PurescriptAst";

export type EvaluationStrategy = keyof (typeof evaluate);

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
