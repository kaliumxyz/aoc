#!/usr/bin/env node
const fs = require("fs");


fs.readdirSync("input").forEach(file => {
  console.log(file);
  const input = fs.readFileSync(`input/${file}`, "utf8").split("\n")
  const acc = [];
  let len = 0

  let ox = []
  let co = []

  let oxa = []
  let coa = []

  input.forEach((line,j) => {
    if (line !=="") {
      acc[j] = 0;
      line.split("").forEach((x,i) => {
        if (x == "1")
          acc[j] += 1;
      })
      if (file == "test") {
        console.log(line)
      }
      len = line.length;
    }
  });
  const gamma = acc.map(x => x > input.length/2 ? 1 : 0)
  const epsilon = acc.map(x => x < input.length/2 ? 1 : 0)
  console.log(parse(gamma) * parse(epsilon))
  //console.log(gamma, epsilon)
    input.forEach((line,j) => {
      oxa[j] = line;
      coa[j] = line;

      if (line !== "") {
        ox[j] = 0
        co[j] = 0
        line.split("").forEach((x,i) => {
      if (file == "test") {
          if (x == gamma[i]) {
            ox[j] += +1;
            oxa[j] = false;
          }
          if (x == epsilon[i]) {
            co[j] += +1;
            coa[j] = false;
          }
        }
      })
    }
  });
  const a = ox.indexOf(Math.max(...ox));
  const b = co.indexOf(Math.max(...co));

  console.log(coa, oxa)
  console.log(parseInt(input[a],2) * parseInt(input[b],2), a, b)
});

function parse(arr) {
  return parseInt(arr.join(""), 2)
}
