#!/usr/bin/env node
fs = require("fs");

let   debug = false;
const raw   = fs.readFileSync(process.argv[2] || "input", "utf8");
const input = raw
      .split("\n")
      .filter(x => x !== '')
      .map(x => +x);

const volt = Math.max(...input) + 3;

// we need to count this as well
input.push(volt);

if (debug) {
    console.log(input);
    console.log(volt);
}

let count = 0;

function get(set, current) {
    const canidates = set.filter(x => {
        const y = x - current;
        return y <= 3 && y > 0
    })

    // road.push({item: current, diff: current - last})
    // road.push(current)

    if (canidates.length === 0) {
        count++;
        return 0
        // return road
    } else {
        // get the lowest rated adaptor next
        const next = Math.min(...canidates);
        return canidates.filter(x => get(set, x))
    }
}

const result = get(input, 0);
console.log(count)
// console.log(result)

// console.log(input.length, result.length)
// console.log(one.length * three.length);
