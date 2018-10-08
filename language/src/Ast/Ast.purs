module Yall.Ast where

import Prelude

-- | `Ast` is the representation of untyped lambda calculus in `first-order abstract syntax` form
-- | - `reference` data type used to represent variable names (ex `String`)
-- | - `source` is used to keep track of source code
-- | - `provided` is external data
data Ast reference source provided
  = Reference reference source
  | Application (Ast reference source provided) (Ast reference source provided) source
  | Abstraction reference (Ast reference source provided) source
  | Provided provided source

derive instance eqAst ∷ (Eq reference, Eq source, Eq provided) ⇒ Eq (Ast reference source provided)

instance showAst ∷ (Show reference, Show source, Show provided) ⇒ Show (Ast reference source provided) where
  show (Reference name source) = show name <> "[" <> show source <> "]"
  show (Application left right source) = "(" <> show left <> " " <> show right <> ")" <> "[" <> show source <> "]" 
  show (Abstraction head body source) = "(" <> show head <> " ⇒ " <> show body <> ")" <> "[" <> show source <> "]"
  show (Provided provided source) = show provided <> "[" <> show source <> "]"
