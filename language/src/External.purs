module Yall.External where

import Prelude (id, (>>>), ($))
import Data.Maybe as Maybe
import Data.Map as Map
import Data.Set as Set
import Yall.Ast (Ast)
import Yall.Ast.Reference as Reference
import Yall.Evaluate.Eager as Eager
import Yall.Evaluate.Lazy as Lazy
import Yall.Evaluate.Symbolic as Symbolic
import Yall.Infere as Infere
import Yall.Pauseable (Intermediate)
import Yall.Pauseable as Pauseable

evaluateEager :: Ast String (Array String) → Ast String (Array String)
evaluateEager = Eager.eager >>> Pauseable.runIntermediate id

evaluateLazy :: Ast String (Array String) → Ast String (Array String)
evaluateLazy = Lazy.lazy >>> Pauseable.runIntermediate id

evaluateSymbolic :: Ast String (Array String) → Ast String (Array String)
evaluateSymbolic = lift >>> symbolic >>> (Pauseable.runIntermediate id) >>> unlift where
  lift = Reference.map (\name → (Symbolic.Symbol name 0))
  symbolic = Symbolic.symbolic 0
  unlift = Reference.map (\ref → case ref of (Symbolic.Symbol name _) → name)

debugEager :: Ast String (Array String) → Intermediate (Ast String (Array String))
debugEager = Eager.eager

debugLazy :: Ast String (Array String) → Intermediate (Ast String (Array String))
debugLazy = Lazy.lazy

getType :: Ast String (Array String) → Array String → String
getType ast source = typeRepresentation where
  result = Infere.infereWithFreeReferences { ast, nextType: 1, typScope: Map.empty, constraints: Map.empty, typSource: Map.empty }
  sourceTyp = Maybe.fromMaybe 0 $ Map.lookup source result.typSource
  typeRepresentation = Infere.showType result.constraints Set.empty sourceTyp