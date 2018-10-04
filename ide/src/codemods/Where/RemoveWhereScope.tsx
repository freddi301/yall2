import { Codemod } from "../Codemod";
import * as React from "react";
import { IdeState, boundActions } from "../../Ide/stateManagment";
import { getActiveEditor } from "../common";
import { get } from "lodash";
import { WhereScope, Where } from "../../AstComponents/Where/Where";
import { Ast } from "../../AstComponents/Ast";
import produce from "immer";

class RemoveWhereScope extends React.PureComponent<
  IdeState & typeof boundActions
> {
  public render() {
    if (!this.canRemove()) {
      return null;
    }
    return <button onClick={this.removeWhere}>remove where scope</button>;
  }
  private removeWhere = () => {
    const { replace } = this.props;
    const { ast, selected } = getActiveEditor(this.props);
    const newAst = produce(ast, draftAst => {
      const node: Where = get(draftAst, selected, draftAst);
      node.scope.pop();
    });
    replace({ ast: newAst });
  };
  private canRemove(): boolean {
    const { ast, selected } = getActiveEditor(this.props);
    const currentNode: Ast | WhereScope = get(ast, selected, ast);
    if (currentNode.type === "Where") {
      return true;
    }
    return false;
  }
}

export default {
  search: "remove where scope",
  render: RemoveWhereScope
} as Codemod;
