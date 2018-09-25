import { get } from "lodash";
import * as React from "react";
import { Ast } from "../Ast/Ast";
import { PromiseComponent } from "../Components/PromiseComponent";
import { createStateManagment } from "../utils/reduxLike";
import { ViewAst } from "../View/ViewAst";
import { Commands } from "./Commands";
import { evaluate } from "../core/evaluateService";
import { EvaluationStrategy } from "../core/purescript";

export class Ide extends React.PureComponent<{ path: string[] }, IdeState> {
  public state: IdeState = {
    ast: sample,
    selected: [],
    evaluationStrategy: "symbolic",
    clipboard: sample
  };
  public render() {
    const { ast, selected, evaluationStrategy, clipboard } = this.state;
    const { path } = this.props;
    const evaluated = evaluate({
      ast: get(ast, selected, ast),
      evaluationStrategy
    });
    return (
      <div tabIndex={1} ref={element => (element ? element.focus() : null)}>
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
            <Commands
              ast={ast}
              selected={selected}
              replace={this.replace}
              clipboard={clipboard}
              clip={this.clip}
            />
          </div>
        </div>
        <div>
          <select
            value={evaluationStrategy}
            onChange={e => this.changeEvaluationStrategy(e.target.value as any)}
          >
            <option value="eager">eager</option>
            <option value="lazy">lazy</option>
            <option value="symbolic">symbolic</option>
          </select>
          <PromiseComponent
            promise={evaluated}
            onPending={"working..."}
            onResolve={resultAst => (
              <ViewAst
                ast={resultAst}
                path={path.concat(selected)}
                select={() => {
                  return;
                }}
                selected={[Symbol().toString()]}
              />
            )}
            onReject={error => String(error)}
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
  private changeEvaluationStrategy(evaluationStrategy: EvaluationStrategy) {
    this.setState({ evaluationStrategy });
  }
  private clip = (ast: Ast) => {
    this.setState({ clipboard: ast });
  };
}

interface IdeState {
  ast: Ast;
  selected: string[];
  evaluationStrategy: EvaluationStrategy;
  clipboard: Ast;
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
