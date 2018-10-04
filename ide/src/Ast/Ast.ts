import { Abstraction } from "./Abstraction";
import { Application } from "./Application";
import { Reference } from "./Reference";
import { Infix } from "./Infix";
import { Where } from "./Where";

export type Ast = InlineAst | Where;
export type InlineAst = BasicAst | Infix;
export type BasicAst = Reference | Application | Abstraction;
