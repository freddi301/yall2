module Yall.Ast.Source where

import Yall.Ast

map ∷ ∀ identifier a b provided . (a → b) → Ast identifier a provided → Ast identifier b provided
map f (Reference name source) = Reference name (f source)
map f (Application left right source) = Application (map f left) (map f right) (f source)
map f (Abstraction head body source) = Abstraction head (map f body) (f source)
map f (Provided value source) = Provided value (f source)