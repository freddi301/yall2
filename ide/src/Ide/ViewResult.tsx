import * as React from "react";
import { EvaluationStrategy } from "../core/purescript";
import { Ast } from "../Ast/Ast";
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
}

export class ViewResult extends React.PureComponent<Props> {
  public render() {
    const { ast, path, evaluationStrategy, select } = this.props;
    const evaluated = evaluate({ ast, evaluationStrategy, path });
    return (
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
    );
  }
}
