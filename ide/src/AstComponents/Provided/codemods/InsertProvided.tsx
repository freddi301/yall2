import * as React from "react";
import { IdeState, boundActions } from "../../../Ide/stateManagment";
import { insertNode } from "../../Ast/codemods/common";
import { Codemod } from "../../Ast/codemods/Codemod";

class InsertProvided extends React.PureComponent<
  IdeState & typeof boundActions
> {
  public render() {
    return <button onClick={this.insertProvided}>insert provided value</button>;
  }
  private insertProvided = () => {
    insertNode(this.props, {
      type: "Provided",
      value: "x"
    });
  };
}

export default {
  search: "insert provided value",
  render: InsertProvided
} as Codemod;
