import { IdeState, boundActions } from "../Ide/reducer";

export interface Codemod {
  id: string;
  render: React.ComponentType<IdeState & typeof boundActions>;
}
