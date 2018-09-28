import { isEqual } from "lodash";
import * as React from "react";
import { Ast } from "../Ast/Ast";
import { ViewAbstraction } from "./ViewAbstraction";
import { ViewApplication } from "./ViewApplication";
import { ViewReference } from "./ViewReference";
import { Highlight } from "./Highlight";

interface Props {
  ast: Ast;
  parentAst: Ast;
  path: string[];
  selected: string[];
  select(path: string[]): void;
}

export class ViewAst extends React.PureComponent<Props> {
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
