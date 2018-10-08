import ModifyReference from "../../Referefence/codemods/ModifyReference";
import ModifyAbstraction from "../../Abstraction/codemods/ModifyAbstraction";
import Export from "./Export";
import Import from "./Import";
import InsertReference from "../../Referefence/codemods/InsertReference";
import InsertApplication from "../../Application/codemods/InsertApplication";
import InsertAbstraction from "../../Abstraction/codemods/InsertAbstraction";
import InsertInfix from "../../Infix/codemods/InsertInfix";
import Copy from "./Copy";
import Paste from "./Paste";
import { Where } from "../../Where/codemods";
import TranspileToJavascript from "./TranspileToJavascript";

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
  TranspileToJavascript,
  ...Where
};
