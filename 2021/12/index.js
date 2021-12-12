#!/usr/bin/env node
const fs = require("fs");

let glob = []
let debug = true;

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
  });
  if (debug)
  l(map)
  let res = recurse('start',map)
  if (debug)
  l(glob.map(x => x.join(',')))
  l(glob.length)
}

function recurse(node, graph, been = []) {
  if (been.find(x => x == node) && node != node.toUpperCase()) {
    return
  }
  been.push(node)
  if (node == 'end') {
    glob.push(been)
    return
  }
  for (let i = 0; i < graph[node].length; i++) {
    recurse(graph[node][i], graph, [...been])
    // l(res)
    // if (res)
    //   been.push(res)
  }
  // return been
}
