import * as React from "react";
import {
  ActionHandlers,
  BoundActionCreatorsFrom,
  reducerOf,
  actionsOf,
  DispatchOf
} from "../utils/reduxLike";
import { mapValues } from "lodash";

export class WithHandlers<
  State,
  Handlers extends ActionHandlers<State>
> extends React.Component<{
  handlers: Handlers;
  initial: State;
  render(
    state: State,
    boundActions: BoundActionCreatorsFrom<Handlers>
  ): React.ReactNode;
}> {
  public state = {
    state: this.props.initial,
    reducer: reducerOf(this.props.handlers),
    actions: mapValues(
      actionsOf(this.props.handlers),
      actionCreator => (payload: any) => this.dispatch(actionCreator(payload))
    ) as BoundActionCreatorsFrom<Handlers>
  };
  public render() {
    const { render } = this.props;
    const { state, actions } = this.state;
    return render(state, actions);
  }
  private dispatch: DispatchOf<State, Handlers> = action => {
    this.setState(({ state, reducer }: any) => {
      const nextState = reducer(state, action);
      return { state: nextState };
    });
  };
}
