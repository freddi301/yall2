import * as React from "react";
import { Application } from "../Ast/Application";
export class ViewApplication extends React.PureComponent<{
  application: Application;
  left: React.ReactNode;
  right: React.ReactNode;
  showParens: boolean;
  select(): void;
}> {
  public render() {
    const { left, right, select, showParens } = this.props;
    return (
      <>
        {showParens ? <span onClick={select}>(</span> : null}
        {left}
        <span onClick={select}>&nbsp;</span>
        {right}
        {showParens ? <span onClick={select}>)</span> : null}
      </>
    );
  }
}
