#!/usr/bin/env node

const { createInterface } = require('readline')

let stack = []
let lastResult = false

const cursor = '| '
const operators = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b
}

const x1b = (msg, color = 1) => `\x1b[1m\x1b[38;5;${color}m${msg}\x1b[0m`
const quit = (code = 0) => process.exit(code)
const isNum = n => !isNaN(parseFloat(n)) && isFinite(n)

const error = msg => { 
  if (msg) console.log(x1b(msg))
  return false
}

const evaluate = input => {
  // TODO change
  const expr = input.trim().split(/[ ]+/)
  const len = expr.length

  for (let i = 0; i < len; i += 1) {
    const char = expr[i]
    const isNumber = isNum(char)
    const isOperator = operators[char]
    if (!isNumber && !isOperator) return error(`Invalid syntax: ${char}`)

    if (isNumber) stack.push(parseFloat(char))
    
    else if (isOperator) {
      if (stack.length > 1) {
        const localStack = [...stack]
        const b = localStack.pop()
        const a = localStack.pop()
        const calculated = operators[char](a, b)
        
        if (!isNum(calculated)) return error(`Illegal operation: ${a} ${char} ${b}`)
        stack = localStack
        stack.push(calculated)
      }
      else if (stack.length === 1) {
        console.log(`
          \r${x1b('stack has one element:', 8)} ${x1b(lastResult, 6)}
          \rspecs:
          \rincomplete count ${len - i}
          \rtotal len ${len}
          \rbroke at iteration ${i}
        `)
        
        if (!lastResult) return ''
        return lastResult
      }
      
      else if (stack.length < 1) {
        let msg = x1b('Stack is empty', 8)
        if (lastResult) msg += `${x1b(' last result:', 8)} ${x1b(lastResult, 6)}`
        console.log(msg)

        if (!lastResult) return ''
        return lastResult
      }
    }
  }

  return stack
}


//////////

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: cursor
})

rl.input.on('keypress', (char, props) => {
  if (props.name === 'q' && props.ctrl) {
    console.log()
    quit()
  }
})

rl.on('line', line => {
  if (line.length) {
    const result = evaluate(line)
    if (result) {
      lastResult = result
      console.log(`${cursor}${x1b(result, 4)}`)
    }
  }
  rl.prompt()
})

process.on('exit', () => {
  rl.close()
  console.log(x1b('GOODBYE'))
})

rl.prompt()
