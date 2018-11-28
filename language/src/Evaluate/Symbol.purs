module Yall.Evaluate.Symbol where

import Prelude (class Eq, class Ord, class Show, (<>), show)

data Symbol reference variation = Symbol reference variation
derive instance eqSymbol ∷ (Eq reference, Eq variation) ⇒ Eq (Symbol reference variation)
derive instance ordSymbol ∷ (Ord reference, Ord variation) ⇒ Ord (Symbol reference variation)

instance showSymbol :: (Show reference, Show variation) ⇒ Show (Symbol reference variation) where
  show (Symbol reference variation) = (show reference) <> "├" <> show variation
