import * as React from "react";
import { Ast } from "../Ast/Ast";
import {
  evaluate,
  fromPurescriptAst,
  toPurescriptAst
} from "../Ast/purescript";
import { createStateManagment } from "../utils/reduxLike";
import { ViewAst } from "../View/ViewAst";
import { Commands } from "./Commands";

export class Ide extends React.PureComponent<{ path: string[] }, IdeState> {
  public state: IdeState = {
    ast: sample,
    selected: [],
    evaluationStrategy: "eager"
  };
  public render() {
    const { ast, selected, evaluationStrategy } = this.state;
    const { path } = this.props;
    let evaluated: Ast;
    try {
      evaluated = fromPurescriptAst(
        evaluate[evaluationStrategy](toPurescriptAst(ast))
      );
    } catch (e) {
      evaluated = ast;
    }
    return (
      <div>
        <div style={{ display: "flex" }}>
          <div style={{ flexGrow: 2 }}>
            <ViewAst
              ast={ast}
              path={path}
              select={this.select}
              selected={selected}
            />
          </div>
          <div style={{ flexGrow: 1 }}>
            <Commands ast={ast} selected={selected} replace={this.replace} />
          </div>
        </div>
        <div>
          <select
            value={evaluationStrategy}
            onChange={e => this.changeEvaluationStrategy(e.target.value as any)}
          >
            <option value="eager">eager</option>
            <option value="lazy">lazy</option>
          </select>
          <ViewAst
            ast={evaluated}
            path={path}
            select={this.select}
            selected={selected}
          />
        </div>
      </div>
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
  private changeEvaluationStrategy(
    evaluationStrategy: keyof (typeof evaluate)
  ) {
    this.setState({ evaluationStrategy });
  }
}

interface IdeState {
  ast: Ast;
  selected: string[];
  evaluationStrategy: keyof (typeof evaluate);
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
