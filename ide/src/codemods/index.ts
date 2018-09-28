import ModifyReference from "./ModifyReference";
import { Codemod } from "./Codemod";
import * as _ from "lodash";
import ModifyAbstraction from "./ModifyAbstraction";
import Export from "./Export";
import Import from "./Import";
import InsertReference from "./InsertReference";
import InsertApplication from "./InsertApplication";
import InsertAbstraction from "./InsertAbstraction";

export const codemods: Codemod[] = [
  ModifyReference,
  ModifyAbstraction,
  Export,
  Import,
  InsertReference,
  InsertApplication,
  InsertAbstraction
];

const duplicates = _.difference(codemods, _.uniqBy(codemods, "id"));
if (duplicates.length) {
  throw new Error(`Duplicate codemod ids`);
}
