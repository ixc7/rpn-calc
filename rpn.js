#!/usr/bin/env node

import { createInterface } from 'readline'

const cursor = '| '
const divider = '------------------'
const operators = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
}
let verbose = false
const vlog = msg => verbose && console.log(msg)
const validNum = n => !isNaN(parseFloat(n)) && isFinite(n)
const xb = (msg, color = 1) => `\x1b[1m\x1b[38;5;${color}m${msg}\x1b[0m`
const cmdsTxt = `commands: ${xb('q', 49)}(uit), ${xb('r', 124)}(eset), ${xb('s', 66)}(tack), ${xb('v', 46)}(erbose), ${xb('h', 57)}(elp)`
const startTxt = `\n${xb(`${divider}\nrpn calc v0.0.3\n${divider}`, 128)}\n${cmdsTxt}\n`

const helpTxt = () => console.log(`
  \r${divider}
  \r${xb('REPL options', 15)}
  \r${divider}

  \r${xb('quit', 49)}: closes the repl
  \r${xb('reset', 124)}: removes all values currently in stack
  \r${xb('stack', 66)}: prints all values currently in stack
  \r${xb('verbose', 46)}: prints additional information for each evaluation 
  \r${xb('help', 57)}: prints this message
`)

const evaluate = (input, stack = [], silent = false) => {
  const initial = [...stack]
  const expr = input.split(' ').filter(i => i.length && i !== ' ')
  const len = expr.length

  const error = (msg = 'error', color = 124, lastResult = initial) => {
    console.log(`${cursor}${xb(msg, color)}`)
    return lastResult
  }

  vlog(xb(`\n${divider}\nargs: ${len}\n${divider}`, 4))

  for (let i = 0; i < len; i += 1) {
    const char = expr[i]
    const isNum = validNum(char)
    const isOpr = operators[char]

    if (!isNum && !isOpr) return error(xb(`Invalid syntax: ${char}`))

    vlog(`\n${xb(`[${i + 1}/${len}]`, 20)} char: ${xb(expr[i], 15)}, stack: ${xb(JSON.stringify(stack), 15)}`)

    if (isNum) {
      stack.push(parseFloat(char))
      vlog(`pushed ${xb(char, 33)}`)
    }

    else if (isOpr) {
      if (stack.length > 1) {
        // validate copy before modifying
        const localStack = [...stack]
        const b = localStack.pop()
        const a = localStack.pop()
        const calculated = operators[char](a, b)

        if (!validNum(calculated)) return error(`Illegal operation: ${a} ${char} ${b}`)
        vlog(`calculated ${a} ${char} ${b} = ${xb(calculated, 33)}`)

        localStack.push(calculated)
        stack = localStack
      }
      else if (stack.length === 1) {
        let msg = `cant use an operator on single number: ${xb(stack[0], 24)}`
        if (i > 0) msg += `\n${cursor}could not evaluate ${xb(len - i, 125)} out of ${xb(len, 125)} arguments passed`
        
        // return what was evaluated up to this block
        return error(msg, 7, stack)
      }
      else if (stack.length < 1) return error('Stack is empty')
    }
  }
  
  vlog(xb(`\n${divider}\nok\n${divider}\n`, 77))
  return stack
}

const repl = () => {
  let replStack = []

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: cursor
  })

  const keyMap = {
    'h': helpTxt,
    'r': () => {
      replStack = []
      console.log(`\x1Bc\x1b[3J\n${cursor}${xb('reset stack', 11)}\n${cursor}${cmdsTxt}`)
    },
    's': () => {
      if (!replStack.length) console.log(`${cursor}${xb('stack is empty', 125)}`)
      else console.log(`${cursor}${xb(replStack, 4)}`)
    },
    'v': () => {
      verbose = !verbose
      let color = 124
      if (verbose) color = 15
      console.log(`${cursor}verbose logging: ${xb(verbose, color)}`)
    },
    'q': () => process.exit(0)
  }

  rl.input.on('keypress', (char, props) => {
    if (keyMap[props.name]) {
      rl.clearLine(0)
      keyMap[props.name]()
      rl.prompt()
    }
  })

  rl.on('line', line => {
    if (line.length) {
      replStack = evaluate(line, replStack)
      console.log(`${cursor}${xb(replStack, 4)}`)
    }
    rl.prompt()
  })

  process.on('exit', () => console.log(xb('\nquit', 10)))
  console.log(startTxt)
  rl.prompt()
}

export { evaluate, repl, helpTxt }
