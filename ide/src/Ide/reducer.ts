import { Ast } from "../Ast/Ast";
import { EvaluationStrategy } from "../core/purescript";
import { createStateManagment } from "../utils/reduxLike";

export interface IdeState {
  ast: Ast;
  path: string[];
  selected: string[];
  evaluationStrategy: EvaluationStrategy;
  clipboard: Ast;
}

export const initial: IdeState = {
  ast: { type: "Reference", identifier: "x", source: [] },
  path: [],
  selected: [],
  evaluationStrategy: "symbolic",
  clipboard: { type: "Reference", identifier: "x", source: [] }
};

export const {
  reducer,
  actions,
  dispatch,
  boundActions
} = createStateManagment<IdeState>()({
  select(state, path: string[]) {
    return { ...state, selected: path };
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
