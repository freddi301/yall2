import * as React from "react";
import { connect } from "react-redux";
import { ViewAst, ViewAstProps } from "../View/ViewAst";
import { Commands } from "./Commands";
import { actions, boundActions, IdeState } from "./reducer";
import { Ast } from "../Ast/Ast";
import { get } from "lodash";
import { Debugger } from "./Debugger";
import { Runner } from "./Runner";

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
    return (
      <>
        <div style={{ display: "flex", height: "70%" }}>
          <div style={{ flexGrow: 2 }}>
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
        <div style={{ display: "flex", height: "30%" }}>
          <div style={{ width: "50%" }}>
            <Runner
              ast={get(ast, selected, ast)}
              path={path}
              select={select}
              evaluationStrategy={evaluationStrategy}
              setEvaluationStrategy={setEvaluationStrategy}
            />
          </div>
          <div style={{ width: "50%" }}>
            <Debugger
              ast={get(ast, selected, ast)}
              path={selected}
              select={select}
              evaluationStrategy={evaluationStrategy}
            />
          </div>
        </div>
      </>
    );
  }
}

function selectPath({ select, path }: ViewAstProps) {
  select(path);
}

export const IdeConnected = connect(
  (state: IdeState) => state,
  actions
)(Ide);
