import { isEqual } from "lodash";
import * as React from "react";
import { Ast } from "../AstComponents/Ast";
import { ViewAbstraction } from "./ViewAbstraction";
import { ViewApplication } from "./ViewApplication";
import { ViewReference } from "./ViewReference";
import { Highlight } from "./Highlight";
import { ViewInfix } from "./ViewInfix";
import { ViewWhere } from "./ViewWhere";

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
            showParens={
              !(parentAst.type === "Abstraction" || parentAst.type === "Where")
            }
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
      case "Infix":
        return (
          <ViewInfix
            infix={ast}
            select={this.selectCurrent}
            showParens={true}
            operator={
              <ViewAst
                ast={ast.operator}
                parentAst={ast}
                path={path.concat("operator")}
                select={select}
                onSelect={onSelect}
                selected={selected}
              />
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
      case "Where":
        return (
          <ViewWhere
            where={ast}
            select={this.selectCurrent}
            body={
              <ViewAst
                ast={ast.body}
                parentAst={ast}
                path={path.concat("body")}
                select={select}
                onSelect={onSelect}
                selected={selected}
              />
            }
            scope={ast.scope.map(({ identifier, body }, index) => {
              const bodyComponent = (
                <ViewAst
                  ast={body}
                  parentAst={ast}
                  path={path.concat(["scope", String(index), "body"])}
                  select={select}
                  onSelect={onSelect}
                  selected={selected}
                />
              );
              const isSelected = isEqual(
                selected,
                path.concat(["scope", String(index)])
              );
              return {
                identifier,
                body: isSelected ? (
                  <Highlight>{bodyComponent}</Highlight>
                ) : (
                  bodyComponent
                ),
                selectScope() {
                  select({ path: path.concat(["scope", String(index)]) });
                }
              };
            })}
          />
        );
    }
  }
  private selectCurrent = () => this.props.onSelect(this.props);
}
