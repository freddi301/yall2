module Yall.Evaluate.LazySymbolic where

import Prelude (class Eq, class Ord, flip, not, ($), (&&), (+), (==))
import Data.Set as Set
import Yall.Ast (Ast(..))
import Yall.Ast.Properties (collectFreeReferences)
import Yall.Pauseable (class Pauseable, end, wait, (|>))
import Yall.Reify (reify)
import Yall.Evaluate.Symbol (Symbol(..))

bind ∷ ∀ container content . Pauseable container ⇒ container content → (content → container content) → container content
bind = flip wait

-- | Lazy Symbolic evaluation
lazySymbolic ∷ ∀ container reference source provided .
  Eq reference ⇒ Eq provided ⇒ Ord reference ⇒ Pauseable container ⇒
  Int → Ast (Symbol reference Int) source provided → container (Ast (Symbol reference Int) source provided)

lazySymbolic nextSymbol ast = result where
  term = ηConversion ast
  recursive = lazySymbolic nextSymbol
  result = case term of
    Application (Abstraction head body _ ) right _ → recursive |> reify head right body
    Application (Reference _ _) (Reference _ _) _ → end $ term
    Application left right@(Reference _ _) source → do
      left ← recursive |> left
      end $ Application left right source
    Application left right source → do
      left ← recursive |> left
      recursive |> Application left right source
    Abstraction head body source → do
      let liftedHead = case head of Symbol reference _ → Symbol reference nextSymbol
      let liftedBody = reify head (Reference liftedHead source) body
      computedBody ← lazySymbolic (nextSymbol + 1) |> liftedBody
      end $ Abstraction liftedHead computedBody source
    Reference _ _ → end $ term
    Provided _ _ → end $ term
  ηConversion (Abstraction head (Application body (Reference ref _) _) _ ) | (head == ref) && (head `notUsedIn` body) = body 
  ηConversion ast = ast
  notUsedIn head body = not (Set.member head $ collectFreeReferences { free: Set.empty, scope: Set.empty, term: body })
