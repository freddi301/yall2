import { isEqual } from "lodash";
import * as React from "react";
import { Abstraction, Application, Ast, Reference } from "../Ast/Ast";

export class ViewAst extends React.PureComponent<{
  ast: Ast;
  path: string[];
  selected: string[];
  select(path: string[]): void;
}> {
  public render() {
    const { path, selected } = this.props;
    const isSelected = isEqual(path, selected);
    if (isSelected) {
      return (
        <span
          style={{
            boxShadow: "0px 0px 3px 0px rgba(0,0,0,0.75)",
            borderRadius: "3px"
          }}
        >
          {this.renderAst()}
        </span>
      );
    } else {
      return this.renderAst();
    }
  }
  public renderAst() {
    const { ast, select, path, selected } = this.props;
    const selectCurrent = () => select(path);
    switch (ast.type) {
      case "Reference":
        return <ViewReference reference={ast} select={selectCurrent} />;
      case "Application":
        return (
          <ViewApplication
            application={ast}
            select={selectCurrent}
            left={
              <ViewAst
                ast={ast.left}
                path={path.concat("left")}
                select={select}
                selected={selected}
              />
            }
            right={
              <ViewAst
                ast={ast.right}
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
            body={
              <ViewAst
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

export class ViewReference extends React.PureComponent<{
  reference: Reference;
  select(): void;
}> {
  public render() {
    const { select } = this.props;
    return <span onClick={select}>{this.props.reference.identifier}</span>;
  }
}

export class ViewApplication extends React.PureComponent<{
  application: Application;
  left: React.ReactNode;
  right: React.ReactNode;
  select(): void;
}> {
  public render() {
    const { left, right, select } = this.props;
    return (
      <>
        <span onClick={select}>(</span>
        {left}
        <span onClick={select}>&nbsp;</span>
        {right}
        <span onClick={select}>)</span>
      </>
    );
  }
}

export class ViewAbstraction extends React.PureComponent<{
  abstraction: Abstraction;
  body: React.ReactNode;
  select(): void;
}> {
  public render() {
    const {
      abstraction: { head },
      body,
      select
    } = this.props;
    return (
      <>
        <span onClick={select}>({head}</span>
        <span onClick={select}>→</span>
        {body}
        <span onClick={select}>)</span>
      </>
    );
  }
}
