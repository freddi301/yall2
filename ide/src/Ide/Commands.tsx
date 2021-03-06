import * as React from "react";
import { codemods as codemodsDictionary } from "../AstComponents/Ast/codemods";
import { IdeState, boundActions } from "./stateManagment";
import * as Fuse from "fuse.js";

const codemods = Object.values(codemodsDictionary);

const searchCodemods = new Fuse(codemods, {
  shouldSort: true,
  tokenize: true,
  matchAllTokens: true,
  findAllMatches: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["search"]
});

export class Commands extends React.PureComponent<
  IdeState & typeof boundActions
> {
  private searchCommandElement?: HTMLInputElement | null;
  public state = { text: "" };
  public render() {
    const { text } = this.state;
    const list = text ? searchCodemods.search(text) : codemods;
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <form>
          <input
            type="text"
            value={text}
            onChange={this.onChange}
            placeholder="search command [ctrl+enter]"
            style={{ width: "100%" }}
            ref={searchCommandElement =>
              (this.searchCommandElement = searchCommandElement)
            }
          />
        </form>
        <div style={{ flexGrow: 1, overflow: "auto" }}>
          {list.map(({ render: Render }) => (
            <div key={Render.name}>
              <Render {...this.props} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ text: event.target.value });
  };
  private focusSearch = (event: KeyboardEvent) => {
    const isCtrlEnter = event.key === "Enter" && event.ctrlKey;
    if (isCtrlEnter && this.searchCommandElement) {
      this.searchCommandElement.focus();
      this.setState({ text: "" });
    }
  };
  public componentDidMount() {
    document.body.addEventListener("keypress", this.focusSearch);
  }
  public componentWillUnmount() {
    document.body.removeEventListener("keypress", this.focusSearch);
  }
}
