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

function get(set, current, road = [], last = NaN) {
    if (debug)
        console.log(set, current)
    const canidates = set.filter(x => {
        const y = x - current;
        return y <= 3 && y > 0
    })

    road.push({item: current, diff: current - last})

    if (canidates.length === 0) {
        if (debug)
            console.log("end!", road)
        return road
    } else {
        // get the lowest rated adaptor next
        const next = Math.min(...canidates);

        if (debug)
            console.log("branch!")

        return get(set, next, road, current)
    }
}

const result = get(input, 0);
const one    = result.filter(x => x.diff == 1);
const three  = result.filter(x => x.diff == 3);

console.log(input.length, result.length)
console.log(one.length * three.length);
