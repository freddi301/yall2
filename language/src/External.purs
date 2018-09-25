module Yall.External where

import Yall.Ast (Ast)
import Yall.Eager as Eager
import Yall.Lazy as Lazy

evaluateEager :: Ast String String → Ast String String
evaluateEager = Eager.evaluate

evaluateLazy :: Ast String String → Ast String String
evaluateLazy = Lazy.evaluate