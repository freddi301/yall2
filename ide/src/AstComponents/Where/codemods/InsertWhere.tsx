import * as React from "react";
import { IdeState, boundActions } from "../../../Ide/stateManagment";
import { get, isEqual } from "lodash";
import { WhereScope } from "../Where";
import { Ast } from "../../Ast/Ast";
import { Codemod } from "../../Ast/codemods/Codemod";
import { insertNode, getActiveEditor } from "../../Ast/codemods/common";

class InsertWhere extends React.PureComponent<IdeState & typeof boundActions> {
  public render() {
    if (!this.canInsert()) {
      return null;
    }
    return <button onClick={this.insertWhere}>insert where</button>;
  }
  private insertWhere = () => {
    insertNode(this.props, {
      type: "Where",
      body: {
        type: "Reference",
        identifier: "x"
      },
      scope: [
        {
          type: "WhereScope",
          identifier: "x",
          body: {
            type: "Reference",
            identifier: "x"
          }
        },
        {
          type: "WhereScope",
          identifier: "x",
          body: {
            type: "Reference",
            identifier: "x"
          }
        }
      ]
    });
  };
  private canInsert(): boolean {
    const { ast, selected, path } = getActiveEditor(this.props);
    const isRootNode = isEqual(selected, path);
    if (isRootNode) {
      return true;
    }
    const parentAst: Ast | WhereScope = get(ast, selected.slice(0, -1), ast);
    if (parentAst.type === "WhereScope") {
      return true;
    }
    return false;
  }
}

export default {
  search: "insert where",
  render: InsertWhere
} as Codemod;
