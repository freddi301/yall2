import { Codemod } from "./Codemod";
import { Ast } from "../Ast";
import { get } from "lodash";
import * as React from "react";
import { IdeState, boundActions } from "../../../Ide/stateManagment";
import { getActiveEditor } from "./common";
import { transpileToJavascript } from "../../../language/Yall.External";
import { toPurescriptAst } from "../../../core/toPurescriptAst";

class TranspileToJavascript extends React.PureComponent<
  IdeState & typeof boundActions,
  { text: string | null }
> {
  public state: { text: string | null } = { text: null };
  public render() {
    return (
      <>
        <button onClick={this.export}>transpile to javascript</button>
      </>
    );
  }
  private export = () => {
    const { ast, selected } = getActiveEditor(this.props);
    const node: Ast = get(ast, selected, ast);
    this.download(
      `${prompt("file name") || "snippet"}.yall.js`,
      transpileToJavascript(toPurescriptAst({ ast: node, path: selected }))
    );
  };
  private download(filename: string, text: string) {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:application/javascript;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}

export default {
  search: "transpile to javascript",
  render: TranspileToJavascript
} as Codemod;
