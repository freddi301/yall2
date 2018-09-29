import { Ast } from "../Ast/Ast";
import { evaluate, fromPurescriptAst, toPurescriptAst } from "./purescript";

const ctx: Worker = self as any;

ctx.onmessage = ({
  data: { evaluationStrategy, ast, path }
}: {
  data: {
    evaluationStrategy: keyof (typeof evaluate);
    ast: Ast;
    path: string[];
  };
}) => {
  const purescriptAst = toPurescriptAst({ ast, path });
  const result = evaluate[evaluationStrategy](purescriptAst);
  const resultAst = fromPurescriptAst(result);
  ctx.postMessage(resultAst);
};
