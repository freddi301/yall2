import { Abstraction } from "../Abstraction/Abstraction";
import { Application } from "../Application/Application";
import { Reference } from "../Referefence/Reference";
import { Infix } from "../Infix/Infix";
import { Where } from "../Where/Where";
import { Provided } from "../Provided/Provided";

export type Ast = InlineAst | Where;
export type InlineAst = BasicAst | Infix;
export type BasicAst = Reference | Application | Abstraction | Provided;
