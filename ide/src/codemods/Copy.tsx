import { Codemod } from "./Codemod";
import * as React from "react";
import { IdeState, boundActions } from "../Ide/stateManagment";
import { get } from "lodash";
import { getActiveEditor } from "./common";

class Copy extends React.PureComponent<IdeState & typeof boundActions> {
  public render() {
    return <button onClick={this.copy}>copy</button>;
  }
  private copy = () => {
    const { clip } = this.props;
    const { ast, selected } = getActiveEditor(this.props);
    clip({ ast: get(ast, selected, ast) });
  };
}

export default {
  search: "copy",
  render: Copy
} as Codemod;
