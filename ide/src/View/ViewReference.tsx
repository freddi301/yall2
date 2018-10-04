import * as React from "react";
import { Reference } from "../AstComponents/Referefence/Reference";

export class ViewReference extends React.PureComponent<{
  reference: Reference;
  select(): void;
}> {
  public render() {
    const { select } = this.props;
    return <span onClick={select}>{this.props.reference.identifier}</span>;
  }
}
