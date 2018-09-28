import { get } from "lodash";
import * as React from "react";
import { connect } from "react-redux";
import { PromiseComponent } from "../components/PromiseComponent";
import { evaluate } from "../core/evaluateService";
import { ViewAst } from "../View/ViewAst";
import { Commands } from "./Commands";
import { actions, boundActions, IdeState } from "./reducer";
import { Ast } from "../Ast/Ast";

const ROOT_AST: Ast = { type: "Reference", identifier: "root" };

export class Ide extends React.PureComponent<IdeState & typeof boundActions> {
  public render() {
    const {
      ast,
      selected,
      evaluationStrategy,
      path,
      setEvaluationStrategy,
      select
    } = this.props;
    const evaluated = evaluate({
      ast: get(ast, selected, ast),
      evaluationStrategy
    });
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
          </div>
          <div>
            <PromiseComponent
              promise={evaluated}
              onPending={"working..."}
              onResolve={resultAst => (
                <ViewAst
                  ast={resultAst}
                  parentAst={ROOT_AST}
                  path={path.concat(selected)}
                  select={() => {
                    return;
                  }}
                  selected={[]}
                />
              )}
              onReject={error => String(error)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export const IdeConnected = connect(
  (state: IdeState) => state,
  actions
)(Ide);
