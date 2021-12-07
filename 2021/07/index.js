#!/usr/bin/env node
const fs = require("fs");


fs.readdirSync("input").forEach(file => {
  const input = fs.readFileSync(`input/${file}`, "utf8").split("\n")
  // if (file == 'test')
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
  input.forEach((line,j) => {
    const crab = line.split(',').map(x => +x)
    // l(crab.map((x, i, arr) => arr.reduce((acc, y)=> {
    //   return acc += Math.abs(y-x)
    // }, 0)).sort((x,y) => x - y))
    // l(crab.map((x, i, arr) => arr.reduce((acc, y)=> {
    //   return acc += fact(Math.abs(y-x))
    // }, 0)).sort((x,y) => x - y))
    const res = []
    for(let i = 0; i < Math.max(...crab); i++){
      res.push({i, o: crab.reduce((acc, y)=> {
        // console.log(fact(Math.abs(y-x)), x, y)
        return acc += fact(Math.abs(y-i))
      }, 0)})
    }
    l(crab.map((x, i, arr) => {
      return arr.reduce((acc, y)=> {
      // console.log(fact(Math.abs(y-x)), x, y)
      return acc += fact(Math.abs(y-x))
      }, 0)}))
    l(res.sort((x,y) => x.o - y.o).shift())
  });
  l(fact(1))
}

//16,1,2,0,4,2,7,1,2,14


function fact(n) {
  n+=1
  let res = 0;
  while(n--) {
    res += n
  }
  return res;
}
