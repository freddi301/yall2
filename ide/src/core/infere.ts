import { getType } from "../language/Yall.External";

import { PurescriptAst } from "../language/Yall.Ast";
import { PurescriptSymbol } from "src/language/Yall.Evaluate.Symbol";

export const infere = {
  getType: (
    ast: PurescriptAst<PurescriptSymbol<string, number>, string[], string>
  ) => (source: string[]): string => {
    return getType(ast)(source);
  }
};
