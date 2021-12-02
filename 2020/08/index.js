#!/usr/bin/env node
fs = require("fs");

const input = fs.readFileSync(process.argv[2] || "input", "utf8");
const code = input.split("\n");

// registers
let acc = 0; // accumulator
let i = 0; // instruction pointer
let past = [];
let counter = 0;
let mcounter = 0;
let mut = 0;
let saves = [];
saves.push({i, acc})
while (true) {
    if (past.find(x => x == i)) {
        console.log(i, "loop detected!", acc);
        counter++;
        if (counter > 1000) {
            i = saves[saves.length - 1].i
            acc = saves[saves.length - 1].acc
            counter = 0;
            while (true) {
                mut++;
                console.log("mut incremented",mut)
                if (code[mut].split(" ")[0] != "acc")
                    break;
            }
            mcounter++;
            if (mcounter > 1000000) {
                break; // end of program
            }
        }
    }
    if (!code[i]) {
        if (i+1 == code.length) {
            console.log(i, "correct end", acc);
        } else
            console.log(i, "incorrect end", acc);
        break; // end of program
    }
    const tuple = code[i].split(" "); // get the instruction arugment pair
    let op = tuple[0]; // operation
    const arg = tuple[1]; // argument
    if (i == mut) {
        if (op == "jmp") {
            op = "nop"
            if (!saves.find(x => x.i == mut)) {
                saves.push({i, acc})
                console.log(saves)
            }
            console.log("mut!")
        } else if (op == "nop") {
            op = "jmp"
            if (!saves.find(x => x.i == mut)) {
                saves.push({i, acc})
                console.log(saves)
            }
            console.log("mut!")
        }
    }
    console.log(i, tuple)
    switch(op) {
        case("jmp"): // relative jump
            past.push(i);
            i += +arg;
        break;
        case("acc"):
            acc += +arg;
        case("nop"):
        default:
        i++; // increment the instruction pointer
    }
}
console.log(saves)
