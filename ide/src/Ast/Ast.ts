import { Abstraction } from "./Abstraction";
import { Application } from "./Application";
import { Reference } from "./Reference";
import { Where } from "./Where";

export type Ast = Reference | Application | Abstraction | Where;
