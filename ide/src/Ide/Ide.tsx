import { get } from "lodash";
import * as React from "react";
import { connect } from "react-redux";
import { PromiseComponent } from "../Components/PromiseComponent";
import { evaluate } from "../core/evaluateService";
import { ViewAst } from "../View/ViewAst";
import { Commands } from "./Commands";
import { actions, boundActions, IdeState } from "./reducer";

export class Ide extends React.PureComponent<IdeState & typeof boundActions> {
  public render() {
    const {
      ast,
      selected,
      evaluationStrategy,
      clipboard,
      path,
      clip,
      setEvaluationStrategy,
      select,
      replace
    } = this.props;
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
              select={select}
              selected={selected}
            />
          </div>
          <div style={{ flexGrow: 1 }}>
            <Commands
              ast={ast}
              selected={selected}
              replace={replace}
              clipboard={clipboard}
              clip={clip}
            />
          </div>
        </div>
        <div>
          <select
            value={evaluationStrategy}
            onChange={e => setEvaluationStrategy(e.target.value as any)}
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
}

export const IdeConnected = connect(
  (state: IdeState) => state,
  actions
)(Ide);
