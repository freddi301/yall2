import { createStore } from "redux";
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

const initial: IdeState = {
  ast: { type: "Reference", identifier: "x", source: "" },
  path: [],
  selected: [],
  evaluationStrategy: "symbolic",
  clipboard: { type: "Reference", identifier: "x", source: "" }
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

const reduxReducer: typeof reducer = (state, action) => {
  if (action.type.startsWith("@@redux")) {
    return state;
  } else {
    return reducer(state, action);
  }
};

export const store = createStore(reduxReducer, initial);
