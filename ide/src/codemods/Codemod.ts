import { IdeState, boundActions } from "../Ide/stateManagment";

export interface Codemod {
  id: string;
  render: React.ComponentType<IdeState & typeof boundActions>;
}
