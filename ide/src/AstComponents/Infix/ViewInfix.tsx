import * as React from "react";
import { Infix } from "./Infix";

export class ViewInfix extends React.PureComponent<{
  infix: Infix;
  operator: React.ReactNode;
  left: React.ReactNode;
  right: React.ReactNode;
  showParens: boolean;
  select(): void;
}> {
  public render() {
    const { operator, left, right, select, showParens } = this.props;
    return (
      <div style={{ display: "flex" }}>
        {showParens ? <div onClick={select}>(</div> : null}
        {left}
        <div onClick={select}>&nbsp;`</div>
        {operator}
        <div onClick={select}>`&nbsp;</div>
        {right}
        {showParens ? <div onClick={select}>)</div> : null}
      </div>
    );
  }
}
