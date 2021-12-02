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

function get(set, current = 0) {
    const canidates = set.filter(x => {
        const y = x - current;
        if(y <= 3 && y > 0) {
            get(set, x)
            return true;
        }
    })

    if (canidates.length === 0) {
        count++;
        return 0;
    }
}

const vis = [[0]]

function visualize(set, current = 0, i=0) {
    let lev = [];
    i++
    const canidates = set.filter(x => {
        const y = x - current;
        if(y >= -3 && y < 0) {
            // console.log(`${x}`)
            lev.push(x)
            visualize(set, x, i)
            return true;
        }
    })
    if (!lev.length) {
        lev.push("end")
    }
    if (vis[i])
        vis[i].push(lev)
    else
        vis[i] = [lev];

    if (canidates.length === 0) {
        count++;
        return 0;
    }
}

function arrange(set, current, road = [], last = NaN) {
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

        return arrange(set, next, road, current)
    }
}

// get the branches per node and multiply count by this
function solve(set) {
    for (let i = 0; i < set.length; i++) {
        const canidates = set.filter(x => {
            const y = x - set[i];
            return y <= 3 && y > 0;
        })

        // console.log(count)
        // console.log(set[i], canidates.length)

        if (canidates.length > 0){
            count *= canidates.length;
        }
        // console.log(count)
    }
}

const result = arrange(input, 0);
const one    = result.filter(x => x.diff == 1);
const two    = result.filter(x => x.diff == 2);
const three  = result.filter(x => x.diff == 3);

// console.log("total", input.length)
// console.log(one.length, two.length, three.length)
// console.log(result)


input.sort((x,y) => x - y);
// console.log(input)
// get(input, 0);
// console.log(count)

const n = Math.floor(input.length / 2);
count = 0;
for (let i = input.length; i > 0; i-= n) {
    let prior = count;
    count = 0;
    let sub = input.slice(i-n, i);
    console.log(sub)
    get(sub, input[i - n - 1]);
    if (prior > 0)
        count *= prior;
}
console.log(count)

// count = 1;
// solve(input)
// console.log(count)
// count = 0;
// visualize(input, volt)
// vis.forEach(x => console.log(...x))

// let endflag = false;
// for (let i = 0; i < vis.length; i++) {
//     let visu = "";
//     vis[i].forEach(x => {
//         if (x.length) {
//             let branches = x.length
//             x.forEach(
//                 (y, index) => {
//                     if (y == "end") {
//                         endflag = true;
//                         visu += "* "
//                     }
//                     else {
//                         if (branches === 1) {
//                             visu += "| "
//                             // if (endflag) {
//                             //     visu += "/"
//                             //     endflag = false;
//                             // } else {
//                             // }
//                         } else if (branches === 2) {
//                             if (index === 0) {
//                                 visu += "|"
//                             } else if (index === 1) {
//                                 visu += "\\ "
//                             }
//                         } else if (branches === 3) {
//                             if (index === 0) {
//                                 visu += "|"
//                             } else if (index === 1) {
//                                 visu += "\\ "
//                             } else if (index === 2) {
//                                 visu += "\\ "
//                             }
//                         }
//                     }
//                 }
//             )
//         }
//     })
//     console.log(visu)
// }
// console.log(count / pew)
