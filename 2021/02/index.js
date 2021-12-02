#!/usr/bin/env node
const fs = require("fs");


fs.readdirSync("input").forEach(file => {
  console.log(file);
  const loc = { forward:0, depth:0 };
  const loc2 = { forward:0, depth:0, aim:0 };
  const input = fs.readFileSync(`input/${file}`, "utf8").split("\n")

  input.forEach(line => {
    if (line !=="") {
      const s = line.split(" ")
      const x = s[0]
      const y = s[1]
      if (file == "test") {
        console.log(x, y)
      }
      switch(x) {
        case "forward":
          loc.forward += +y
          loc2.forward += +y
          loc2.depth += loc2.aim * +y
          break;
        case "up":
          loc.depth -= +y
          loc2.aim -= +y
          break;
        case "down":
          loc.depth += +y
          loc2.aim += +y
          break;
        default:
          break;
      }
    }
  });
  console.log(loc, loc.forward * loc.depth)
  console.log(loc2, loc2.forward * loc2.depth)
});
