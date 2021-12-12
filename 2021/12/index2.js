#!/usr/bin/env node
const fs = require("fs");

let glob = []
let debug = false;
let example = `start,A,b,A,b,A,c,A,end
start,A,b,A,b,A,end
start,A,b,A,b,end
start,A,b,A,c,A,b,A,end
start,A,b,A,c,A,b,end
start,A,b,A,c,A,c,A,end
start,A,b,A,c,A,end
start,A,b,A,end
start,A,b,d,b,A,c,A,end
start,A,b,d,b,A,end
start,A,b,d,b,end
start,A,b,end
start,A,c,A,b,A,b,A,end
start,A,c,A,b,A,b,end
start,A,c,A,b,A,c,A,end
start,A,c,A,b,A,end
start,A,c,A,b,d,b,A,end
start,A,c,A,b,d,b,end
start,A,c,A,b,end
start,A,c,A,c,A,b,A,end
start,A,c,A,c,A,b,end
start,A,c,A,c,A,end
start,A,c,A,end
start,A,end
start,b,A,b,A,c,A,end
start,b,A,b,A,end
start,b,A,b,end
start,b,A,c,A,b,A,end
start,b,A,c,A,b,end
start,b,A,c,A,c,A,end
start,b,A,c,A,end
start,b,A,end
start,b,d,b,A,c,A,end
start,b,d,b,A,end
start,b,d,b,end
start,b,end`.split('\n')

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
  glob = []
  let map = {}
  let rev = {}
  l(file);
  // input.pop()
  // build
  input.forEach((line,j) => {
    if (line !== '') {
      if (debug)
      l(line)
      let rel = line.split('-')
      if (!map[rel[0]] && rel[0] != 'end') {
        map[rel[0]] = []
      }
      if (rel[1] != 'end')
      if (!map[rel[1]]) {
        map[rel[1]] = []
      }
      if (rel[1] != 'start' && rel[0] != 'end')
      map[rel[0]] = [rel[1], ...map[rel[0]]]
      if (rel[1] != 'end' && rel[0] != 'start')
      map[rel[1]] = [rel[0], ...map[rel[1]]]
    }
  });
  if (debug)
  l(map)
  let res = recurse('start',map)

  if (debug) {
    let comp = glob.map(x => x.join(','))
    let diff = example.filter(x => !comp.find(y => y == x))
    l(diff,diff.length)
    let diff2 = comp.filter(x => !example.find(y => y == x))
    l(diff2,diff2.length)
  }

  glob = glob.map(x => x.join(','))
  glob = [ ...new Set(glob) ];
  if (debug) {
    l(glob)
  }
  l(glob.length)
}

function recurse(node, graph, been = [], hero = 'unknown') {
  if (hero != node) {
    if (been.find(x => x == node) && node != node.toUpperCase()) {
      return
    }
  } else {
    hero = 'famous'
  }
  been.push(node)
  if (node == 'end') {
    glob.push(been)
    return
  }
  for (let i = 0; i < graph[node].length; i++) {
    recurse(graph[node][i], graph, [...been], hero)
    if (node == node.toLowerCase() && hero == 'unknown')
      recurse(graph[node][i], graph, [...been], node)
    // l(res)
    // if (res)
    //   been.push(res)
  }
  // return been
}
