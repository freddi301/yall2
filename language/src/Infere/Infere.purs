module Yall.Infere where

import Data.Maybe

import Data.Array as Array
import Data.Foldable as Foldable
import Data.Map as Map
import Data.Ord as Ord
import Data.Set as Set
import Prelude (class Eq, class Show, show, ($), (+), (<>), (<$>))
import Yall.Ast (Ast(..))
import Yall.Ast.Properties as AstProperties

-- TODO: merge types (no duplicate constraint)

infere ∷ ∀ reference source provided . Ord.Ord reference ⇒ Ord.Ord source ⇒
  { ast ∷ Ast reference source provided, nextType ∷ Int, typScope ∷ Map.Map reference Int, constraints ∷ Constraints, typSource ∷ Map.Map source Int } →
  { typ ∷ Int, nextType ∷ Int, constraints ∷ Constraints, ast ∷ Ast reference source provided, typSource ∷ Map.Map source Int }

infere { ast: ast@(Reference name source), nextType, typScope, constraints, typSource } = case Map.lookup name typScope of
    Just typ → { typ, nextType, constraints, ast, typSource: Map.insert source typ typSource }
    Nothing → { typ: nextType, nextType: nextType + 1, constraints, ast, typSource: Map.insert source nextType typSource }

infere { ast: ast@(Abstraction head body source), nextType, typScope, constraints, typSource } = result where
    thisAbsType = nextType 
    thisAbsHeadType = nextType + 1 
    inferred = infere { ast: body, nextType: nextType + 2, typScope: Map.insert head thisAbsHeadType typScope, constraints, typSource } 
    newConstraints = addConstraint thisAbsType (IsAbstraction thisAbsHeadType inferred.typ) inferred.constraints 
    newTypSource = Map.insert source thisAbsType inferred.typSource 
    result = { typ: thisAbsType, nextType: inferred.nextType, constraints: newConstraints, ast: Abstraction head inferred.ast source, typSource: newTypSource }

infere { ast: ast@(Application left right source), nextType, typScope, constraints, typSource } = result where
  inferredRigth = infere { ast: right, nextType, typScope, constraints, typSource }
  leftBodyType = inferredRigth.nextType
  inferredLeft = infere { ast: left, nextType: inferredRigth.nextType + 1, typScope, constraints: inferredRigth.constraints, typSource: inferredRigth.typSource }
  newConstraints =  addConstraint inferredLeft.typ (IsAbstraction inferredRigth.typ leftBodyType) inferredLeft.constraints
  newTypSource = Map.insert source leftBodyType inferredLeft.typSource
  result = { typ: leftBodyType, nextType: inferredLeft.nextType, constraints: newConstraints, ast: Application inferredLeft.ast inferredRigth.ast source, typSource: newTypSource }

infere { ast: ast@(Provided value source), nextType, typScope, constraints, typSource } = result where
  result = { typ: nextType, nextType, constraints, ast, typSource }

infereWithFreeReferences :: ∀ reference source provided . Ord.Ord reference ⇒ Ord.Ord source ⇒
  { ast ∷ Ast reference source provided, nextType ∷ Int, typScope ∷ Map.Map reference Int, constraints ∷ Constraints, typSource ∷ Map.Map source Int } →
  { typ ∷ Int, nextType ∷ Int, constraints ∷ Constraints, ast ∷ Ast reference source provided, typSource ∷ Map.Map source Int }
infereWithFreeReferences { ast, nextType, typScope, constraints, typSource } = result where
  freeReferences = AstProperties.collectFreeReferences { free: Set.empty, scope: Set.empty, term: ast }
  newNextType = nextType + (Set.size freeReferences)
  newTypScope = (Foldable.foldl (\ { map, i } ref → { map: Map.insert ref i map, i : i + 1 }) { map: typScope, i: nextType} freeReferences).map
  result = infere { ast, nextType: newNextType, typScope: newTypScope, constraints, typSource }

data Constraint = IsAbstraction Int Int
instance showContraint ∷ Show Constraint where show (IsAbstraction head body) = show head <> " → " <> show body
derive instance eqConstraint ∷ Eq Constraint

type Constraints = Map.Map Int (Array Constraint)

addConstraint ∷ Int → Constraint → Constraints → Constraints
addConstraint typ constraint constraints =
  case Map.lookup typ constraints of
    Nothing → Map.insert typ (Array.singleton constraint) constraints
    Just cons → Map.insert typ (Array.cons constraint cons) constraints

showType ∷ Constraints → Set.Set Int → Int → String
showType constraints recursives typ = match $ Map.lookup typ constraints where
  match (Nothing) = show typ
  match (Just [cons]) = showIt cons
  match (Just list) = Array.foldl (\ m i → i <> " # " <> m ) "" (showIt <$> list)
  showIt (IsAbstraction head body) = "(" <> headString <> ") → " <> bodyString where -- show typ <> "*(" <> headString <> " → " <> bodyString <> ")" where
    newRecursives = Set.insert head recursives
    headString = if Set.member typ recursives then show head else showType constraints newRecursives head
    bodyString = if Set.member typ recursives then show body else showType constraints newRecursives body
