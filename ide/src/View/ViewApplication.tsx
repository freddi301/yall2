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
      <div style={{ display: "flex" }}>
        {showParens ? <div onClick={select}>(</div> : null}
        {left}
        <div onClick={select}>&nbsp;</div>
        {right}
        {showParens ? <div onClick={select}>)</div> : null}
      </div>
    );
  }
}
