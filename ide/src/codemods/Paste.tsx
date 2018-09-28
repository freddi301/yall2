import { Codemod } from "./Codemod";
import * as React from "react";
import { IdeState, boundActions } from "../Ide/reducer";
import { insertNode } from "./common";

class Copy extends React.PureComponent<IdeState & typeof boundActions> {
  public render() {
    return <button onClick={this.paste}>paste</button>;
  }
  private paste = () => {
    const { clipboard } = this.props;
    insertNode(this.props, clipboard);
  };
}

export default {
  id: "copy",
  render: Copy
} as Codemod;
