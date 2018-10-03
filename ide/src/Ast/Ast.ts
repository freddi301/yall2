import { Abstraction } from "./Abstraction";
import { Application } from "./Application";
import { Reference } from "./Reference";
import { Infix } from "./Infix";

export type Ast = Reference | Application | Abstraction | Infix;
