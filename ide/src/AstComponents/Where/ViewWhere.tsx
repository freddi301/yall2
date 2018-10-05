import * as React from "react";
import { Where } from "./Where";

export class ViewWhere extends React.PureComponent<{
  where: Where;
  body: React.ReactNode;
  scope: Array<{
    identifier: React.ReactNode;
    body: React.ReactNode;
    selectScope(): void;
    type: string;
  }>;
  select(): void;
}> {
  public render() {
    const { select, body, scope } = this.props;
    return (
      <div>
        <div>{body}</div>
        {scope.map(({ identifier, body, selectScope, type }, index) => (
          <div key={`${index}${identifier}`} style={{ display: "flex" }}>
            <div onClick={select} style={{ width: "1em" }} />
            <div>
              <div style={{ opacity: 0.5, fontSize: "0.7em" }}>{type}</div>
              <div style={{ display: "flex" }}>
                <div onClick={selectScope}>{identifier} =&nbsp;</div>
                <div>{body}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
