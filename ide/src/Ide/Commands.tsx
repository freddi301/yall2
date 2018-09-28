import * as React from "react";
import { codemods } from "../codemods";
import { IdeState, boundActions } from "./reducer";
import * as Fuse from "fuse.js";

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
  keys: ["id"]
});

export class Commands extends React.PureComponent<
  IdeState & typeof boundActions
> {
  public state = { text: "" };
  public render() {
    const { text } = this.state;
    const list = text ? searchCodemods.search(text) : codemods;
    return (
      <div>
        <form>
          <input
            type="text"
            value={text}
            onChange={this.onChange}
            placeholder="search command"
            style={{ width: "100%" }}
          />
        </form>
        <div>
          {list.map(({ render: Render, id }) => (
            <div key={id}>
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
}
