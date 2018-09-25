import { cloneDeep, get, set } from "lodash";
import * as React from "react";
import { Ast } from "../Ast/Ast";

export class Commands extends React.PureComponent<{
  ast: Ast;
  selected: string[];
  replace(ast: Ast): void;
}> {
  public render() {
    return (
      <>
        {this.modifyReference()}
        {this.modifyAbstraction()}
        <button onClick={this.insertReference}>insert Reference</button>
        <button onClick={this.insertApplication}>insert Application</button>
        <button onClick={this.insertAbstraction}>insert Abstraction</button>
      </>
    );
  }
  private insertNode = (node: Ast) => {
    const { selected, ast, replace } = this.props;
    if (selected.length === 0) {
      replace(node);
    } else {
      const newAst = cloneDeep(ast);
      set(newAst, selected, node);
      replace(newAst);
    }
  };
  private insertReference = () => {
    this.insertNode({
      type: "Reference",
      identifier: "x",
      source: this.props.selected.join(".")
    });
  };
  private insertApplication = () => {
    this.insertNode({
      type: "Application",
      left: {
        type: "Reference",
        identifier: "x",
        source: this.props.selected.concat("left").join(".")
      },
      right: {
        type: "Reference",
        identifier: "x",
        source: this.props.selected.concat("right").join(".")
      },
      source: this.props.selected.join(".")
    });
  };
  private insertAbstraction = () => {
    this.insertNode({
      type: "Abstraction",
      head: "x",
      body: {
        type: "Reference",
        identifier: "x",
        source: this.props.selected.concat("body").join(".")
      },
      source: ""
    });
  };
  private modifyReference() {
    const { ast, selected } = this.props;
    const node: Ast = get(ast, selected, ast);
    if (node.type === "Reference") {
      return <input onChange={e => this.changeReference(e.target.value)} />;
    } else {
      return null;
    }
  }
  private changeReference = (identifier: string) => {
    this.insertNode({
      type: "Reference",
      identifier,
      source: this.props.selected.join(".")
    });
  };
  private modifyAbstraction() {
    const { ast, selected } = this.props;
    const node: Ast = get(ast, selected, ast);
    if (node.type === "Abstraction") {
      return <input onChange={e => this.changeAbstraction(e.target.value)} />;
    } else {
      return null;
    }
  }
  private changeAbstraction = (head: string) => {
    const { selected, ast } = this.props;
    this.insertNode({
      type: "Abstraction",
      head,
      body: get(ast, selected.concat("body")),
      source: this.props.selected.join(".")
    });
  };
}
