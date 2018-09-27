import * as React from "react";
import { Where } from "../Ast/Where";

export class ViewWhere extends React.PureComponent<
  {
    where: Where;
    body: React.ReactNode;
    scope: React.ReactNode[];
    select(): void;
  },
  { viewScope: boolean }
> {
  public state = { viewScope: true };
  public render() {
    const { body, scope, select, where } = this.props;
    const { viewScope } = this.state;
    return (
      <div>
        <div>
          {body} <span onClick={select}>where</span>{" "}
          <span onClick={this.toggle}>{viewScope ? "-" : "+"}</span>
        </div>
        {viewScope
          ? scope.map((entry, index) => (
              <div key={where.scope[index].head} style={{ marginLeft: "1em" }}>
                {entry}
              </div>
            ))
          : null}
      </div>
    );
  }
  private toggle = () => {
    this.setState(({ viewScope }) => ({ viewScope: !viewScope }));
  };
}
