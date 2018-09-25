module Yall.Evaluate where

import Yall.Pauseable

import Yall.Ast (Ast(..))
import Yall.Reify (reify)
import Prelude (class Eq, class Ord, flip, not, ($), (&&), (+), (==))
import Data.Set as Set

bind ∷ ∀ container content . Pauseable container ⇒ container content → (content → container content) → container content
bind = flip wait

eager ∷ ∀ container reference source . Eq reference ⇒ Pauseable container ⇒
  Ast reference source → container (Ast reference source)
eager (Application (Abstraction head body _) right@(Abstraction _ _ _) _) =
  eager |> reify head right body
eager (Application left right source) = do
  left ← eager |> left
  right ← eager |> right
  eager |> Application left right source
eager term = end term

lazy ∷ ∀ container reference source . Eq reference ⇒ Pauseable container ⇒
  Ast reference source → container (Ast reference source)
lazy (Application (Abstraction head body _) right _) =
  lazy |> reify head right body
lazy (Application left right source) = do
  left ← lazy |> left
  lazy |> Application left right source
lazy term = end term

symbolic ∷ ∀ container reference source .
  Eq reference ⇒ Ord reference ⇒ Pauseable container ⇒
  Int → Ast (Symbol reference Int) source → container (Ast (Symbol reference Int) source)
symbolic nextSymbol ast = result where
  term = ηConversion ast
  recursive = symbolic nextSymbol
  result = case ηConversion ast of
    Application (Abstraction head body _ ) right@(Abstraction _ _ _ ) _ → recursive |> reify head right body
    Application (Abstraction head body _ ) right _ → recursive |> reify head right body
    Application (Reference _ _) (Reference _ _) _ → end $ term
    Application left right@(Reference _ _) source → do
      left ← recursive |> left
      end $ Application left right source
    Application left@(Reference _ _) right source → do
      right ← recursive |> right
      end $ Application left right source
    Application left right source → do
      left ← recursive |> left
      right ← recursive |> right
      recursive |> Application left right source
    Abstraction head body source → do
      let liftedHead = case head of Symbol reference _ → Symbol reference nextSymbol
      let liftedBody = reify head (Reference liftedHead source) body
      computedBody ← symbolic (nextSymbol + 1) |> liftedBody
      end $ Abstraction liftedHead computedBody source
    Reference _ _ → end $ term
  collectFreeReferences { free, scope, term } = case term of
    Reference name _ → if Set.member name scope then free else Set.insert name free
    Application left right _ → Set.union (collectFreeReferences { free, scope, term: left }) (collectFreeReferences { free, scope, term: right })
    Abstraction head body _  → collectFreeReferences { free, scope: Set.insert head scope, term: body }
  ηConversion (Abstraction head (Application body (Reference ref _) _) _ ) | (head == ref) && (head `notUsedIn` body) = body 
  ηConversion ast = ast
  notUsedIn head body = not (Set.member head $ collectFreeReferences { free: Set.empty, scope: Set.empty, term: body })

data Symbol reference variation = Symbol reference variation
derive instance eqSymbol ∷ (Eq reference, Eq variation) ⇒ Eq (Symbol reference variation)
derive instance ordSymbol ∷ (Ord reference, Ord variation) ⇒ Ord (Symbol reference variation)
