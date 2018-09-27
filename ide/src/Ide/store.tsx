import { createStore } from "redux";
import { initial, reducer } from "./reducer";

const devTools =
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION__();

const reduxReducer: typeof reducer = (state, action) => {
  if (action.type.startsWith("@@")) {
    return state;
  } else {
    return reducer(state, action);
  }
};

export const store = createStore(reduxReducer, initial, devTools);
