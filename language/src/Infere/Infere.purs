module Yall.Infere where

import Data.Maybe

import Data.Array as Array
import Data.Foldable as Foldable
import Data.Map as Map
import Data.Maybe as Maybe
import Data.Ord as Ord
import Data.Set as Set
import Prelude (class Eq, class Show, show, ($), (+), (<>), (<$>), class Ord)
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
derive instance ordContraint :: Ord Constraint

type Constraints = Map.Map Int (Set.Set Constraint)

addConstraint ∷ Int → Constraint → Constraints → Constraints
addConstraint typ constraint constraints =
  case Map.lookup typ constraints of
    Nothing → Map.insert typ (Set.singleton constraint) constraints
    Just cons → Map.insert typ (Set.insert constraint cons) constraints


unify :: ∀ reference source provided . Ord.Ord reference ⇒ Ord.Ord source ⇒
  { typ ∷ Int, nextType ∷ Int, constraints ∷ Constraints, ast ∷ Ast reference source provided, typSource ∷ Map.Map source Int } →
  { typ ∷ Int, nextType ∷ Int, constraints ∷ Constraints, ast ∷ Ast reference source provided, typSource ∷ Map.Map source Int }
unify { typ, nextType, constraints, ast, typSource } = { ast, typ: unaliasedTyp, nextType: newNextType, constraints: unifiedConstraints, typSource: unaliasedTypSource } where
  { aliases, nextType: newNextType@_ } = Foldable.foldl aliasify { nextType, aliases: Map.empty } constraints where
    aliasForHead aliases = findAlias (\ (IsAbstraction head _) → head) (nextType + 1) aliases
    aliasForBody aliases = findAlias (\ (IsAbstraction _ body) → body) (nextType + 2) aliases
    findAlias for default aliases cons = Foldable.foldl (\m i -> i) default (Set.intersection (Set.fromFoldable $ Set.map for cons) (Set.fromFoldable $ Map.keys aliases))  
    aliasify { nextType, aliases } cons = { nextType, aliases: newAliases.aliases } where
      newAliases = Foldable.foldl collect { nextType, aliases } cons where
        collect { nextType, aliases } (IsAbstraction head body) = { nextType: nextType + 3, aliases: aliasesWithBody } where
          headAlias = aliasForHead aliases cons
          aliasesWithHead =  Map.insert head headAlias aliases
          bodyAlias = aliasForBody aliasesWithHead cons
          aliasesWithBody = Map.insert body bodyAlias aliasesWithHead
  unaliasedTyp = Maybe.fromMaybe typ (Map.lookup typ aliases)
  unifiedConstraints = Foldable.foldl dealiasify Map.empty (Map.keys constraints) where
    dealiasify unifiedConstraints typ = case Map.lookup typ constraints of
      Maybe.Nothing → unifiedConstraints
      Maybe.Just cons → Map.insert unaliasedType (unaliasedCons cons) unifiedConstraints where
        unaliasedType = Maybe.fromMaybe typ (Map.lookup typ aliases)
        unaliasedCons cons = Foldable.foldl unaliasCons Set.empty cons where
          unaliasCons memo (IsAbstraction head body) = Set.insert (IsAbstraction unaliasedHead unaliasedBody) memo where
            unaliasedHead = Maybe.fromMaybe head (Map.lookup head aliases)
            unaliasedBody = Maybe.fromMaybe body (Map.lookup body aliases)
  unaliasedTypSource = (\ typ → Maybe.fromMaybe typ (Map.lookup typ aliases)) <$> typSource

showType ∷ Constraints → Set.Set Int → Int → String
showType constraints recursives typ = match $ Map.lookup typ constraints where
  match (Nothing) = show typ
  match (Just list) = " [ " <> Foldable.foldl (\ m i → i <> " ; " <> m ) " ] " (showIt <$> (Array.fromFoldable list))
  showIt (IsAbstraction head body) = show typ <> "*(" <> headString <> " → " <> bodyString <> ")" where
    newRecursives = Set.insert head recursives
    headString = if Set.member typ recursives then show head else showType constraints newRecursives head
    bodyString = if Set.member typ recursives then show body else showType constraints newRecursives body
