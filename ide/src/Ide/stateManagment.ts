import { Ast } from "../AstComponents/Ast";
import { createStateManagment } from "../utils/reduxLike";
import { EvaluationStrategy } from "../core/evaluate";
import * as welcomeAst from "../samples/church-boolean.test.yall.json";

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
      ast: (welcomeAst as any) as Ast,
      path: [],
      selected: []
    },
    debugger: {
      ast: { type: "Reference", identifier: "placeholder" },
      path: [],
      selected: []
    }
  },
  evaluationStrategy: "eager",
  clipboard: { type: "Reference", identifier: "x" }
};

function setActiveEditor(
  state: IdeState,
  { activeEditor }: { activeEditor: string }
): IdeState {
  if (!state.editors[activeEditor]) {
    throw new Error(`Editor instance does not exists: ${activeEditor}`);
  }
  return { ...state, activeEditor };
}

function select(
  state: IdeState,
  { path: selected, editor }: { path: string[]; editor?: string }
): IdeState {
  return inEditor({
    editor: editor || state.activeEditor,
    state,
    action(editorState) {
      return { ...editorState, selected };
    }
  });
}

function replace(
  state: IdeState,
  { ast, editor }: { ast: Ast; editor?: string }
): IdeState {
  return inEditor({
    editor: editor || state.activeEditor,
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
  setActiveEditor,
  select,
  replace,
  clip,
  setEvaluationStrategy
});
