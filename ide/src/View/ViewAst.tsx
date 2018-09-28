import { isEqual } from "lodash";
import * as React from "react";
import { Ast } from "../Ast/Ast";
import { ViewAbstraction } from "./ViewAbstraction";
import { ViewApplication } from "./ViewApplication";
import { ViewReference } from "./ViewReference";

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
            boxShadow: "0px 0px 3px 0px rgba(0,0,0,0.9)",
            borderRadius: "4px",
            display: "inline-block",
            marginLeft: "-3px",
            marginRight: "-3px",
            paddingLeft: "3px",
            paddingRight: "3px",
            backgroundColor: "rgba(255,255,255,0.05)"
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
    }
  }
}
