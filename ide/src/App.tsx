import * as React from "react";
import { Provider } from "react-redux";
import { IdeConnected } from "./Ide/Ide";
import { store } from "./Ide/store";
import "./index.css";

class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <IdeConnected />
      </Provider>
    );
  }
}

export default App;
