import ModifyReference from "./ModifyReference";
import * as _ from "lodash";
import ModifyAbstraction from "./ModifyAbstraction";
import Export from "./Export";
import Import from "./Import";
import InsertReference from "./InsertReference";
import InsertApplication from "./InsertApplication";
import InsertAbstraction from "./InsertAbstraction";
import Copy from "./Copy";
import Paste from "./Paste";
import InsertInfix from "./InsertInfix";
import { Where } from "./Where";

export const codemods = {
  ModifyReference,
  ModifyAbstraction,
  Export,
  Import,
  InsertReference,
  InsertApplication,
  InsertAbstraction,
  InsertInfix,
  Copy,
  Paste,
  ...Where
};
