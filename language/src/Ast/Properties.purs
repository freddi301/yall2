module Yall.Ast.Properties where

import Yall.Ast (Ast)
import Yall.Ast.Source as AstSource
import Prelude (class Eq, const, unit, (==))

isAstEquivalent :: ∀ reference source . Eq reference ⇒
  Ast reference source → Ast reference source → Boolean
isAstEquivalent a b = (stripSource a) == (stripSource b) where
  stripSource = AstSource.map (const unit)