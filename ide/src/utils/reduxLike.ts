export interface ActionHandler<State, Payload> {
  (state: State, payload: Payload): State;
}
export interface ActionHandlers<State> {
  [index: string]: ActionHandler<State, any>;
}

export interface Action<Type, Payload> {
  type: Type;
  payload: Payload;
}
export interface ActionCreator<Type, Payload> {
  (payload: Payload): Action<Type, Payload>;
}
export interface ActionCreators {
  [index: string]: ActionCreator<any, any>;
}

type ActionCreatorsFrom<Handlers extends ActionHandlers<any>> = {
  [Type in keyof Handlers]: ActionCreator<
    Type,
    ExtractPayoladType<Handlers[Type]>
  >
};

type ExtractPayoladType<
  T extends ActionHandler<any, any>
> = T extends ActionHandler<any, infer Payload> ? Payload : any;

export function actionsOf<State, Handlers extends ActionHandlers<State>>(
  handlers: Handlers
): ActionCreatorsFrom<Handlers> {
  const actionsCreators: ActionCreatorsFrom<
    Handlers
  > = {} as ActionCreatorsFrom<Handlers>;
  Object.keys(handlers).forEach(type => {
    actionsCreators[type] = (payload: any) => ({ type, payload });
  });
  return actionsCreators;
}

export function reducerOf<State, Handlers extends ActionHandlers<State>>(
  handlers: Handlers
) {
  return <
    Name extends keyof Handlers,
    Payload extends ExtractPayoladType<Handlers[Name]>
  >(
    state: State,
    action: Action<Name, Payload>
  ): State => {
    if (!handlers[action.type]) {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
    return handlers[action.type](state, action.payload);
  };
}

export type DispatchOf<State, Handlers extends ActionHandlers<State>> = <
  Name extends keyof Handlers,
  Payload extends ExtractPayoladType<Handlers[Name]>
>(
  action: Action<Name, Payload>
) => void;

export type BoundActionCreatorsFrom<Handlers extends ActionHandlers<any>> = {
  [Type in keyof Handlers]: (
    payload: ExtractPayoladType<Handlers[Type]>
  ) => void
};

export function createStateManagment<State>() {
  return <Handlers extends ActionHandlers<State>>(handlers: Handlers) => {
    return {
      handlers,
      actions: actionsOf(handlers),
      reducer: reducerOf(handlers),
      dispatch: (null as any) as DispatchOf<State, Handlers>,
      boundActions: (null as any) as BoundActionCreatorsFrom<Handlers>
    };
  };
}
