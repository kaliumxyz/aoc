#!/usr/bin/env node
fs = require("fs");

const input = fs.readFileSync(process.argv[2] || "input", "utf8");
const numbers = input.split("\n");

let preamble = 25;

let num = 1309761972;

for (let i = preamble; i < numbers.length - 1; i++) {
    let inum = numbers[i];
    let flag = false;
    for (let j = i - preamble; j <= i; j++) {
        let jnum = numbers[j];
        for (let k = j+1; k <= i; k++) {
            let knum = numbers[k];
            if (+jnum + +knum == inum)
                flag = true;
        }
    }
    if (!flag) {
        num = inum;
        console.log(inum)
    }
}

        console.log(numbers.length)

for (let i = 0; i < numbers.length - 1; i++) {
    let inum = +numbers[i];
    let acc = 0;
    let flag = false;
    let pew = 0;
    for (let j = i; j <= numbers.length; j++) {
        let jnum = +numbers[j];
        acc += jnum;
        if (num - acc == 0) {
            flag = true;
            pew = j;
        }
        if (num - acc < 0) {
            break;
        }
    }
    if (flag) {
        let highest = 0;
        let lowest = 199999999999;
        for (let j = i; j <= pew; j++) {
            if (+numbers[j] > +highest)
                highest = +numbers[j]
            if (+numbers[j] < +lowest)
                lowest = +numbers[j]
        }
        console.log("result",highest, lowest)
        console.log("result", +highest + +lowest)
    }
}

// min 130080137
// max 178080586
