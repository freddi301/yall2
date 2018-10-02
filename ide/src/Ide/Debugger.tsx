import * as React from "react";
import { Ast } from "../Ast/Ast";
import { ViewAst } from "../View/ViewAst";
import { debug } from "../core/debug";
import { fromPurescriptAst } from "../core/fromPurescriptAst";
import { toPurescriptAst } from "../core/toPurescriptAst";
import { WithState } from "../components/WithState";
import { EvaluationStrategy } from "../core/evaluate";

interface Props {
  ast: Ast;
  path: string[];
  evaluationStrategy: EvaluationStrategy;
  select(args: { path: string[] }): void;
}

interface State {
  stepper?: IterableIterator<Ast>;
  ast?: Ast;
  done: boolean;
}

const ROOT_AST: Ast = { type: "Reference", identifier: "root" };

export class Debugger extends React.PureComponent<Props, State> {
  public state: State = { done: true };
  public render() {
    const { ast, done, stepper } = this.state;
    const { select, evaluationStrategy } = this.props;
    const readyForDebug = Boolean(debug[evaluationStrategy]);
    const isDebugging = stepper && !done;
    return (
      <div>
        <div>
          <button onClick={this.startDebug} disabled={!readyForDebug}>
            debug
          </button>
          <button onClick={this.next} disabled={!isDebugging}>
            step
          </button>
        </div>
        {ast ? (
          <WithState
            initial={[] as string[]}
            render={(selectedResult, setSelectedResult) => {
              return (
                <ViewAst
                  ast={ast}
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
        ) : null}
      </div>
    );
  }
  private startDebug = () => {
    const { ast, evaluationStrategy, path } = this.props;
    const stepper = debug[evaluationStrategy](toPurescriptAst({ ast, path }));
    this.setState({ stepper, done: false }, this.next);
  };
  private next = () => {
    const { stepper } = this.state;
    if (stepper) {
      const { done, value } = stepper.next();
      if (done) {
        this.setState({ done });
      } else {
        const ast = fromPurescriptAst(value);
        this.setState({ ast, done: false });
      }
    }
  };
}
