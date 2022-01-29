#!/usr/bin/env node

import { repl, evaluate, helpTxt } from './rpn.js'

const args = process.argv.slice(2)

if (!args.length) repl()
else {
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
      \rrpn-postfix-cli: evaluates postfix expressions

      \rusage:
      \r       \x1b[1mrpn\x1b[0m [expression]

      \roptions:
      \r       --help, -h: prints this message
      
      \rif no arguments are passed, opens an interactive repl in current shell `)
    helpTxt()
    process.exit(0)
  }

  const result = evaluate(args.join(' '))
  if (result.length === 1) console.log(`result: \x1b[1m${result[0].toString()}\x1b[0m`)
  else if (result.length) console.log(`results: \x1b[1m[${result.join(', ')}]\x1b[0m`)
  else console.log('for more information, run \x1b[1mrpn --help\x1b[0m')
}
