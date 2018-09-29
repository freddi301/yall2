import * as React from "react";
import { connect } from "react-redux";
import { ViewAst, ViewAstProps } from "../View/ViewAst";
import { Commands } from "./Commands";
import { actions, boundActions, IdeState } from "./reducer";
import { Ast } from "../Ast/Ast";
import { ViewResult } from "./ViewResult";
import { get } from "lodash";

const ROOT_AST: Ast = { type: "Reference", identifier: "root" };

export class Ide extends React.PureComponent<IdeState & typeof boundActions> {
  public render() {
    const {
      ast,
      selected,
      evaluationStrategy,
      path,
      setEvaluationStrategy,
      select,
      selectedForEvaluation
    } = this.props;
    return (
      <div>
        <div style={{ display: "flex" }}>
          <div style={{ flexGrow: 2 }}>
            <div style={{ borderBottom: "1px solid var(--lighter-dark)" }}>
              source
            </div>
            <div>
              <ViewAst
                ast={ast}
                parentAst={ROOT_AST}
                path={path}
                select={select}
                onSelect={selectPath}
                selected={selected}
              />
            </div>
          </div>
          <div style={{ width: "20em" }}>
            <Commands {...this.props} />
          </div>
        </div>
        <div>
          <div style={{ borderBottom: "1px solid var(--lighter-dark)" }}>
            evaluation strategy:
            <select
              value={evaluationStrategy}
              onChange={e => setEvaluationStrategy(e.target.value as any)}
            >
              <option value="eager">eager</option>
              <option value="lazy">lazy</option>
              <option value="symbolic">symbolic</option>
            </select>
            <button onClick={this.selectForEvaluation}>
              evaluate selected
            </button>
          </div>
          <div>
            <ViewResult
              ast={get(ast, selectedForEvaluation, ast)}
              path={path}
              evaluationStrategy={evaluationStrategy}
              select={select}
            />
          </div>
        </div>
      </div>
    );
  }
  private selectForEvaluation = () => {
    const { selected, selectForEvaluation } = this.props;
    selectForEvaluation(selected);
  };
}

function selectPath({ select, path }: ViewAstProps) {
  select(path);
}

export const IdeConnected = connect(
  (state: IdeState) => state,
  actions
)(Ide);
