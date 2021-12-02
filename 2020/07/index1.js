#!/usr/bin/env node
fs = require("fs");

const input = fs.readFileSync(process.argv[2] || "input", "utf8").split("\n")

const root = []; // all of these are valid
const bags = [];
input.forEach((x, i) => {
    if (x) {
        const tuple = x.split("s contain ");
        // const contains = tuple[1].split(",").filter(x => x !== "no other bags.");
        // bags[i] = {bag: tuple[0], contain: contains};
        bags[i] = {bag: tuple[0], contain: tuple[1]};
        if (x.search("shiny gold bag") >= 0) {
            root.push({line: x, index: i});
        }
    }
});

const baggu = [];

function get(bag, data, i = 0) {
    let bags = data.filter(x => x.contain.search(bag) >= 0)
    console.log(bag, bags.length, i)
    if (bags.length > 0) {
        bags.forEach(x => {
            baggu[x.bag] = true;
            get(x.bag, data, ++i)
        })
    }
    return i;
}

const baggu2 = [];

function get2(bag, data, i = 0) {
    let bags = data.filter(x => x.contain.search(bag) >= 0)
    console.log(bag, bags.length, i)
    if (bags.length > 0) {
        bags.forEach(x => {
            baggu2[x.bag] = true;
            get(x.bag, data, ++i)
        })
    }
    return i;
}

console.log(get("shiny gold bag", bags), Object.keys(baggu).length)
