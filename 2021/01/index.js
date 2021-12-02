#!/usr/bin/env node
fs = require("fs");


fs.readdirSync("input").forEach(file => {
  console.log(file);
  const input = fs.readFileSync(`input/${file}`, "utf8").split("\n")

  let inca = 0;
  let incb = 0;

  input.forEach((x,i) => {
    if(x - input[i-1] > 0) {
      inca++
    }

    if(i < (input.length - 3)) {
      const a = +x + +input[i+1] + +input[i+2]
      const b = +input[i+1] + +input[i+2] + +input[i+3]
      if (file == "test") {
        console.log(a,b)
      }
      if (a - b < 0) {
        incb++
      }
    }
  })

  console.log('part 1:', inca)
  console.log('part 2:', incb)
});
