import * as React from "react";
import { Abstraction, Application, Ast, Reference } from "../Ast/Ast";

export class ViewAst extends React.PureComponent<{
  ast: Ast;
  path: string[];
  select(path: string[]): void;
}> {
  public render() {
    const { ast, select, path } = this.props;
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
              />
            }
            right={
              <ViewAst
                ast={ast.left}
                path={path.concat("left")}
                select={select}
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
        <span onClick={select}>(</span>
        {head}
        <span onClick={select}>=></span>
        {body}
        <span onClick={select}>)</span>
      </>
    );
  }
}
