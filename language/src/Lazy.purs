module Yall.Lazy where

import Prelude

import Yall.Ast (Ast(..))
import Yall.Reify (reify)

-- | evaluates a lambda term using the reify mechanism
-- | the execution is lazy, application right side is not evaluated until needed 
-- | there is no scope, as soon variable gets bound, every occurrence is substituted with its value
evaluate ∷ ∀ reference decoration . Eq reference ⇒ Ast reference decoration → Ast reference decoration
evaluate term = case term of
  Application (Abstraction head body _) right _ → evaluate $ reify head right body
  Application left right decoration → evaluate $ Application (evaluate left) right decoration
  _ → term