import { Codemod } from "./Codemod";
import { Ast } from "../Ast/Ast";
import { get, isEqual } from "lodash";
import * as React from "react";
import { IdeState, boundActions } from "../Ide/stateManagment";
import { insertNode } from "./common";

class ModifyAbstraction extends React.PureComponent<
  IdeState & typeof boundActions,
  { text: string }
> {
  public state: { text: string } = { text: "" };
  public render() {
    const { ast, selected } = this.props;
    const { text } = this.state;
    const node: Ast = get(ast, selected, ast);
    if (node.type === "Abstraction") {
      return (
        <form onSubmit={this.changeHead} style={{ display: "flex" }}>
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
  private changeHead = (event: React.FormEvent) => {
    const { ast, selected } = this.props;
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
    const { ast, selected } = this.props;
    const node: Ast = get(ast, selected, ast);
    if (node.type === "Abstraction") {
      this.setState({ text: node.head });
    }
  }
  public componentDidUpdate(prevProps: IdeState & typeof boundActions) {
    if (!isEqual(prevProps.selected, this.props.selected)) {
      const { ast, selected } = this.props;
      const node: Ast = get(ast, selected, ast);
      if (node.type === "Abstraction") {
        this.setState({ text: node.head });
      }
    }
  }
}

export default {
  id: "modify abstraction identifier",
  render: ModifyAbstraction
} as Codemod;
