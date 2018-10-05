import { getType } from "../language/Yall.External";

import { PurescriptAst } from "../language/Yall.Ast";

export const infere = {
  getType: (ast: PurescriptAst<string, string[]>) => (
    source: string[]
  ): string => {
    return getType(ast)(source);
  }
};
