module Yall.Pauseable where

import Prelude (class Eq, class Show, (<>), (==), show, ($), (&&), id, flip, (>>>), (>), (+))

class Pauseable container where
  recur ∷ ∀ content . (content → container content) → content → container content
  wait ∷ ∀ content . (content → container content) → container content →  container content
  end ∷ ∀ content . content → container content

infixr 0 recur as |>

data Intermediate result
  = End result
  | Wait result (result → Intermediate result)
  | Recur (result → Intermediate result) result
  | WaitRecur (result → Intermediate result) result (result → Intermediate result)

instance pauseableIntermediate ∷ Pauseable Intermediate where
  wait next (WaitRecur task result after) = WaitRecur task result $ after >>> wait next
  wait next (Recur task result) = WaitRecur task result next
  wait next (Wait result task) = Wait result $ task >>> wait next
  wait next (End result) = next result
  recur = Recur
  end = End

instance showIntermediate ∷ Show result ⇒ Show (Intermediate result) where
  show (End result) = show "End " <> show result
  show (Wait result _) = show "Wait " <> show result
  show (Recur _ result) = show "Recur " <> show result
  show (WaitRecur _ result _ ) = show "WaitRecur " <> show result

instance eqIntermediate ∷ Eq result ⇒ Eq (Intermediate result) where
  eq (End a) (End b) = a == b
  -- eq a@(Wait ar at) b@(Wait br bt) = (ar == br) && ((runIntermediate id a) == (runIntermediate id b))
  eq _ _ = false

getResult ∷ ∀ result . Intermediate result → result
getResult (End result) = result
getResult (Wait result _) = result
getResult (Recur _ result) = result
getResult (WaitRecur _ result _) = result

next ∷ ∀ result . Intermediate result → Intermediate result
next (End result) = (End result)
next (Wait result task) = task result
next (Recur task result) = task result
next (WaitRecur task result after) = wait after (task result)

nextWith ∷ ∀ result . result → Intermediate result → Intermediate result
nextWith replacement (End result) = (End replacement)
nextWith replacement (Wait result task) = task replacement
nextWith replacement (Recur task result) = task replacement
nextWith replacement (WaitRecur task result after) = wait after (task replacement)

nextNoRecur ∷ ∀ result . Intermediate result → Intermediate result
nextNoRecur (End result) = (End result)
nextNoRecur (Wait result task) = task result
nextNoRecur (Recur task result) = (End result)
nextNoRecur (WaitRecur task result after) = after result

runIntermediate ∷ ∀ result . (result → result) → Intermediate result → result
runIntermediate enhancer (End result) = enhancer result
runIntermediate enhancer (Wait result next) = runIntermediate enhancer $ next (enhancer result)
runIntermediate enhancer (Recur next result) = runIntermediate enhancer $ next (enhancer result)
runIntermediate enhancer (WaitRecur next result after) = runIntermediate enhancer $ wait after $ next (enhancer result)

runIntermediateSkippingRecur ∷ ∀ result . Intermediate result → result
runIntermediateSkippingRecur = run where
  run (End result) = result
  run (Wait result next) = run $ next result
  run (Recur next result) = result
  run (WaitRecur next result after) = run $ after result

