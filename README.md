## RPN Calculator CLI

A Reverse Polish Notation/Postfix calculator for the command line.

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
rpn "2 2 +"
rpn "100 5 / 2 +"
rpn "8 9 \* - 2" (escape '*' symbols if running from command line.)
rpn "1 2 + 3 + 4 + 5 +"
```
