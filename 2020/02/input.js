#!/usr/bin/env node
fs = require("fs");

const input = fs.readFileSync("./input", "utf8").split("\n")

let i = 0
let y = 0
input.forEach(x => {
  if (x) {
    let rule = x.split(': ')
    let pass = rule[1]
    rule = rule[0].split('-')
    let cha = rule[1].split(' ')[1]
    let max = rule[1].split(' ')[0]
    let min = rule[0]
    let acc = ""
    for (let x=0; x<pass.length; x++) {
      if (pass[x] == cha) {
        acc += cha;
      }
    }
    if (acc.length >= +min && acc.length <= +max) {
      i++
    }
    if (pass[min-1] == cha || pass[max-1] == cha){
      if (!(pass[min-1] == cha && pass[max-1] == cha)) {
      y++
      console.log(cha ,min-1, max-1, pass)
      }
    }
  }
})


// console.log(i)
console.log(y)
// console.log(input, i)
function addx (cha, y) {
  let a = ""
    for (let x=0; x<y; x++) {
      a += cha;
    }
  return a;
}
