module Yall.Ast.Source where

import Yall.Ast

map ∷ ∀ identifier a b. (a → b) → Ast identifier a → Ast identifier b
map f (Reference name source) = Reference name (f source)
map f (Application left right source) = Application (map f left) (map f right) (f source)
map f (Abstraction head body source) = Abstraction head (map f body) (f source)