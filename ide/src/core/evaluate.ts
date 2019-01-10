import {
  evaluateEager,
  evaluateLazy,
  evaluateSymbolic,
  evaluateLazySymbolic
} from "../language/Yall.External";
import { PurescriptAst /*Provided*/ } from "../language/Yall.Ast";
// import { evaluateWith } from "./evaluateWith";
// import { fromPurescriptAst } from "./fromPurescriptAst";
import { PurescriptSymbol } from "src/language/Yall.Evaluate.Symbol";

export type EvaluationStrategy = keyof (typeof evaluate);

export const evaluate = {
  eager(
    ast: PurescriptAst<PurescriptSymbol<string, number>, string[], string>
  ): PurescriptAst<PurescriptSymbol<string, number>, string[], string> {
    return evaluateEager(ast);
  },
  // eager(
  //   ast: PurescriptAst<PurescriptSymbol<string, number>, string[], string>
  // ): PurescriptAst<PurescriptSymbol<string, number>, string[], string> {
  //   return evaluateWith.eager({
  //     ast,
  //     decorator(
  //       purescriptAst: PurescriptAst<
  //         PurescriptSymbol<string, number>,
  //         string[],
  //         string
  //       >
  //     ): PurescriptAst<PurescriptSymbol<string, number>, string[], string> {
  //       const node = fromPurescriptAst(purescriptAst);
  //       if (
  //         node.type === "Application" &&
  //         node.left.type === "Provided" &&
  //         node.right.type === "Provided" &&
  //         node.left.value === "inc" &&
  //         /[0-9]+/.test(node.right.value)
  //       ) {
  //         const value = `${Number(node.right.value.slice(1)) + 1}`;
  //         return Provided.create(value)(node.source);
  //       }
  //       return purescriptAst;
  //     }
  //   });
  // },
  lazy(
    ast: PurescriptAst<PurescriptSymbol<string, number>, string[], string>
  ): PurescriptAst<PurescriptSymbol<string, number>, string[], string> {
    return evaluateLazy(ast);
  },
  symbolic(
    ast: PurescriptAst<PurescriptSymbol<string, number>, string[], string>
  ): PurescriptAst<PurescriptSymbol<string, number>, string[], string> {
    return evaluateSymbolic(ast);
  },
  lazySymbolic(
    ast: PurescriptAst<PurescriptSymbol<string, number>, string[], string>
  ): PurescriptAst<PurescriptSymbol<string, number>, string[], string> {
    return evaluateLazySymbolic(ast);
  }
};
