import { Ast } from "../../Ast/Ast";
import { get, isEqual } from "lodash";
import * as React from "react";
import { IdeState, boundActions } from "../../../Ide/stateManagment";
import { getActiveEditor, insertNode } from "../../Ast/codemods/common";
import { Codemod } from "../../Ast/codemods/Codemod";

class ModifyProvided extends React.PureComponent<
  IdeState & typeof boundActions,
  { text: string }
> {
  public state = { text: "" };
  public render() {
    const { ast, selected } = getActiveEditor(this.props);
    const { text } = this.state;
    const node: Ast = get(ast, selected, ast);
    if (node.type === "Provided") {
      return (
        <form onSubmit={this.changeIdentifier} style={{ display: "flex" }}>
          <div>value:</div>
          <div style={{ flexGrow: 1 }}>
            <input
              value={text}
              onChange={this.changeText}
              style={{ width: "100%" }}
            />
          </div>
        </form>
      );
    } else {
      return null;
    }
  }
  private changeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ text: e.target.value });
  };
  private changeIdentifier = (event: React.FormEvent) => {
    if (this.state.text !== null) {
      insertNode(this.props, {
        type: "Provided",
        value: this.state.text
      });
    }
    event.preventDefault();
  };
  public componentDidMount() {
    const { ast, selected } = getActiveEditor(this.props);
    const node: Ast = get(ast, selected, ast);
    if (node.type === "Provided") {
      this.setState({ text: node.value });
    }
  }
  public componentDidUpdate(prevProps: IdeState & typeof boundActions) {
    if (
      !isEqual(
        getActiveEditor(prevProps).selected,
        getActiveEditor(this.props).selected
      )
    ) {
      const { ast, selected } = getActiveEditor(this.props);
      const node: Ast = get(ast, selected, ast);
      if (node.type === "Provided") {
        this.setState({ text: node.value });
      }
    }
  }
}

export default {
  search: "modify provided value",
  render: ModifyProvided
} as Codemod;
