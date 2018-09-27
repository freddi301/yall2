import * as React from "react";
import { Abstraction } from "../Ast/Abstraction";

export class ViewAbstraction extends React.PureComponent<{
  abstraction: Abstraction;
  body: React.ReactNode;
  showParens: boolean;
  select(): void;
}> {
  public render() {
    const {
      abstraction: { head },
      body,
      select,
      showParens
    } = this.props;
    return (
      <>
        <span onClick={select}>
          {showParens ? "(" : null}
          {head}
        </span>
        <span onClick={select}>→</span>
        {body}
        {showParens ? <span onClick={select}>)</span> : null}
      </>
    );
  }
}
