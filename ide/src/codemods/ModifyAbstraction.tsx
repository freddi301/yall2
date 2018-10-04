import { Codemod } from "./Codemod";
import { Ast } from "../AstComponents/Ast/Ast";
import { get, isEqual } from "lodash";
import * as React from "react";
import { IdeState, boundActions } from "../Ide/stateManagment";
import { insertNode, getActiveEditor } from "./common";

class ModifyAbstraction extends React.PureComponent<
  IdeState & typeof boundActions,
  { text: string }
> {
  public state: { text: string } = { text: "" };
  public render() {
    const { ast, selected } = getActiveEditor(this.props);
    const { text } = this.state;
    const node: Ast = get(ast, selected, ast);
    if (node.type === "Abstraction") {
      return (
        <form onSubmit={this.changeHead} style={{ display: "flex" }}>
          <div>identifier:</div>
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
  private changeHead = (event: React.FormEvent) => {
    const { ast, selected } = getActiveEditor(this.props);
    if (this.state.text !== null) {
      insertNode(this.props, {
        type: "Abstraction",
        head: this.state.text,
        body: get(ast, selected.concat("body"))
      });
    }
    event.preventDefault();
  };
  public componentDidMount() {
    const { ast, selected } = getActiveEditor(this.props);
    const node: Ast = get(ast, selected, ast);
    if (node.type === "Abstraction") {
      this.setState({ text: node.head });
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
      if (node.type === "Abstraction") {
        this.setState({ text: node.head });
      }
    }
  }
}

export default {
  search: "modify abstraction identifier",
  render: ModifyAbstraction
} as Codemod;
