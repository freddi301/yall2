import { Ast } from "../Ast/Ast";
import { boundActions, IdeState } from "../Ide/reducer";
import { set, cloneDeep } from "lodash";

export function insertNode(
  { selected, ast, replace }: IdeState & typeof boundActions,
  node: Ast
) {
  if (selected.length === 0) {
    replace(node);
  } else {
    const newAst = cloneDeep(ast);
    set(newAst, selected, node);
    replace(newAst);
  }
}
