import { Codemod } from "../Codemod";
import * as React from "react";
import { IdeState, boundActions } from "../../Ide/reducer";
import { insertNode } from "../common";
import { get } from "lodash";
import { Ast } from "../../Ast/Ast";

class AddEntry extends React.PureComponent<IdeState & typeof boundActions> {
  public render() {
    const { ast, selected } = this.props;
    const node: Ast = get(ast, selected, ast);
    if (node.type === "Where") {
      return <button onClick={this.addEntry}>add entry</button>;
    } else {
      return null;
    }
  }
  private addEntry = () => {
    const { ast, selected } = this.props;
    const node: Ast = get(ast, selected, ast);
    if (node.type === "Where") {
      insertNode(this.props, {
        ...node,
        scope: node.scope.concat({
          type: "Abstraction",
          head: "x" + String(Math.random()).slice(2, 6),
          body: get(ast, selected.concat("body")),
          source: this.props.selected
        })
      });
    } else {
      return;
    }
  };
}

export default {
  id: "add where entry",
  render: AddEntry
} as Codemod;
