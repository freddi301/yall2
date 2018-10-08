import {
  // evaluateEager,
  evaluateLazy,
  evaluateSymbolic
} from "../language/Yall.External";
import { PurescriptAst, Provided } from "../language/Yall.Ast";
import { evaluateWith } from "./evaluateWith";
import { fromPurescriptAst } from "./fromPurescriptAst";

export type EvaluationStrategy = keyof (typeof evaluate);

export const evaluate = {
  // eager(
  //   ast: PurescriptAst<string, string[], string>
  // ): PurescriptAst<string, string[], string> {
  //   return evaluateEager(ast);
  // },
  eager(
    ast: PurescriptAst<string, string[], string>
  ): PurescriptAst<string, string[], string> {
    return evaluateWith.eager({
      ast,
      decorator(
        purescriptAst: PurescriptAst<string, string[], string>
      ): PurescriptAst<string, string[], string> {
        const node = fromPurescriptAst(purescriptAst);
        if (
          node.type === "Application" &&
          node.left.type === "Provided" &&
          node.right.type === "Provided" &&
          node.left.value === "inc" &&
          /[0-9]+/.test(node.right.value)
        ) {
          const value = `${Number(node.right.value.slice(1)) + 1}`;
          return Provided.create(value)(node.source);
        }
        return purescriptAst;
      }
    });
  },
  lazy(
    ast: PurescriptAst<string, string[], string>
  ): PurescriptAst<string, string[], string> {
    return evaluateLazy(ast);
  },
  symbolic(
    ast: PurescriptAst<string, string[], string>
  ): PurescriptAst<string, string[], string> {
    return evaluateSymbolic(ast);
  }
};
