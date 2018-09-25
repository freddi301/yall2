module Yall.Lazy where

import Prelude

import Yall.Ast (Ast(..))
import Yall.Reify (reify)

-- | evaluates a lambda term using the reify mechanism
-- | the execution is lazy, application right side is not evaluated until needed 
-- | there is no scope, as soon variable gets bound, every occurrence is substituted with its value
evaluate ∷ ∀ reference source . Eq reference ⇒ Ast reference source → Ast reference source
evaluate term = case term of
  Application (Abstraction head body _) right _ → evaluate $ reify head right body
  Application left right source → evaluate $ Application (evaluate left) right source
  _ → term