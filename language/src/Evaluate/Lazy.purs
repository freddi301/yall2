module Yall.Evaluate.Lazy where

import Prelude (class Eq, flip)
import Yall.Pauseable (class Pauseable, end, wait, (|>))
import Yall.Ast (Ast(..))
import Yall.Ast.Properties (isAstEquivalent)
import Yall.Reify (reify) 

bind ∷ ∀ container content . Pauseable container ⇒ container content → (content → container content) → container content
bind = flip wait

-- | Lazy evaluation
lazy ∷ ∀ container reference source . Eq reference ⇒ Pauseable container ⇒
  Ast reference source → container (Ast reference source)

lazy (Application (Abstraction head body _) right _) =
  lazy |> reify head right body
lazy before@(Application left right source) = do
  left ← lazy |> left
  let after = Application left right source
  if after `isAstEquivalent` before then end before -- infinite recursion guard: due to free variables
    else lazy |> after
lazy term = end term