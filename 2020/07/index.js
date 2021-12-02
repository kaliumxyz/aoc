#!/usr/bin/env node
fs = require("fs");

const input = fs.readFileSync(process.argv[2] || "input", "utf8").split("\n")

const bags = [];
input.forEach((x, i) => {
    if (x) {
        const tuple = x.split("s contain ");
        const contains = tuple[1].split(",").filter(x => x !== "no other bags.").map(x => x.replace(/s\.$/g, "").replace(/\.$/g,"").replace(/s$/g,""));
        bags[i] = {bag: tuple[0], contain: contains};
        // bags[i] = {bag: tuple[0], contain: tuple[1]};
    }
});

const baggu = [];

function get(bag, data, i = 1, mul = 1) {
    let cur = i;
    let root = data.find(x => bag.search(x.bag) >= 0)
    if (!root) {
        console.log("fuck", bag, i, `"${bag.replace(/[0-9]+ /g, "")}"`)
        return 0
    }
    root.contain.forEach(x => {
        let amount = 0;
        if (x.match(/[0-9]+/)) {
            amount = +x.match(/[0-9]+/)[0];
        }
        if (amount > 0) {
            i += get(x, data, cur, amount)
        } else {
            i += get(x, data, cur)
        }
    })
    console.log(root, i);
    return i * mul;
    // let bags = data.filter(x => x.contain.search(bag) >= 0)
    // console.log(bag, bags.length, i)
    // if (bags.length > 0) {
    //     bags.forEach(x => {
    //         baggu[x.bag] = true;
    //         get(x.bag, data, ++i)
    //     })
    // }
    // return i;
}

console.log(get("shiny gold bag", bags) - 1, Object.keys(baggu).length)
