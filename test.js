#!/usr/bin/env node

import { fork } from 'child_process'

const test = input => {
  const child = fork('./index.js', input, { stdio: ['ignore', 'ignore', 'ignore', 'ipc'] })

  const status = msg => {
    const output = `test: "${input.join(' ')}" \x1b[1m${msg}\x1b[0m\n`
    console.log(output)
    return output
  }

  child.on('exit', code => {
    if (code === 0) return status('ok')
    return status('not ok')
  })
}

console.log('running tests\n')
test([5, 8, '+'])
test([5, 5, 5, 8, '+', '+', '-', 13, '+'])
test([-3, -2, '*', 5, '+'])
test([5, 9, 1, '-', '/'])
