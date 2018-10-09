module Yall.External where

import Data.Map as Map
import Data.Maybe as Maybe
import Data.Set as Set
import Prelude (id, (>>>), ($), (<>))
import Yall.Ast (Ast(..))
import Yall.Ast.Reference as Reference
import Yall.Evaluate.Eager as Eager
import Yall.Evaluate.Lazy as Lazy
import Yall.Evaluate.Symbolic as Symbolic
import Yall.Infere as Infere
import Yall.Pauseable (Intermediate)
import Yall.Pauseable as Pauseable

evaluateEager :: Ast String (Array String) String → Ast String (Array String) String
evaluateEager = Eager.eager >>> Pauseable.runIntermediate id

evaluateLazy :: Ast String (Array String) String → Ast String (Array String) String
evaluateLazy = Lazy.lazy >>> Pauseable.runIntermediate id

evaluateSymbolic :: Ast String (Array String) String → Ast String (Array String) String
evaluateSymbolic = lift >>> symbolic >>> (Pauseable.runIntermediate id) >>> unlift where
  lift = Reference.map (\name → (Symbolic.Symbol name 0))
  symbolic = Symbolic.symbolic 0
  unlift = Reference.map (\ref → case ref of (Symbolic.Symbol name _) → name)

debugEager :: Ast String (Array String) String → Intermediate (Ast String (Array String) String)
debugEager = Eager.eager

debugLazy :: Ast String (Array String) String → Intermediate (Ast String (Array String) String)
debugLazy = Lazy.lazy

getType :: Ast String (Array String) String → Array String → String
getType ast source = typeRepresentation where
  inferred = Infere.infereWithFreeReferences { ast, nextType: 1, typScope: Map.empty, constraints: Map.empty, typSource: Map.empty }
  unified = Infere.unify inferred
  sourceTyp = Maybe.fromMaybe 0 $ Map.lookup source unified.typSource
  typeRepresentation = Infere.showType unified.constraints Set.empty sourceTyp

transpileToJavascript :: Ast String (Array String) String → String
transpileToJavascript (Reference identifier _) = "_" <> identifier
transpileToJavascript (Application left right _) = "(" <> (transpileToJavascript left) <> ")" <> "(" <> (transpileToJavascript right) <> ")"
transpileToJavascript (Abstraction head body _) = "_" <> head <> " => " <> (transpileToJavascript body)
transpileToJavascript (Provided value _) = "\"" <> value <> "\""