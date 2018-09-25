import { Ast } from "../Ast/Ast";
import { evaluate, fromPurescriptAst, toPurescriptAst } from "./purescript";

const ctx: Worker = self as any;

ctx.onmessage = ({
  data: { evaluationStrategy, ast }
}: {
  data: { evaluationStrategy: keyof (typeof evaluate); ast: Ast };
}) => {
  const purescriptAst = toPurescriptAst(ast);
  const result = evaluate[evaluationStrategy](purescriptAst);
  const resultAst = fromPurescriptAst(result);
  ctx.postMessage(resultAst);
};
