import { Abstraction } from "./Abstraction";
import { Application } from "./Application";
import { Reference } from "./Reference";
import { Infix } from "./Infix";

export type InlineAst = Reference | Application | Abstraction | Infix;

export type Ast = InlineAst;
