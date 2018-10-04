import * as React from "react";
import { Ast } from "../Ast/Ast";
import { ViewAst } from "../View/ViewAst";
import { debug } from "../core/debug";
import { fromPurescriptAst } from "../core/fromPurescriptAst";
import { toPurescriptAst } from "../core/toPurescriptAst";
import { IdeState, boundActions } from "./stateManagment";
import { SOURCE_EDITOR } from "./Ide";
import { PurescriptAst } from "../language/Yall.Ast";

type Props = IdeState & typeof boundActions;

interface State {
  stepper?: IterableIterator<PurescriptAst<string, string[]>>;
  history: Ast[];
  done: boolean;
  scrollDiv?: HTMLDivElement;
}

const ROOT_AST: Ast = { type: "Reference", identifier: "root" };
const DEBUGGER_EDITOR = "debugger";

export class Debugger extends React.PureComponent<Props, State> {
  public state: State = { done: true, history: [] };
  public render() {
    const { done, stepper, history } = this.state;
    const {
      select,
      evaluationStrategy,
      editors,
      setActiveEditor,
      activeEditor
    } = this.props;
    const { ast, selected } = editors[DEBUGGER_EDITOR];
    const readyForDebug = Boolean(debug[evaluationStrategy]);
    const isDebugging = stepper && !done;
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div>
          <button onClick={this.startDebug} disabled={!readyForDebug}>
            debug
          </button>
          <button onClick={this.next} disabled={!isDebugging}>
            step
          </button>
        </div>
        <div style={{ flexGrow: 1, overflow: "auto" }}>
          {history
            ? history.map((ast, index) => {
                return (
                  <div key={index}>
                    <ViewAst
                      ast={ast}
                      parentAst={ROOT_AST}
                      path={[]}
                      select={select}
                      onSelect={({ ast, path }) => {
                        return;
                      }}
                      selected={[]}
                    />
                  </div>
                );
              })
            : null}
          {stepper ? (
            <div
              key="active"
              ref={scrollDiv => {
                if (scrollDiv) {
                  this.setState({ scrollDiv });
                }
              }}
            >
              <ViewAst
                ast={ast}
                parentAst={ROOT_AST}
                path={[]}
                select={select}
                onSelect={({ ast, path }) => {
                  const source: string[] | void = (ast as any).source;
                  if (source) {
                    select({ path: source, editor: SOURCE_EDITOR });
                  }
                  select({ path, editor: DEBUGGER_EDITOR });
                  if (activeEditor !== DEBUGGER_EDITOR) {
                    setActiveEditor({ activeEditor: DEBUGGER_EDITOR });
                  }
                }}
                selected={selected}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
  private startDebug = () => {
    const { evaluationStrategy, editors } = this.props;
    const { ast, path } = editors[SOURCE_EDITOR];
    const stepper = debug[evaluationStrategy](toPurescriptAst({ ast, path }));
    this.setState({ stepper, done: false, history: [ast] });
  };
  private next = () => {
    const { replace, editors } = this.props;
    const { stepper } = this.state;
    if (stepper) {
      const ast = editors[DEBUGGER_EDITOR].ast;
      const path = (ast as any).source || [];
      this.setState(({ history }) => ({ history: history.concat(ast) }));
      const { done, value } = stepper.next(toPurescriptAst({ ast, path }));
      if (done) {
        this.setState({ done });
      } else {
        const ast = fromPurescriptAst(value);
        if (this.state.done) {
          this.setState({ done: false });
        }
        replace({ ast, editor: DEBUGGER_EDITOR });
        this.setState(null, () => {
          if (this.state.scrollDiv) {
            this.state.scrollDiv.scrollIntoView({ behavior: "smooth" });
          }
        });
      }
    }
  };
}
