module Yall.Ast.Properties where

import Data.Set as Set
import Prelude (class Eq, class Ord, const, unit, (==))
import Yall.Ast (Ast(..))
import Yall.Ast.Source as AstSource

isAstEquivalent :: ∀ reference source . Eq reference ⇒
  Ast reference source → Ast reference source → Boolean
isAstEquivalent a b = (stripSource a) == (stripSource b) where
  stripSource = AstSource.map (const unit)

collectFreeReferences :: ∀ reference source . Ord reference ⇒
  { free :: Set.Set reference, scope :: Set.Set reference, term :: Ast reference source } → Set.Set reference
collectFreeReferences { free, scope, term } = case term of
  Reference name _ → if Set.member name scope then free else Set.insert name free
  Application left right _ → Set.union (collectFreeReferences { free, scope, term: left }) (collectFreeReferences { free, scope, term: right })
  Abstraction head body _  → collectFreeReferences { free, scope: Set.insert head scope, term: body }