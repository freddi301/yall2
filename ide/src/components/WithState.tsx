import * as React from "react";

interface Props<T> {
  initial: T;
  render(state: T, set: (state: T) => void): React.ReactNode;
}

interface State<T> {
  state: T;
}

export class WithState<T> extends React.Component<Props<T>, State<T>> {
  public state: State<T> = { state: this.props.initial };
  public render() {
    return this.props.render(this.state.state, this.set);
  }
  private set = (state: T) => {
    this.setState({ state });
  };
}
