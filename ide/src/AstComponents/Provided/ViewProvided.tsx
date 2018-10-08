import * as React from "react";
import { Provided } from "./Provided";

export class ViewProvided extends React.PureComponent<{
  provided: Provided;
  select(): void;
}> {
  public render() {
    const { select, provided } = this.props;
    return <span onClick={select}>#{provided.value}</span>;
  }
}
