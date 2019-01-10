module Yall.External where

import Data.Map as Map
import Data.Maybe as Maybe
import Data.Set as Set
import Prelude (id, (>>>), ($), (<>), show)
import Yall.Ast (Ast(..))
import Yall.Ast.Reference as Reference
import Yall.Evaluate.Eager as Eager
import Yall.Evaluate.Lazy as Lazy
import Yall.Evaluate.LazySymbolic as LazySymbolic
import Yall.Evaluate.Symbol as Symbol
import Yall.Evaluate.Symbolic as Symbolic
import Yall.Infere as Infere
import Yall.Pauseable (Intermediate)
import Yall.Pauseable as Pauseable
import Yall.Reify as Reify

type Identifier = (Symbol.Symbol String Int)

evaluateEager :: Ast Identifier (Array String) String → Ast Identifier (Array String) String
evaluateEager = Eager.eager >>> Pauseable.runIntermediate id

evaluateLazy :: Ast Identifier (Array String) String → Ast Identifier (Array String) String
evaluateLazy = Lazy.lazy >>> Pauseable.runIntermediate id

evaluateSymbolic :: Ast Identifier (Array String) String → Ast Identifier (Array String) String
evaluateSymbolic = lift >>> symbolic >>> (Pauseable.runIntermediate id) >>> unlift where
  lift = Reference.map (\name → (Symbol.Symbol name 0))
  symbolic = Symbolic.symbolic 0
  unlift = Reference.map (\ref → case ref of (Symbol.Symbol name _) → name)

evaluateLazySymbolic :: Ast Identifier (Array String) String → Ast Identifier (Array String) String
evaluateLazySymbolic = lift >>> lazySymbolic >>> (Pauseable.runIntermediate id) >>> unlift where
  lift = Reference.map (\name → (Symbol.Symbol name 0))
  lazySymbolic = LazySymbolic.lazySymbolic 0
  unlift = Reference.map (\ref → case ref of (Symbol.Symbol name _) → name)

debugEager :: Ast Identifier (Array String) String → Intermediate (Ast Identifier (Array String) String)
debugEager = Eager.eager

debugLazy :: Ast Identifier (Array String) String → Intermediate (Ast Identifier (Array String) String)
debugLazy = Lazy.lazy

debugSymbolic :: Ast Identifier (Array String) String → Intermediate (Ast Identifier (Array String) String)
debugSymbolic = Symbolic.symbolic 0

debugLazySymbolic :: Ast Identifier (Array String) String → Intermediate (Ast Identifier (Array String) String)
debugLazySymbolic = LazySymbolic.lazySymbolic 0

next ∷ Intermediate (Ast Identifier (Array String) String) → Intermediate (Ast Identifier (Array String) String)
next = Pauseable.next

nextNoRecur ∷ Intermediate (Ast Identifier (Array String) String) → Intermediate (Ast Identifier (Array String) String)
nextNoRecur = Pauseable.nextNoRecur

getResult ∷ Intermediate (Ast Identifier (Array String) String) → (Ast Identifier (Array String) String)
getResult = Pauseable.getResult

nextWith ∷ ∀ result . result → Intermediate result → Intermediate result
nextWith = Pauseable.nextWith

reify ∷ Identifier → (Ast Identifier (Array String) String) → (Ast Identifier (Array String) String) → (Ast Identifier (Array String) String)
reify = Reify.reify

replace :: (Ast Identifier (Array String) String) → (Ast Identifier (Array String) String) → (Ast Identifier (Array String) String) → (Ast Identifier (Array String) String)
replace = Reify.replace

getType :: Ast Identifier (Array String) String → Array String → String
getType ast source = typeRepresentation where
  inferred = Infere.infereWithFreeReferences { ast, nextType: 1, typScope: Map.empty, constraints: Map.empty, typSource: Map.empty }
  unified = Infere.unify inferred
  sourceTyp = Maybe.fromMaybe 0 $ Map.lookup source unified.typSource
  typeRepresentation = Infere.showType unified.constraints Set.empty sourceTyp

transpileToJavascript :: Ast Identifier (Array String) String → String
transpileToJavascript (Reference identifier _) = "_" <> (show identifier)
transpileToJavascript (Application left right _) = "(" <> (transpileToJavascript left) <> ")" <> "(" <> (transpileToJavascript right) <> ")"
transpileToJavascript (Abstraction head body _) = "_" <> (show head) <> " => " <> (transpileToJavascript body)
transpileToJavascript (Provided value _) = "\"" <> value <> "\""