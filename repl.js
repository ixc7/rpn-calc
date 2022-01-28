#!/usr/bin/env node

const { createInterface } = require('readline')

let stack = []

const quit = (code = 0) => process.exit(code)
const validNum = n => !isNaN(parseFloat(n)) && isFinite(n)
const operators = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b
}

const cursor = '| '
const divider = '------------------'
const x1b = (msg, color = 1) => `\x1b[1m\x1b[38;5;${color}m${msg}\x1b[0m`
const commandsMsg = `commands: ${x1b('q', 49)}(uit), ${x1b('r', 124)}(eset), ${x1b('c', 46)}(lear), ${x1b('h', 57)}(elp)`
const initMsg = `\n${divider}\n${x1b('rpn calc v0.0.1', 128)}\n${divider}\n${commandsMsg}\n\n`

const error = (msg = 'error') => console.log(x1b(msg))

const evaluate = input => {
  const expr = input.split(' ').filter(i => i.length && i !== ' ')
  const len = expr.length

  for (let i = 0; i < len; i += 1) {
    const char = expr[i]
    const isNum = validNum(char)
    const isOpr = operators[char]

    if (!isNum && !isOpr) return error(`Invalid syntax: ${char}`)
    if (isNum) stack.push(parseFloat(char))

    else if (isOpr) {
      if (stack.length > 1) {
        const localStack = [...stack]
        const b = localStack.pop()
        const a = localStack.pop()
        const calculated = operators[char](a, b)
        if (!validNum(calculated)) return error(`Illegal operation: ${a} ${char} ${b}`)
        
        localStack.push(calculated)
        stack = localStack  
      }
      else if (stack.length === 1) {
        let msg = `${x1b('Stack has one item:', 8)} ${x1b(stack[0], 6)}`
        if (i > 0) msg += `\ncould not evaluate ${x1b(len - i, 6)} out of ${x1b(len, 6)} arguments passed`
        return error(msg)
      }
      else if (stack.length < 1) return error(x1b('Stack is empty', 8))
    }
  }

  return console.log(`${cursor}${x1b(stack, 4)}`)
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: cursor
})

const keyMap = {
  'c': iface => {
    console.log('\x1Bc\x1b[3J')
    iface.clearLine(0)
    console.log(`\n${x1b('cleared screen', 11)}\n${commandsMsg}\n`)
    iface.prompt()
  },
  'h': () => console.log('help'),
  'q': () => quit(),
  'r': iface => {
    stack = []
    iface.clearLine(0)
    console.log(`\n${x1b('reset stack', 11)}\n${commandsMsg}\n`)
    iface.prompt()
  }
}

rl.input.on('keypress', (char, props) => {
  if (keyMap[props.name]) keyMap[props.name](rl)
})

rl.on('line', line => {
  if (line.length) evaluate(line)
  rl.prompt()
})

process.on('exit', () => {
  // rl.close()
  console.log(x1b('\nquit', 10))
})

console.log(initMsg)
rl.prompt()
