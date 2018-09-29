module Yall.Evaluate.Lazy where

import Yall.Pauseable (class Pauseable, end, wait, (|>))
import Yall.Ast (Ast(..))
import Yall.Reify (reify) 
import Prelude (class Eq, flip)

bind ∷ ∀ container content . Pauseable container ⇒ container content → (content → container content) → container content
bind = flip wait

-- | Lazy evaluation
lazy ∷ ∀ container reference source . Eq reference ⇒ Pauseable container ⇒
  Ast reference source → container (Ast reference source)

lazy term@(Application _ (Reference _ _) _) = end term -- infinite recursion due to free variable guard
lazy term@(Application (Reference _ _) _ _) = end term -- infinite recursion due to free variable guard

lazy (Application (Abstraction head body _) right _) =
  lazy |> reify head right body
lazy (Application left right source) = do
  left ← lazy |> left
  lazy |> Application left right source
lazy term = end term