import * as React from "react";

export class Highlight extends React.PureComponent {
  public render() {
    return (
      <div
        style={{
          boxShadow: "0px 0px 3px 0px rgba(0,0,0,0.9)",
          borderRadius: "4px",
          display: "inline-block",
          marginLeft: "-3px",
          marginRight: "-3px",
          paddingLeft: "3px",
          paddingRight: "3px",
          backgroundColor: "rgba(255,255,255,0.05)"
        }}
      >
        {this.props.children}
      </div>
    );
  }
}
