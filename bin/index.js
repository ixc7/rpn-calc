#! /usr/bin/env node

// TODO getopts
// --interactive, -i
// --help, -h
// --help-all, (w/ examples, manpage ?)

const _B = '\x1b[1m'
const B_ = '\x1b[0m'
const helpMsg = `
  \r${_B}RPN${B_}: evaluates postfix expressions
  \rusage: ${_B}RPN${B_} <expression>
`

function quit (msg = false) {
  msg && console.log(`error: ${_B}${msg}${B_}`)
  console.log(helpMsg)
  process.exit(0)
}

function reversePolish(expr = false) {
  const errorMsg = `invalid expression: ${_B}"${expr}"${B_}`  
  if (!Array.isArray(expr)) quit(errorMsg)
  
  const stack =[]
  for(let i = 0; i < expr.length; i += 1) {
    
    if (!isNaN(expr[i]) && isFinite(expr[i])) stack.push(expr[i])
    else {
      let res = false
      let a = stack.pop()
      let b = stack.pop()
      
      if(expr[i] === "+") res = (parseInt(a) + parseInt(b))
      else if(expr[i] === "-") res = (parseInt(b) - parseInt(a))
      else if(expr[i] === "*") res = (parseInt(a) * parseInt(b))
      else if(expr[i] === "/") res = (parseInt(b) / parseInt(a))
      else if(expr[i] === "^") res = (Math.pow(parseInt(b), parseInt(a)))

      if (!res) quit(errorMsg)
      stack.push(res)
    }
  }
  
  (stack.length > 1) && quit(errorMsg)
  
  // return stack[0]
  // TODO option to specify whether to return str, num, { str, num }
  return `result: ${_B}${stack[0]}${B_}`
}

!((process.argv.slice(2)).length) && quit(`input cannot be empty`)
console.log(reversePolish(process.argv.slice(2)))
