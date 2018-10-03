import { Codemod } from "./Codemod";
import * as React from "react";
import { IdeState, boundActions } from "../Ide/stateManagment";
import { insertNode } from "./common";

class InsertInfix extends React.PureComponent<IdeState & typeof boundActions> {
  public render() {
    return <button onClick={this.insertInfix}>insert infix (x `x` x)</button>;
  }
  private insertInfix = () => {
    insertNode(this.props, {
      type: "Infix",
      operator: {
        type: "Reference",
        identifier: "x"
      },
      left: {
        type: "Reference",
        identifier: "x"
      },
      right: {
        type: "Reference",
        identifier: "x"
      }
    });
  };
}

export default {
  search: "insert infix",
  render: InsertInfix
} as Codemod;
