module Yall.Evaluate.Eager where

import Prelude (class Eq, flip, ($))
import Yall.Ast (Ast(..))
import Yall.Ast.Properties (isAstEquivalent)
import Yall.Pauseable (class Pauseable, end, wait, (|>))
import Yall.Reify (reify)

bind ∷ ∀ container content . Pauseable container ⇒ container content → (content → container content) → container content
bind = flip wait

-- | Eager evaluation
eager ∷ ∀ container reference source provided . Eq reference ⇒ Eq provided ⇒ Pauseable container ⇒
  Ast reference source provided → container (Ast reference source provided)

eager (Application abs@(Abstraction head body _) app@(Application left right _) _)
  | left `isAstEquivalent` right = end $ reify head app body -- infinite recursion guard: due to Y fixed point combinator
eager (Application (Abstraction head body _) right@(Abstraction _ _ _) _) =
  eager |> reify head right body
eager before@(Application left right source) = do
  left ← eager |> left
  right ← eager |> right
  let after = Application left right source
  if after `isAstEquivalent` before then end before -- infinite recursion guard: due to free variables
    else eager |> after
eager term = end term