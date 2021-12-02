#!/usr/bin/env node
fs = require("fs");

const input = fs.readFileSync("./input", "utf8").split("\n")

const tuplet = {x:0, y: 0};
input.forEach(x => {
  const y = input.find(y => (+x + +y) == 2020);
  if (y) {
    tuplet.x = x
    tuplet.y = y
  }
})

console.log(input, tuplet)
console.log(tuplet.x * tuplet.y)

const triplet = {x:0, y: 0, z:0};
input.forEach(x => {
  input.forEach(y => {
    input.forEach(z => {
      if ((+x + +y + +z) == 2020) {
        console.log(x,y,z)
        console.log(x*y*z)
      }
    })
  })
})

console.log(triplet)
console.log(triplet.x * triplet.y * triplet.z)
