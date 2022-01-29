#!/usr/bin/env node

import { createInterface } from 'readline'

//////////

let stack = []
let verbose = false

const cursor = '| '
const divider = '------------------'
const operators = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b
}

const validNum = n => !isNaN(parseFloat(n)) && isFinite(n)
const quit = (code = 0) => process.exit(code)
const vbos = msg => verbose && console.log(msg)
const xb = (msg, color = 1) => `\x1b[1m\x1b[38;5;${color}m${msg}\x1b[0m`
const error = (msg = 'error', color = 124) => console.log(xb(msg, color))
const cmdsTxt = `commands: ${xb('q', 49)}(uit), ${xb('r', 124)}(eset), ${xb('v', 46)}(erbose), ${xb('h', 57)}(elp)`
const startTxt = `\n${xb(`${divider}\nrpn calc v0.0.1\n${divider}`, 128)}\n${cmdsTxt}\n\n`

//////////

const evaluate = input => {
  const expr = input.split(' ').filter(i => i.length && i !== ' ')
  const len = expr.length
  
  vbos(xb(`\n${divider}\nargs: ${len}\n${divider}`, 4))

  for (let i = 0; i < len; i += 1) {
    vbos(`\n${xb(`[${i + 1}/${len}]`, 20)} char: ${xb(expr[i], 15)}, stack: ${xb(JSON.stringify(stack), 15)}`)
    
    const char = expr[i]
    const isNum = validNum(char)
    const isOpr = operators[char]

    if (!isNum && !isOpr) return error(`Invalid syntax: ${char}`)
    
    if (isNum) {
      stack.push(parseFloat(char))
      vbos(`pushed ${xb(char, 33)}`)
    }

    else if (isOpr) {
      if (stack.length > 1) {
        const localStack = [...stack] // validate with copy before changing stack
        const b = localStack.pop()
        const a = localStack.pop()

        const calculated = operators[char](a, b) 
        if (!validNum(calculated)) return error(`Illegal operation: ${a} ${char} ${b}`)
        
        localStack.push(calculated)
        stack = localStack
  
        vbos(`calculated ${a} ${char} ${b} = ${xb(calculated, 33)}`)
      }
      else if (stack.length === 1) {
        let msg = `\nStack has one item: ${xb(stack[0], 24)}`
        if (i > 0) msg += `\ncould not evaluate ${xb(len - i, 125)} out of ${xb(len, 125)} arguments passed`
        return error(msg, 7)
      }
      else if (stack.length < 1) return error('Stack is empty')
    }
  }

  vbos(xb(`\n${divider}\nok\n${divider}\n`, 77))
  return console.log(`${cursor}${xb(stack, 4)}`)
}

//////////

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: cursor
})

const keyMap = {
  'h': () => {
    console.log('help message')
  },
  'r': () => {
    stack = []
    console.log(`\x1Bc\x1b[3J\n${xb('reset stack', 11)}\n${cmdsTxt}\n`)
  },
  'v': () => {
    verbose = !verbose
    let color = 124
    if (verbose) color = 15
    console.log(`verbose: ${xb(verbose, color)}`)
  },
  'q': () => quit()
}

rl.input.on('keypress', (char, props) => {
  if (keyMap[props.name]) {
    rl.clearLine(0)
    keyMap[props.name](rl)
    rl.prompt()
  }
})

rl.on('line', line => {
  if (line.length) evaluate(line)
  rl.prompt()
})

process.on('exit', () => console.log(xb('\nquit', 10)))

//////////

console.log(startTxt)
rl.prompt()
