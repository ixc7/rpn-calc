#!/usr/bin/env node

// TODO getopts
// 
// invoked with ...
// (no args)              = repl
// rpn 4 4 +              = once
// echo "4 4 +" | rpn     = once
// 
// --help, -h
//   show this message and exit
// 
// --ignore-errors -i
//   return the array on error
// 
// --format -f
//   str =      'result: n'
//   num =           number
//   both =    { str, num }
// 
// --trace -t
//   show step-by-step what is being evaluated
//   ex: https://www.free-online-calculator-use.com/postfix-evaluator.html
//
// --examples -e
//   show examples

const _B = '\x1b[1m'
const B_ = '\x1b[0m'

const helpMsg = `
${_B}rpn${B_} - evaluates postfix expressions
usage: ${_B}rpn${B_} <exp>
`

const operators = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
  "^": (a, b) => Math.pow(b, a)
}

const quit = msg => {
  msg && console.log(`error: ${_B}${msg}${B_}`)
  console.log(helpMsg)
  process.exit(1)
}

const calculate = expr => {
  const errorMsg = `invalid expression: ${_B}"${expr}"${B_}`  
  const stack = []

  !Array.isArray(expr) && quit(errorMsg)

  for(let i = 0; i < expr.length; i += 1) { 
    const current = expr[i]   

    if (!isNaN(current) && isFinite(current)) stack.push(current)
    else {
      const a = parseInt(stack.pop())
      const b = parseInt(stack.pop())
      let res = false

      if (operators[current]) res = operators[current](a, b)
      !res && quit(errorMsg)

      stack.push(res)
    }
  }

  (stack.length > 1) && quit(errorMsg)
  return `result: ${_B}${stack[0]}${B_}`  
}

// TODO accept single string w/ args
!((process.argv.slice(2)).length) && quit(`input cannot be empty`)
console.log(calculate(process.argv.slice(2)))