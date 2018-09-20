import * as React from "react";
import { Ast } from "../Ast/Ast";
import { createStateManagment } from "../utils/reduxLike";
import { ViewAst } from "../View/ViewAst";
import { Commands } from "./Commands";

export class Ide extends React.PureComponent<{ path: string[] }, IdeState> {
  public state: IdeState = { ast: sample, selected: [] };
  public render() {
    const { ast, selected } = this.state;
    const { path } = this.props;
    return (
      <>
        <ViewAst ast={ast} path={path} select={this.select} />
        <Commands ast={ast} selected={selected} replace={this.replace} />
      </>
    );
  }
  private dispatch: typeof dispatch = action => {
    this.setState(state => reducer(state, action));
  };
  private select = (path: string[]) => {
    this.dispatch(actions.select(path));
  };
  private replace = (ast: Ast) => {
    this.dispatch(actions.replace(ast));
  };
}

interface IdeState {
  ast: Ast;
  selected: string[];
}

const { reducer, actions, dispatch } = createStateManagment<IdeState>()({
  select(state, path: string[]) {
    return { ...state, selected: path };
  },
  replace(state, ast: Ast) {
    return { ...state, ast };
  }
});

const sample: Ast = {
  type: "Abstraction",
  head: "x",
  body: {
    type: "Application",
    left: { type: "Reference", identifier: "x", source: "" },
    right: { type: "Reference", identifier: "x", source: "" },
    source: ""
  },
  source: ""
};
