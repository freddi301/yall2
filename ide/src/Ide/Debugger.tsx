import * as React from "react";
import { Ast } from "../Ast/Ast";
import { WithState } from "../components/WithState";
import { ViewAst } from "../View/ViewAst";
import { fromPurescriptAst } from "../core/purescript";

interface Props {
  stepper: IterableIterator<Ast>;
  select(path: string[]): void;
  label: string;
}

interface State {
  ast?: Ast;
  done: boolean;
}

const ROOT_AST: Ast = { type: "Reference", identifier: "root" };

export class Debugger extends React.PureComponent<Props, State> {
  public state: State = { done: false };
  public render() {
    const { ast, done } = this.state;
    const { select, label } = this.props;
    return (
      <div>
        <div>
          debug {label} {done ? "✔" : <button onClick={this.next}>▶</button>}
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
                    select((ast as any).source);
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
  private next = () => {
    const { stepper } = this.props;
    const { done, value } = stepper.next();
    if (done) {
      this.setState({ done });
    } else {
      const ast = fromPurescriptAst(value);
      this.setState({ ast, done: false });
    }
  };
  public componentDidUpdate(prevProps: Props) {
    if (this.props.stepper !== prevProps.stepper) {
      this.next();
    }
  }
}
