import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

const rootElement = document.getElementById("root") as HTMLElement;

function render(Component: React.ComponentType<{}>) {
  ReactDOM.render(<Component />, rootElement);
}

render(App);

registerServiceWorker();

if (module.hot) {
  let NextApp = App;
  module.hot.accept("./App", () => {
    NextApp = require("./App").default;
    render(NextApp);
  });
}

declare const module: NodeModule & { hot: any };

// module.exports = require("./cloud/zeit-now/index"); //tslint:disable-line
