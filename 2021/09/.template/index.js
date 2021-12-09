#!/usr/bin/env node
const fs = require("fs");


fs.readdirSync("input").forEach(file => {
  l(file);
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
  input.forEach((line,j) => {
  });
}
