module Yall.Ast where

import Prelude

-- | `Ast` is the representation of untyped lambda calculus in `first-order abstract syntax` form
-- | - `reference` data type used to represent variable names (ex `String`)
-- | - `source` is used to keep track of source code
data Ast reference source
  = Reference reference source
  | Application (Ast reference source) (Ast reference source) source
  | Abstraction reference (Ast reference source) source

derive instance eqAst ∷ (Eq reference, Eq source) ⇒ Eq (Ast reference source)

instance showAst ∷ (Show reference, Show source) ⇒ Show (Ast reference source) where
  show (Reference name source) = show name <> "[" <> show source <> "]"
  show (Application left right source) = "(" <> show left <> " " <> show right <> ")" <> "[" <> show source <> "]" 
  show (Abstraction head body source) = "(" <> show head <> " ⇒ " <> show body <> ")" <> "[" <> show source <> "]"
