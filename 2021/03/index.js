#!/usr/bin/env node
const fs = require("fs");


fs.readdirSync("input").forEach(file => {
  console.log(file);
  const input = fs.readFileSync(`input/${file}`, "utf8").split("\n")
  const acc = [];
  const len = input[0].length;

  let ox = [...input]
  let co = [...input]

  input.forEach((line,j) => {
    if (line !=="") {
      line.split("").forEach((x,i) => {
        if (x == "1")
          acc[i] = acc[i]?acc[i]+1:1;
      })
      if (file == "test") {
        console.log(line)
      }
    }
  });
  const gamma = acc.map(x => x > input.length/2 ? 1 : 0)
  const epsilon = acc.map(x => x < input.length/2 ? 1 : 0)
  console.log(parse(gamma) * parse(epsilon))
  for(let i = 0; i < len; i++){
    const lenn = ox?ox.length:0;
    num = ox.reduce((acc, x) => acc + (x[i]?+x[i]:0), 0)
    bit = num >= (lenn/2)
    ox = ox.filter(x =>
      x[i] == bit
    )
    if (file == "test") {
      console.log(lenn,num, bit)
      console.log(ox)
    }
    if (ox.length == 1)
      break;
  }

  for(let i = 0; i < len; i++){
    const lenn = co?co.length:0;
    num = co.reduce((acc, x) => acc + (x[i]?+x[i]:0), 0)
    bit = num < (lenn/2)
    co = co.filter(x =>
      x[i] == bit
    )
    if (file == "test") {
      console.log(lenn,num, bit)
      console.log(co)
    }
    if (co.length == 1)
      break;
  }
  console.log(sparse(ox[0]) * sparse(co[0]))
});

function sparse(arr) {
  return parse(arr.split(''))
}

function parse(arr) {
  return parseInt(arr.join(""), 2)
}
