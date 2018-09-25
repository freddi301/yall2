module Yall.External where

import Yall.Ast (Ast)
import Yall.Pauseable as Pauseable
import Yall.Evaluate as Evaluate
import Yall.Ast.Reference as Reference
import Prelude (id, (>>>))

evaluateEager :: Ast String String → Ast String String
evaluateEager = Evaluate.eager >>> Pauseable.runIntermediate id

evaluateLazy :: Ast String String → Ast String String
evaluateLazy = Evaluate.lazy >>> Pauseable.runIntermediate id

evaluateSymbolic :: Ast String String → Ast String String
evaluateSymbolic = lift >>> symbolic >>> (Pauseable.runIntermediate id) >>> unlift where
  lift = Reference.map (\name → (Evaluate.Symbol name 0))
  symbolic = Evaluate.symbolic 0
  unlift = Reference.map (\ref → case ref of (Evaluate.Symbol name _) → name)