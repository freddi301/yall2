import * as React from "react";
import { Ast } from "../Ast/Ast";
import { EvaluationStrategy } from "../core/purescript";
import { evaluate } from "../core/evaluateService";
import { PromiseComponent } from "../components/PromiseComponent";
import { WithState } from "../components/WithState";
import { ViewAst } from "../View/ViewAst";

const ROOT_AST: Ast = { type: "Reference", identifier: "root" };

interface Props {
  ast: Ast;
  path: string[];
  evaluationStrategy: EvaluationStrategy;
  select(path: string[]): void;
  setEvaluationStrategy(evaluationStrategy: EvaluationStrategy): void;
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
            onChange={e => setEvaluationStrategy(e.target.value as any)}
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
                            select((ast as any).source);
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
    const evaluated = evaluate({ ast, evaluationStrategy, path });
    this.setState({ evaluated });
  };
}
