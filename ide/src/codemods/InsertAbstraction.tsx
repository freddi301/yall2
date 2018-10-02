import { Codemod } from "./Codemod";
import * as React from "react";
import { IdeState, boundActions } from "../Ide/stateManagment";
import { insertNode } from "./common";

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
  id: "insert abstraction",
  render: InsertAbstraction
} as Codemod;
