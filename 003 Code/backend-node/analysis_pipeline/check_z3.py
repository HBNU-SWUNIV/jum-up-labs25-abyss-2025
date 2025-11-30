import sys
import re
from z3 import *

def extract_variables(expr):
    # 알파벳 변수명만 뽑아냄 (숫자, 예약어 제외)
    return sorted(set(re.findall(r'\b[a-zA-Z_]\w*\b', expr)) - {"and", "or", "not", "if", "else", "while", "True", "False"})

def check_from_condition(expr_str):
    try:
        # 변수 추출 후 Z3 선언
        vars_in_expr = extract_variables(expr_str)
        context = {}
        for var in vars_in_expr:
            context[var] = Int(var)

        solver = Solver()
        solver.add(eval(expr_str, {}, context))

        if solver.check() == sat:
            print("terminates")
        else:
            print("may_infinite")
    except Exception as e:
        print("error")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("error")
    else:
        condition = sys.argv[1]
        check_from_condition(condition)
