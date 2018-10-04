import { Ast } from "../AstComponents/Ast";
import { boundActions, IdeState, Editor } from "../Ide/stateManagment";
import { set } from "lodash";
import produce from "immer";

export function insertNode(
  { activeEditor, editors, replace }: IdeState & typeof boundActions,
  node: Ast
) {
  const { selected, ast } = editors[activeEditor];
  if (selected.length === 0) {
    replace({ ast: node });
  } else {
    const newAst = produce(ast, draftAst => {
      set(draftAst, selected, node);
    });
    replace({ ast: newAst });
  }
}

export function getActiveEditor({ editors, activeEditor }: IdeState): Editor {
  return editors[activeEditor];
}
