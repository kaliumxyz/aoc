#!/usr/bin/env node
const fs = require("fs");


fs.readdirSync("input").forEach(file => {
  const input = fs.readFileSync(`input/${file}`, "utf8").split("\n")
  if (file == 'test')
    main(input, file)
});

function sparse(arr) {
  return parse(arr.split(''))
}

function l(...msg) {
  console.log(...msg)
}

function parse(arr) {
  return parseInt(arr.join(""), 2)
}

function main(input, file) {
  l(file);
  input.pop()
  let acc = 0
  input.forEach((line,j) => {
    const seg = line.split('| ')[1]
    seg.split(' ').forEach(x => {
      switch(x.length) {
        case 2:
        case 3:
        case 7:
        case 4:
          acc += 1
          break;
      }
    })
  });
  console.log(acc)
}
