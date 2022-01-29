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

const helpMsg = `
  \r${_B}RPN${B_}: evaluates postfix expressions
  \rusage: ${_B}RPN${B_} <expression>
`

const quit = msg => {
  msg && console.log(`error: ${_B}${msg}${B_}`)
  console.log(helpMsg)
  process.exit(0)
}

const run = expr => {
  const errorMsg = `invalid expression: ${_B}"${expr}"${B_}`  
  const stack = []

  !Array.isArray(expr) && quit(errorMsg)

  for(let i = 0; i < expr.length; i += 1) {    
    if (!isNaN(expr[i]) && isFinite(expr[i])) stack.push(expr[i])
    else {
      let res = false
      let a = stack.pop()
      let b = stack.pop()

      // TODO make faster?      
      if(expr[i] === "+") res = (parseInt(a) + parseInt(b))
      else if(expr[i] === "-") res = (parseInt(b) - parseInt(a))
      else if(expr[i] === "*") res = (parseInt(a) * parseInt(b))
      else if(expr[i] === "/") res = (parseInt(b) / parseInt(a))
      else if(expr[i] === "^") res = (Math.pow(parseInt(b), parseInt(a)))

      !res && quit(errorMsg)
      stack.push(res)
    }
  }

  (stack.length > 1) && quit(errorMsg)
  return `result: ${_B}${stack[0]}${B_}`
}

!((process.argv.slice(2)).length) && quit(`input cannot be empty`)
console.log(run(process.argv.slice(2)))
