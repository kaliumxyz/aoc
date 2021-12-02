#!/usr/bin/env node
fs = require("fs");

const input = fs.readFileSync("./input", "utf8").split("\n")

let inc = 0;

input.forEach((x,i) => {
  if(x - input[i-1] > 0) {
    inc++
  }
})

console.log('part 1:', inc)
