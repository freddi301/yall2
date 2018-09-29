module Yall.Evaluate.Eager where

import Yall.Pauseable (class Pauseable, end, wait, (|>))
import Yall.Ast (Ast(..))
import Yall.Ast.Properties (isAstEquivalent)
import Yall.Reify (reify)
import Prelude (class Eq, flip, ($))

bind ∷ ∀ container content . Pauseable container ⇒ container content → (content → container content) → container content
bind = flip wait

-- | Eager evaluation
eager ∷ ∀ container reference source . Eq reference ⇒ Pauseable container ⇒
  Ast reference source → container (Ast reference source)

eager term@(Application _ (Reference _ _) _) = end term -- infinite recursion due to free variable guard
eager term@(Application (Reference _ _) _ _) = end term -- infinite recursion due to free variable guard
eager (Application left@(Abstraction head body _) right _) | left `isAstEquivalent` right = end $ reify head right body -- infinite recursion due to Y fixed combinator guard
-- TODO: guard for Y fixed point combinator useage

eager (Application (Abstraction head body _) right@(Abstraction _ _ _) _) =
  eager |> reify head right body
eager (Application left right source) = do
  left ← eager |> left
  right ← eager |> right
  eager |> Application left right source
eager term = end term