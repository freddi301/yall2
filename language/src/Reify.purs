module Yall.Reify where

import Prelude (class Eq, (==))

import Yall.Ast (Ast(..))

-- | `reify` takes a reference and substitutes every occurrence of it respecting lexical scoping rules,
-- | it corresponds to β-reduction.
-- | - `ref` the reference
-- | - `value` the value being copied in the ast
-- | - `term` the ast where the value will be substituted
reify ∷ ∀ reference source provided .
  Eq reference ⇒
  reference → Ast reference source provided → Ast reference source provided → Ast reference source provided
reify ref value term = case term of
  Reference name source → if ref == name then value else term
  Abstraction head body source → if ref == head then term else Abstraction head (reify ref value body) source
  Application left right source → Application (reify ref value left) (reify ref value right) source
  Provided value source → term