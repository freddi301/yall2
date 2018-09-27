import { isEqual } from "lodash";
import * as React from "react";
import { Ast } from "../Ast/Ast";
import { ViewAbstraction } from "./ViewAbstraction";
import { ViewApplication } from "./ViewApplication";
import { ViewReference } from "./ViewReference";
import { ViewWhere } from "./ViewWhere";

export class ViewAst extends React.PureComponent<{
  ast: Ast;
  parentAst: Ast;
  path: string[];
  selected: string[];
  select(path: string[]): void;
}> {
  public render() {
    const { path, selected } = this.props;
    const isSelected = isEqual(path, selected);
    if (isSelected) {
      return (
        <div
          style={{
            boxShadow: "0px 0px 3px 0px rgba(0,0,0,0.75)",
            borderRadius: "3px",
            display: "inline-block"
          }}
        >
          {this.renderAst()}
        </div>
      );
    } else {
      return this.renderAst();
    }
  }
  public renderAst() {
    const { ast, select, path, selected, parentAst } = this.props;
    const selectCurrent = () => select(path);
    switch (ast.type) {
      case "Reference":
        return <ViewReference reference={ast} select={selectCurrent} />;
      case "Application":
        return (
          <ViewApplication
            application={ast}
            select={selectCurrent}
            showParens={
              !(parentAst.type === "Application" && parentAst.left === ast)
            }
            left={
              <ViewAst
                ast={ast.left}
                parentAst={ast}
                path={path.concat("left")}
                select={select}
                selected={selected}
              />
            }
            right={
              <ViewAst
                ast={ast.right}
                parentAst={ast}
                path={path.concat("right")}
                select={select}
                selected={selected}
              />
            }
          />
        );
      case "Abstraction":
        return (
          <ViewAbstraction
            abstraction={ast}
            select={selectCurrent}
            showParens={parentAst.type !== "Abstraction"}
            body={
              <ViewAst
                parentAst={ast}
                selected={selected}
                ast={ast.body}
                path={path.concat("body")}
                select={select}
              />
            }
          />
        );
      case "Where":
        return (
          <ViewWhere
            where={ast}
            select={selectCurrent}
            body={
              <ViewAst
                parentAst={ast}
                selected={selected}
                ast={ast.body}
                path={path.concat("body")}
                select={select}
              />
            }
            scope={ast.scope.map((abstraction, index) => (
              <ViewAst
                parentAst={ast}
                ast={abstraction}
                path={path.concat(["scope", String(index)])}
                select={select}
                selected={selected}
              />
            ))}
          />
        );
    }
  }
}
