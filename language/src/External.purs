module Yall.External where

import Yall.Ast (Ast)
import Yall.Pauseable as Pauseable
import Yall.Evaluate.Eager as Eager
import Yall.Evaluate.Lazy as Lazy
import Yall.Evaluate.Symbolic as Symbolic
import Yall.Ast.Reference as Reference
import Prelude (id, (>>>))

evaluateEager :: Ast String String → Ast String String
evaluateEager = Eager.eager >>> Pauseable.runIntermediate id

evaluateLazy :: Ast String String → Ast String String
evaluateLazy = Lazy.lazy >>> Pauseable.runIntermediate id

evaluateSymbolic :: Ast String String → Ast String String
evaluateSymbolic = lift >>> symbolic >>> (Pauseable.runIntermediate id) >>> unlift where
  lift = Reference.map (\name → (Symbolic.Symbol name 0))
  symbolic = Symbolic.symbolic 0
  unlift = Reference.map (\ref → case ref of (Symbolic.Symbol name _) → name)