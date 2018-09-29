import Worker from "worker-loader!./evaluateWorker";
import { Ast } from "../Ast/Ast";
import { EvaluationStrategy } from "./purescript";

export function evaluate(args: {
  ast: Ast;
  path: string[];
  evaluationStrategy: EvaluationStrategy;
}): Promise<Ast & { source: string[] }> {
  return new Promise((resolve, reject) => {
    const worker = new Worker();
    worker.onmessage = ({ data }) => {
      resolve(data);
      worker.terminate();
    };
    setTimeout(() => {
      worker.terminate();
      reject(new Error("Computation timed out"));
    }, 3000);
    worker.postMessage(args);
  });
}
