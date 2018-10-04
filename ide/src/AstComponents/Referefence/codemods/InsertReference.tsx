import * as React from "react";
import { IdeState, boundActions } from "../../../Ide/stateManagment";
import { insertNode } from "../../Ast/codemods/common";
import { Codemod } from "../../Ast/codemods/Codemod";

class InsertReference extends React.PureComponent<
  IdeState & typeof boundActions
> {
  public render() {
    return <button onClick={this.insertReference}>insert reference (x)</button>;
  }
  private insertReference = () => {
    insertNode(this.props, {
      type: "Reference",
      identifier: "x"
    });
  };
}

export default {
  search: "insert reference",
  render: InsertReference
} as Codemod;
