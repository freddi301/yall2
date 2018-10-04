import { Codemod } from "../Codemod";
import { Ast } from "../../Ast/Ast";
import { get, isEqual } from "lodash";
import * as React from "react";
import { IdeState, boundActions } from "../../Ide/stateManagment";
import { getActiveEditor } from "../common";
import { WhereScope } from "../../Ast/Where";
import produce from "immer";

class ModifyWhereScope extends React.PureComponent<
  IdeState & typeof boundActions,
  { text: string }
> {
  public state = { text: "" };
  public render() {
    const { ast, selected } = getActiveEditor(this.props);
    const { text } = this.state;
    const node: Ast | WhereScope = get(ast, selected, ast);
    if (node.type === "WhereScope") {
      return (
        <form onSubmit={this.changeIdentifier} style={{ display: "flex" }}>
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
  private changeIdentifier = (event: React.FormEvent) => {
    if (this.state.text !== null) {
      const { replace } = this.props;
      const { ast, selected } = getActiveEditor(this.props);
      const newAst = produce(ast, draftAst => {
        const node: WhereScope = get(draftAst, selected, draftAst);
        node.identifier = this.state.text;
      });
      replace({ ast: newAst });
    }
    event.preventDefault();
  };
  public componentDidMount() {
    const { ast, selected } = getActiveEditor(this.props);
    const node: Ast | WhereScope = get(ast, selected, ast);
    if (node.type === "WhereScope") {
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
      const node: Ast | WhereScope = get(ast, selected, ast);
      if (node.type === "WhereScope") {
        this.setState({ text: node.identifier });
      }
    }
  }
}

export default {
  search: "modify where scope",
  render: ModifyWhereScope
} as Codemod;
