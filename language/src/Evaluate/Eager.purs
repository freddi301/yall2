module Yall.Evaluate.Eager where

import Prelude (class Eq, flip, ($))
import Yall.Ast (Ast(..))
import Yall.Ast.Properties (isAstEquivalent)
import Yall.Pauseable (class Pauseable, end, wait, (|>))
import Yall.Reify (reify)

bind ∷ ∀ container content . Pauseable container ⇒ container content → (content → container content) → container content
bind = flip wait

-- | Eager evaluation
eager ∷ ∀ container reference source . Eq reference ⇒ Pauseable container ⇒
  Ast reference source → container (Ast reference source)

eager (Application abs@(Abstraction head body _) app@(Application left right _) _)
  | left `isAstEquivalent` right = end $ reify head app body
eager (Application (Abstraction head body _) right@(Abstraction _ _ _) _) =
  eager |> reify head right body
eager before@(Application left right source) = do
  left ← eager |> left
  right ← eager |> right
  let after = Application left right source
  if after `isAstEquivalent` before then end before
    else eager |> after -- infinite recursion guard: due to free variables
eager term = end term