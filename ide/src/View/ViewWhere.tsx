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
        <div>{body}</div>
        <div style={{ display: "flex" }}>
          <div
            onClick={select}
            style={{
              width: "8px",
              height: "4px",
              backgroundColor: "var(--white-text)",
              marginRight: "2px"
            }}
          />
          <div
            onClick={this.toggle}
            style={{
              minWidth: "8px",
              flexGrow: 1,
              height: "4px",
              backgroundColor: "var(--white-text)"
            }}
          />
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
