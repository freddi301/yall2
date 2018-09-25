module Yall.Ast where

-- | `Ast` is the representation of untyped lambda calculus in `first-order abstract syntax` form
-- | - `reference` data type used to represent variable names (ex `String`)
-- | - `decoration` an optional additional data (ex `Unit`) 
data Ast reference source
  = Reference reference source
  | Application (Ast reference source) (Ast reference source) source
  | Abstraction reference (Ast reference source) source

-- derive instance eqAst ∷ (Eq reference, Eq source) ⇒ Eq (Ast reference source)