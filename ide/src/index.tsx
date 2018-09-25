import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

const rootElement = document.getElementById("root") as HTMLElement;

ReactDOM.render(<App />, rootElement);

if ((module as any).hot) {
  (module as any).hot.accept("./App", () => {
    const NextApp = require("./App").default;
    ReactDOM.render(<NextApp />, rootElement);
  });
}

registerServiceWorker();
