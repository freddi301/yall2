import { Ast } from "../Ast/Ast";
import { createStateManagment } from "../utils/reduxLike";
import { EvaluationStrategy } from "../core/evaluate";

export interface IdeState {
  activeEditor: string;
  editors: Record<string, Editor>;
  evaluationStrategy: EvaluationStrategy;
  clipboard: Ast;
}

export interface Editor {
  ast: Ast;
  path: string[];
  selected: string[];
}

export const initial: IdeState = {
  activeEditor: "main",
  editors: {
    main: {
      ast: { type: "Reference", identifier: "x" },
      path: [],
      selected: []
    }
  },
  evaluationStrategy: "eager",
  clipboard: { type: "Reference", identifier: "x" }
};

function select(
  state: IdeState,
  { path: selected }: { path: string[] }
): IdeState {
  return inEditor({
    editor: state.activeEditor,
    state,
    action(editorState) {
      return { ...editorState, selected };
    }
  });
}

function replace(state: IdeState, { ast }: { ast: Ast }): IdeState {
  return inEditor({
    editor: state.activeEditor,
    state,
    action(editorState) {
      return { ...editorState, ast };
    }
  });
}

function clip(state: IdeState, { ast: clipboard }: { ast: Ast }): IdeState {
  return { ...state, clipboard };
}

function setEvaluationStrategy(
  state: IdeState,
  { evaluationStrategy }: { evaluationStrategy: EvaluationStrategy }
): IdeState {
  return { ...state, evaluationStrategy };
}

function inEditor({
  editor,
  state,
  action
}: {
  editor: string;
  state: IdeState;
  action(editor: Editor): Editor;
}): IdeState {
  return {
    ...state,
    editors: { ...state.editors, [editor]: action(state.editors[editor]) }
  };
}

export const {
  reducer,
  actions,
  dispatch,
  boundActions,
  handlers
} = createStateManagment({
  select,
  replace,
  clip,
  setEvaluationStrategy
});
