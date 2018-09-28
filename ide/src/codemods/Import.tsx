import { Codemod } from "./Codemod";
import { Ast } from "../Ast/Ast";
import * as React from "react";
import { IdeState, boundActions } from "../Ide/reducer";
import { insertNode } from "./common";

class Import extends React.PureComponent<IdeState & typeof boundActions> {
  public state: { text: string | null } = { text: null };
  public render() {
    return (
      <>
        <button onClick={this.import}>import json</button>
      </>
    );
  }
  private import = async () => {
    insertNode(this.props, await this.readFile());
  };
  private readFile() {
    return new Promise<Ast>(resolve => {
      const element = document.createElement("input");
      element.setAttribute("type", "file");
      element.setAttribute("accept", ".json");
      element.style.display = "none";
      element.addEventListener("change", event => {
        const file: File = (event as any).target.files[0];
        const fileReader = new FileReader();
        fileReader.onload = e => {
          const text = (e as any).target.result;
          const json = JSON.parse(text);
          resolve(json);
        };
        fileReader.readAsText(file);
      });
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });
  }
}

export default {
  id: "import json",
  render: Import
} as Codemod;
