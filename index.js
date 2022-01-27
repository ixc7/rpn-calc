#! /usr/bin/env node

// TODO getopts
// --interactive, -i
// --help, -h
// --help-all, (w/ examples? 'man RPN'?)
// (maybe) return array/closest result before hitting an error?
// (maybe) specify whether to return ...
//         str: formatted str
//         num: stack[0]
//         both: { str, num }

const _B = '\x1b[1m'
const B_ = '\x1b[0m'

const operators = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
  "^": (a, b) => Math.pow(b, a)
}

const helpMsg = `
  \r${_B}RPN${B_}: evaluates postfix expressions
  \rusage: ${_B}RPN${B_} <expression>
`

const quit = msg => {
  msg && console.log(`error: ${_B}${msg}${B_}`)
  console.log(helpMsg)
  process.exit(0)
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

      // TODO use .?.?.?.? whatever its called
      if (operators[current]) res = operators[current](a, b)

      !res && quit(errorMsg)
      stack.push(res)
    }
  }

  (stack.length > 1) && quit(errorMsg)
  return `result: ${_B}${stack[0]}${B_}`
  // || return the actual number if specified
}

!((process.argv.slice(2)).length) && quit(`input cannot be empty`)
console.log(calculate(process.argv.slice(2)))
