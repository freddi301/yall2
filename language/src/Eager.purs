module Yall.Eager where

import Prelude

import Yall.Ast (Ast(..))
import Yall.Reify (reify)

-- | `evaluate` evaluates a lambda term using the reify mechanism,
-- | the execution is eager,
-- | there is no scope, as soon variable gets bound, every occurrence is substituted with its value.
evaluate ∷ ∀ reference source . Eq reference ⇒ (Ast reference source) → (Ast reference source)
evaluate term = case term of
  Application (Abstraction head body _) right@(Abstraction _ _ _) _ → evaluate $ reify head right body
  Application left right source → evaluate $ Application (evaluate left) (evaluate right) source
  _ → term
