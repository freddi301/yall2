import * as React from "react";
import { Where } from "../AstComponents/Where/Where";

export class ViewWhere extends React.PureComponent<{
  where: Where;
  body: React.ReactNode;
  scope: Array<{
    identifier: string;
    body: React.ReactNode;
    selectScope(): void;
  }>;
  select(): void;
}> {
  public render() {
    const { select, body, scope } = this.props;
    return (
      <div>
        <div>{body}</div>
        {scope.map(({ identifier, body, selectScope }, index) => (
          <div key={`${index}${identifier}`} style={{ display: "flex" }}>
            <div onClick={select} style={{ width: "1em" }} />
            <div onClick={selectScope}>{identifier} =&nbsp;</div>
            <div>{body}</div>
          </div>
        ))}
      </div>
    );
  }
}
