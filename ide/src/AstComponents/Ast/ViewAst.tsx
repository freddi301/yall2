import { isEqual } from "lodash";
import * as React from "react";
import { Ast } from "./Ast";
import { ViewAbstraction } from "../Abstraction/ViewAbstraction";
import { ViewApplication } from "../Application/ViewApplication";
import { ViewReference } from "../Referefence/ViewReference";
import { Highlight } from "./Highlight";
import { ViewInfix } from "../Infix/ViewInfix";
import { ViewWhere } from "../Where/ViewWhere";

export interface ViewAstProps {
  ast: Ast;
  parentAst: Ast;
  path: string[];
  selected?: string[];
  select(args: { path: string[] }): void;
  onSelect(props: ViewAstProps): void;
  getType(source: string[]): string;
}

export class ViewAst extends React.PureComponent<ViewAstProps> {
  public render() {
    const { path, selected, getType } = this.props;
    const isSelected = isEqual(path, selected);
    if (isSelected) {
      return (
        <Highlight>
          <div
            style={{
              position: "absolute",
              fontSize: "0.7em",
              marginTop: "-2.7em",
              backgroundColor: "var(--dark-background)",
              zIndex: 1000,
              padding: "0.5em",
              borderRadius: "4px",
              border: "1px solid var(--lighter-dark)"
            }}
          >
            <span style={{ opacity: 0.5 }}>{getType(path)}</span>
          </div>
          {this.renderAst()}
        </Highlight>
      );
    } else {
      return this.renderAst();
    }
  }
  public renderAst() {
    const {
      ast,
      select,
      path,
      selected,
      parentAst,
      onSelect,
      getType
    } = this.props;
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
                getType={getType}
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
                getType={getType}
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
                getType={getType}
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
                getType={getType}
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
                getType={getType}
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
                getType={getType}
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
                getType={getType}
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
                  getType={getType}
                />
              );
              const isSelected = isEqual(
                selected,
                path.concat(["scope", String(index)])
              );
              return {
                identifier: isSelected ? (
                  <Highlight>{identifier}</Highlight>
                ) : (
                  identifier
                ),
                body: bodyComponent,
                selectScope() {
                  select({ path: path.concat(["scope", String(index)]) });
                },
                type: getType(path.concat(["scope", String(index), "body"]))
              };
            })}
          />
        );
    }
  }
  private selectCurrent = () => this.props.onSelect(this.props);
}
