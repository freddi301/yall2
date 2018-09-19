import * as React from "react";
import { Ast } from "../Ast/Ast";
import { createStateManagment } from "../utils/reduxLike";
import { ViewAst } from "../View/ViewAst";

export class Ide extends React.PureComponent<{ path: string[] }, IdeState> {
  public state: IdeState = { ast: sample, selected: [] };
  public render() {
    const { ast } = this.state;
    const { path } = this.props;
    return <ViewAst ast={ast} path={path} select={this.select} />;
  }
  private dispatch: typeof dispatch = action => {
    this.setState(state => reducer(state, action));
  };
  private select = (path: string[]) => {
    this.dispatch(actions.select(path));
  };
}

interface IdeState {
  ast: Ast;
  selected: string[];
}

const { reducer, actions, dispatch } = createStateManagment<IdeState>()({
  select(state, path: string[]) {
    return { ...state, path };
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
