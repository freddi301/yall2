import * as React from "react";
import { IdeState, boundActions } from "../../../Ide/stateManagment";
import { get } from "lodash";
import { WhereScope, Where } from "../Where";
import { Ast } from "../../Ast/Ast";
import produce from "immer";
import { getActiveEditor } from "../../Ast/codemods/common";
import { Codemod } from "../../Ast/codemods/Codemod";

class MoveWhereScope extends React.PureComponent<
  IdeState & typeof boundActions
> {
  public render() {
    if (!this.canMove()) {
      return null;
    }
    return (
      <div>
        move where scope
        <button onClick={this.moveUp}> up</button>
        <button onClick={this.moveDown}> down</button>
      </div>
    );
  }
  private moveUp = () => {
    this.moveWhere("up");
  };
  private moveDown = () => {
    this.moveWhere("down");
  };
  private moveWhere(direction: "up" | "down") {
    const { replace } = this.props;
    const { ast, selected } = getActiveEditor(this.props);
    const newAst = produce(ast, draftAst => {
      const node: Where = get(draftAst, selected.slice(0, -2), draftAst);
      const index = Number(selected[selected.length - 1]);
      const where = node.scope[index];
      const delta = { up: -1, down: 1 }[direction];
      const swapped = node.scope[index + delta];
      node.scope[index + delta] = where;
      node.scope[index] = swapped;
    });
    replace({ ast: newAst });
  }
  private canMove(): boolean {
    const { ast, selected } = getActiveEditor(this.props);
    const currentNode: Ast | WhereScope = get(ast, selected, ast);
    if (currentNode.type === "WhereScope") {
      return true;
    }
    return false;
  }
}

export default {
  search: "move where scope",
  render: MoveWhereScope
} as Codemod;
