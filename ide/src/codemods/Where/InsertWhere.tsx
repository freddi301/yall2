import { Codemod } from "../Codemod";
import * as React from "react";
import { IdeState, boundActions } from "../../Ide/reducer";
import { insertNode } from "../common";

class InsertWhere extends React.PureComponent<IdeState & typeof boundActions> {
  public render() {
    return <button onClick={this.insertWhere}>insert Where</button>;
  }
  private insertWhere = () => {
    insertNode(this.props, {
      type: "Where",
      body: {
        type: "Reference",
        identifier: "x",
        source: this.props.selected.concat("body")
      },
      scope: [
        {
          type: "Abstraction",
          head: "x",
          body: {
            type: "Reference",
            identifier: "x",
            source: this.props.selected.concat("body")
          },
          source: []
        }
      ],
      source: []
    });
  };
}

export default {
  id: "insert where",
  render: InsertWhere
} as Codemod;
