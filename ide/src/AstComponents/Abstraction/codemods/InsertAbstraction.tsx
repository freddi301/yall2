import * as React from "react";
import { IdeState, boundActions } from "../../../Ide/stateManagment";
import { Codemod } from "../../Ast/codemods/Codemod";
import { insertNode } from "../../Ast/codemods/common";

class InsertAbstraction extends React.PureComponent<
  IdeState & typeof boundActions
> {
  public render() {
    return (
      <button onClick={this.insertAbstraction}>
        insert abstraction (x → x)
      </button>
    );
  }
  private insertAbstraction = () => {
    insertNode(this.props, {
      type: "Abstraction",
      head: "x",
      body: {
        type: "Reference",
        identifier: "x"
      }
    });
  };
}

export default {
  search: "insert abstraction",
  render: InsertAbstraction
} as Codemod;
