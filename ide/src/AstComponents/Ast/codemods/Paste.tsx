import { Codemod } from "./Codemod";
import * as React from "react";
import { insertNode } from "./common";
import { IdeState, boundActions } from "../../../Ide/stateManagment";

class Paste extends React.PureComponent<IdeState & typeof boundActions> {
  public render() {
    return <button onClick={this.paste}>paste</button>;
  }
  private paste = () => {
    const { clipboard } = this.props;
    insertNode(this.props, clipboard);
  };
}

export default {
  search: "paste",
  render: Paste
} as Codemod;
