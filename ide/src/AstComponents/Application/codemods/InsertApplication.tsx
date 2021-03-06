import * as React from "react";
import { IdeState, boundActions } from "../../../Ide/stateManagment";
import { insertNode } from "../../Ast/codemods/common";
import { Codemod } from "../../Ast/codemods/Codemod";

class InsertApplication extends React.PureComponent<
  IdeState & typeof boundActions
> {
  public render() {
    return (
      <button onClick={this.insertApplication}>insert application (x x)</button>
    );
  }
  private insertApplication = () => {
    insertNode(this.props, {
      type: "Application",
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
  search: "insert application",
  render: InsertApplication
} as Codemod;
