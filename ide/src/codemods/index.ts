import ModifyReference from "./ModifyReference";
import { Codemod } from "./Codemod";
import * as _ from "lodash";
import ModifyAbstraction from "./ModifyAbstraction";
import Export from "./Export";
import Import from "./Import";
import InsertReference from "./InsertReference";
import InsertApplication from "./InsertApplication";
import InsertAbstraction from "./InsertAbstraction";
import Copy from "./Copy";
import Paste from "./Paste";

export const codemods: Codemod[] = [
  ModifyReference,
  ModifyAbstraction,
  Export,
  Import,
  InsertReference,
  InsertApplication,
  InsertAbstraction,
  Copy,
  Paste
];

const duplicates = _.difference(codemods, _.uniqBy(codemods, "id"));
if (duplicates.length) {
  throw new Error(`Duplicate codemod ids`);
}
