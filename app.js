#!/usr/bin/env node

import { repl, evaluate } from './index.js'

const args = process.argv.slice(2)

if (!args.length) repl()
else {
  const result = evaluate(args.join(' '))
  if (result.length === 1) console.log(`result: \x1b[1m${result[0].toString()}\x1b[0m`)
  else if (result.length) console.log(`results: \x1b[1m[${result.join(', ')}]\x1b[0m`)
}
