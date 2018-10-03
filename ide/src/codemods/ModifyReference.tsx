import { Codemod } from "./Codemod";
import { Ast } from "../Ast/Ast";
import { get, isEqual } from "lodash";
import * as React from "react";
import { IdeState, boundActions } from "../Ide/stateManagment";
import { insertNode, getActiveEditor } from "./common";

class ModifyReference extends React.PureComponent<
  IdeState & typeof boundActions,
  { text: string }
> {
  public state = { text: "" };
  public render() {
    const { ast, selected } = getActiveEditor(this.props);
    const { text } = this.state;
    const node: Ast = get(ast, selected, ast);
    if (node.type === "Reference") {
      return (
        <form onSubmit={this.changeIdentifier} style={{ display: "flex" }}>
          identifier:
          <input
            value={text}
            onChange={this.changeText}
            style={{ flexGrow: 1 }}
          />
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
        type: "Reference",
        identifier: this.state.text
      });
    }
    event.preventDefault();
  };
  public componentDidMount() {
    const { ast, selected } = getActiveEditor(this.props);
    const node: Ast = get(ast, selected, ast);
    if (node.type === "Reference") {
      this.setState({ text: node.identifier });
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
      if (node.type === "Reference") {
        this.setState({ text: node.identifier });
      }
    }
  }
}

export default {
  search: "modify reference identifier",
  render: ModifyReference
} as Codemod;
