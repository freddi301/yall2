import { Codemod } from "./Codemod";
import * as React from "react";
import { IdeState, boundActions } from "../Ide/stateManagment";
import { get } from "lodash";

class Copy extends React.PureComponent<IdeState & typeof boundActions> {
  public render() {
    return <button onClick={this.copy}>copy</button>;
  }
  private copy = () => {
    const { ast, clip, selected } = this.props;
    clip(get(ast, selected, ast));
  };
}

export default {
  id: "copy",
  render: Copy
} as Codemod;
