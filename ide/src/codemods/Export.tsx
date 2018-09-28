import { Codemod } from "./Codemod";
import { Ast } from "../Ast/Ast";
import { get } from "lodash";
import * as React from "react";
import { IdeState, boundActions } from "../Ide/reducer";

class Export extends React.PureComponent<
  IdeState & typeof boundActions,
  { text: string | null }
> {
  public state: { text: string | null } = { text: null };
  public render() {
    return (
      <>
        <button onClick={this.export}>export json</button>
      </>
    );
  }
  private export = () => {
    const { ast, selected } = this.props;
    const node: Ast = get(ast, selected, ast);
    this.download("snippet.yall.json", JSON.stringify(node));
  };
  private download(filename: string, text: string) {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:application/json;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}

export default {
  id: "export json",
  render: Export
} as Codemod;
