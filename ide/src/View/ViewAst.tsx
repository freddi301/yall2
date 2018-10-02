import { isEqual } from "lodash";
import * as React from "react";
import { Ast } from "../Ast/Ast";
import { ViewAbstraction } from "./ViewAbstraction";
import { ViewApplication } from "./ViewApplication";
import { ViewReference } from "./ViewReference";
import { Highlight } from "./Highlight";

export interface ViewAstProps {
  ast: Ast;
  parentAst: Ast;
  path: string[];
  selected: string[];
  select(args: { path: string[] }): void;
  onSelect(props: ViewAstProps): void;
}

export class ViewAst extends React.PureComponent<ViewAstProps> {
  public render() {
    const { path, selected } = this.props;
    const isSelected = isEqual(path, selected);
    if (isSelected) {
      return <Highlight>{this.renderAst()}</Highlight>;
    } else {
      return this.renderAst();
    }
  }
  public renderAst() {
    const { ast, select, path, selected, parentAst, onSelect } = this.props;
    switch (ast.type) {
      case "Reference":
        return <ViewReference reference={ast} select={this.selectCurrent} />;
      case "Application":
        return (
          <ViewApplication
            application={ast}
            select={this.selectCurrent}
            showParens={
              !(
                (parentAst.type === "Application" && parentAst.left === ast) ||
                parentAst.type === "Abstraction"
              )
            }
            left={
              <ViewAst
                ast={ast.left}
                parentAst={ast}
                path={path.concat("left")}
                select={select}
                onSelect={onSelect}
                selected={selected}
              />
            }
            right={
              <ViewAst
                ast={ast.right}
                parentAst={ast}
                path={path.concat("right")}
                select={select}
                onSelect={onSelect}
                selected={selected}
              />
            }
          />
        );
      case "Abstraction":
        return (
          <ViewAbstraction
            abstraction={ast}
            select={this.selectCurrent}
            showParens={parentAst.type !== "Abstraction"}
            body={
              <ViewAst
                parentAst={ast}
                selected={selected}
                ast={ast.body}
                path={path.concat("body")}
                select={select}
                onSelect={onSelect}
              />
            }
          />
        );
    }
  }
  private selectCurrent = () => this.props.onSelect(this.props);
}
