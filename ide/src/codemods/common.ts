import { Ast } from "../Ast/Ast";
import { boundActions, IdeState } from "../Ide/reducer";
import { set } from "lodash";
import produce from "immer";

export function insertNode(
  { selected, ast, replace }: IdeState & typeof boundActions,
  node: Ast
) {
  if (selected.length === 0) {
    replace(node);
  } else {
    const newAst = produce(ast, draftAst => {
      set(draftAst, selected, node);
    });
    replace(newAst);
  }
}
