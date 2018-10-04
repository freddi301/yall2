import * as React from "react";
import { Ast } from "../AstComponents/Ast";
import { evaluate } from "../core/evaluate";
import { PromiseComponent } from "../components/PromiseComponent";
import { WithState } from "../components/WithState";
import { ViewAst } from "../View/ViewAst";
import { EvaluationStrategy } from "../core/evaluate";
import { toPurescriptAst } from "../core/toPurescriptAst";
import { fromPurescriptAst } from "../core/fromPurescriptAst";

const ROOT_AST: Ast = { type: "Reference", identifier: "root" };

interface Props {
  ast: Ast;
  path: string[];
  evaluationStrategy: EvaluationStrategy;
  select(args: { path: string[] }): void;
  setEvaluationStrategy(args: { evaluationStrategy: EvaluationStrategy }): void;
}

interface State {
  evaluated?: Promise<Ast>;
}

export class Runner extends React.PureComponent<Props, State> {
  public state: State = {};
  public render() {
    const { evaluationStrategy, setEvaluationStrategy, select } = this.props;
    const { evaluated } = this.state;
    return (
      <div>
        <div>
          <button onClick={this.evaluate}>evaluate</button> with evaluation
          strategy:
          <select
            value={evaluationStrategy}
            onChange={e =>
              setEvaluationStrategy({
                evaluationStrategy: e.target.value as EvaluationStrategy
              })
            }
          >
            <option value="eager">eager</option>
            <option value="lazy">lazy</option>
            <option value="symbolic">symbolic</option>
          </select>
        </div>
        <div>
          {evaluated ? (
            <PromiseComponent
              promise={evaluated}
              onPending={"working..."}
              onResolve={resultAst => {
                return (
                  <WithState
                    initial={[] as string[]}
                    render={(selectedResult, setSelectedResult) => {
                      return (
                        <ViewAst
                          ast={resultAst}
                          parentAst={ROOT_AST}
                          path={[]}
                          select={select}
                          onSelect={({ select, ast, path }) => {
                            select({ path: (ast as any).source });
                            setSelectedResult(path);
                          }}
                          selected={selectedResult}
                        />
                      );
                    }}
                  />
                );
              }}
              onReject={error => String(error)}
            />
          ) : null}
        </div>
      </div>
    );
  }
  private evaluate = () => {
    const { evaluationStrategy, ast, path } = this.props;
    const evaluated = Promise.resolve(
      fromPurescriptAst(
        evaluate[evaluationStrategy](toPurescriptAst({ ast, path }))
      )
    );
    this.setState({ evaluated });
  };
}
