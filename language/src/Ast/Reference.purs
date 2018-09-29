module Yall.Ast.Reference where

import Yall.Ast

map ∷ ∀ a b source. (a → b) → Ast a source → Ast b source
map f (Reference name source) = Reference (f name) source
map f (Application left right source) = Application (map f left) (map f right) source
map f (Abstraction head body source) = Abstraction (f head) (map f body) source