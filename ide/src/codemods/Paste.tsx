import { Codemod } from "./Codemod";
import * as React from "react";
import { IdeState, boundActions } from "../Ide/stateManagment";
import { insertNode } from "./common";

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
  id: "paste",
  render: Paste
} as Codemod;
