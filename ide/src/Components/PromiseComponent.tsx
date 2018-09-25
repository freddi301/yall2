import * as React from "react";

interface Props<T> {
  promise: Promise<T>;
  onPending?: React.ReactNode;
  onResolve?(value: T): React.ReactNode;
  onReject?(value: unknown): React.ReactNode;
}

type State<T> =
  | { status: "resolved"; value: T }
  | { status: "pending" }
  | { status: "rejected"; value: unknown };

export class PromiseComponent<T> extends React.Component<Props<T>, State<T>> {
  public state: State<T> = { status: "pending" };
  public render() {
    const { onResolve, onReject, onPending } = this.props;
    switch (this.state.status) {
      case "pending":
        if (onPending) {
          return onPending;
        } else {
          return null;
        }
      case "resolved":
        if (onResolve) {
          return onResolve(this.state.value);
        } else {
          return null;
        }
      case "rejected":
        if (onReject) {
          return onReject(this.state.value);
        } else {
          return null;
        }
    }
  }
  public componentDidMount() {
    this.subscribeToPromise();
  }
  public componentDidUpdate(prevProps: Props<T>) {
    if (this.props.promise !== prevProps.promise) {
      this.subscribeToPromise();
      this.setState({ status: "pending" });
    }
  }
  private subscribeToPromise() {
    this.props.promise.then(
      value => this.setState({ status: "resolved", value }),
      value => this.setState({ status: "rejected", value })
    );
  }
}
