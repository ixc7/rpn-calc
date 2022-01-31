## RPN Calculator CLI

A Reverse Polish Notation/Postfix calculator for the command line.

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)
[![rpn-postfix-cli](https://img.shields.io/npm/v/rpn-postfix-cli?style=flat-square)](https://www.npmjs.com/package/rpn-postfix-cli)

---

## Installation and Usage

```
npm i -g rpn-postfix-cli && rpn <expression>
```

or

```
npx rpn-postfix-cli <expression>
```

## Examples

```
rpn
rpn "8 9 * 2 /"
echo "4 4 4 5 + - *" | rpn
```

## Options

```
usage:
       rpn [expression]

options:
       --help, -h: prints this message
      
if no arguments are passed, opens an interactive repl in current shell 

------------------
REPL options
------------------

quit: closes the repl
reset: removes all values currently in stack
stack: prints all values currently in stack
verbose: prints additional information for each evaluation 
help: prints this message
```
