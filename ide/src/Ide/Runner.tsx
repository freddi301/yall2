import * as React from "react";
import { Ast, BasicAst } from "../AstComponents/Ast/Ast";
// import { evaluate } from "../core/evaluateService";
import { PromiseComponent } from "../components/PromiseComponent";
import { WithState } from "../components/WithState";
import { ViewAst } from "../AstComponents/Ast/ViewAst";
import { EvaluationStrategy, evaluate } from "../core/evaluate";
import { fromPurescriptAst } from "../core/fromPurescriptAst";
import { toPurescriptAst } from "../core/toPurescriptAst";
import { distributedExecutionDemo } from "src/core/distributedExecution";

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
            <option value="lazySymbolic">lazy symbolic</option>
          </select>
          <button onClick={this.distributedExecution}>
            distributed evaluate
          </button>
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
                          getType={() => ""}
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
    // const evaluated = evaluate({ ast, path, evaluationStrategy });
    const evaluated = Promise.resolve(
      fromPurescriptAst(
        evaluate[evaluationStrategy](toPurescriptAst({ ast, path }))
      )
    );
    this.setState({ evaluated });
  };
  private distributedExecution = async () => {
    const { ast, path } = this.props;
    const basicAst: BasicAst = fromPurescriptAst(
      toPurescriptAst({ ast, path })
    );
    const evaluated = distributedExecutionDemo.run(basicAst);
    this.setState({ evaluated });
  };
}
