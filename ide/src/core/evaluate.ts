import {
  evaluateEager,
  evaluateLazy,
  evaluateSymbolic
} from "../language/Yall.External";
import { PurescriptAst } from "../language/Yall.Ast";

export type EvaluationStrategy = keyof (typeof evaluate);

export const evaluate = {
  eager(ast: PurescriptAst<string, string[]>): PurescriptAst<string, string[]> {
    return evaluateEager(ast);
  },
  lazy(ast: PurescriptAst<string, string[]>): PurescriptAst<string, string[]> {
    return evaluateLazy(ast);
  },
  symbolic(
    ast: PurescriptAst<string, string[]>
  ): PurescriptAst<string, string[]> {
    return evaluateSymbolic(ast);
  }
};
