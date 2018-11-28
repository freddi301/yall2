module Yall.Evaluate.Symbolic where

import Prelude (class Eq, class Ord, flip, not, ($), (&&), (+), (==))
import Data.Set as Set
import Yall.Ast (Ast(..))
import Yall.Ast.Properties (collectFreeReferences, isAstEquivalent)
import Yall.Pauseable (class Pauseable, end, wait, (|>))
import Yall.Reify (reify)
import Yall.Evaluate.Symbol (Symbol(..))

bind ∷ ∀ container content . Pauseable container ⇒ container content → (content → container content) → container content
bind = flip wait

-- | Symbolic evaluation
symbolic ∷ ∀ container reference source provided .
  Eq reference ⇒ Eq provided ⇒ Ord reference ⇒ Pauseable container ⇒
  Int → Ast (Symbol reference Int) source provided → container (Ast (Symbol reference Int) source provided)

symbolic nextSymbol ast = result where
  term = ηConversion ast
  recursive = symbolic nextSymbol
  result = case term of
    -- TODO: guard for inert Y fixed point combinator
    -- TODO: guard for inert Z fixed point combinator
    Application (Abstraction head body _ ) right@(Abstraction _ _ _ ) _ → recursive |> reify head right body
    Application (Abstraction head body _ ) right _ → recursive |> reify head right body
    Application (Reference _ _) (Reference _ _) _ → end $ term
    Application left right@(Reference _ _) source → do
      left ← recursive |> left
      end $ Application left right source
    Application left@(Reference _ _) right source → do
      right ← recursive |> right
      end $ Application left right source
    before@(Application left right source) → do
      left ← recursive |> left
      right ← recursive |> right
      let after = Application left right source
      if after `isAstEquivalent` before then end before -- infinite recursion guard: due to free variables
        else recursive |> after
    Abstraction head body source → do
      let liftedHead = case head of Symbol reference _ → Symbol reference nextSymbol
      let liftedBody = reify head (Reference liftedHead source) body
      computedBody ← symbolic (nextSymbol + 1) |> liftedBody
      end $ Abstraction liftedHead computedBody source
    Reference _ _ → end $ term
    Provided _ _ → end $ term
  ηConversion (Abstraction head (Application body (Reference ref _) _) _ ) | (head == ref) && (head `notUsedIn` body) = body 
  ηConversion ast = ast
  notUsedIn head body = not (Set.member head $ collectFreeReferences { free: Set.empty, scope: Set.empty, term: body })
