module Yall.Ast.Reference where

import Yall.Ast

map ∷ ∀ a b d. (a → b) → Ast a d → Ast b d
map f (Reference name d) = Reference (f name) d
map f (Application left right d) = Application (map f left) (map f right) d
map f (Abstraction head body d) = Abstraction (f head) (map f body) d