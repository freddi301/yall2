export type Ast = Reference | Application | Abstraction;

export interface Reference {
  type: "Reference";
  identifier: string;
  source: string;
}

export interface Application {
  type: "Application";
  left: Ast;
  right: Ast;
  source: string;
}

export interface Abstraction {
  type: "Abstraction";
  head: string;
  body: Ast;
  source: string;
}
