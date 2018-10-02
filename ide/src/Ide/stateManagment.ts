import { Ast } from "../Ast/Ast";
import { createStateManagment } from "../utils/reduxLike";
import { EvaluationStrategy } from "../core/evaluate";

export interface IdeState {
  ast: Ast;
  path: string[];
  selected: string[];
  evaluationStrategy: EvaluationStrategy;
  clipboard: Ast;
}

export const initial: IdeState = {
  ast: { type: "Reference", identifier: "x" },
  path: [],
  selected: [],
  evaluationStrategy: "eager",
  clipboard: { type: "Reference", identifier: "x" }
};

export const {
  reducer,
  actions,
  dispatch,
  boundActions,
  handlers
} = createStateManagment<IdeState>()({
  select(state, path: string[]) {
    return { ...state, selected: path };
  },
  selectForEvaluation(state, path: string[]) {
    return { ...state, selectedForEvaluation: path };
  },
  replace(state, ast: Ast) {
    return { ...state, ast };
  },
  clip(state, ast: Ast) {
    return { ...state, clipboard: ast };
  },
  setEvaluationStrategy(state, evaluationStrategy: EvaluationStrategy) {
    return { ...state, evaluationStrategy };
  }
});
