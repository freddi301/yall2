import { IdeState, boundActions } from "../../../Ide/stateManagment";

export interface Codemod {
  search: string;
  render: React.ComponentType<IdeState & typeof boundActions>;
}
