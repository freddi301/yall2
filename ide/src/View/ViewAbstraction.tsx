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
      <div style={{ display: "flex" }}>
        <div onClick={select}>
          {showParens ? "(" : null}
          {head}
        </div>
        <div onClick={select}>→</div>
        {body}
        {showParens ? <div onClick={select}>)</div> : null}
      </div>
    );
  }
}
