import { Codemod } from "../Codemod";
import * as React from "react";
import { IdeState, boundActions } from "../../Ide/stateManagment";
import { getActiveEditor } from "../common";
import { get } from "lodash";
import { WhereScope, Where } from "../../Ast/Where";
import { Ast } from "../../Ast/Ast";
import produce from "immer";

class InsertWhereScope extends React.PureComponent<
  IdeState & typeof boundActions
> {
  public render() {
    if (!this.canInsert()) {
      return null;
    }
    return <button onClick={this.insertWhere}>insert where scope</button>;
  }
  private insertWhere = () => {
    const { replace } = this.props;
    const { ast, selected } = getActiveEditor(this.props);
    const newAst = produce(ast, draftAst => {
      const node: Where = get(draftAst, selected, draftAst);
      node.scope.push({
        type: "WhereScope",
        identifier: "x",
        body: {
          type: "Reference",
          identifier: "x"
        }
      });
    });
    replace({ ast: newAst });
  };
  private canInsert(): boolean {
    const { ast, selected } = getActiveEditor(this.props);
    const currentNode: Ast | WhereScope = get(ast, selected, ast);
    if (currentNode.type === "Where") {
      return true;
    }
    return false;
  }
}

export default {
  search: "insert where scope",
  render: InsertWhereScope
} as Codemod;
