fs = require("fs");

function eoc (num, total = 0) {
    let res = Math.floor(num / 3) - 2;
    if (res > 0) {
        total += res;
        return eoc(res, total);
    } else {
        return total;
    }
}

input = fs.readFileSync("input", "utf8");
input = input.split('\n');
let total = 0;
for (i = 0; i < input.length; i++ ) {
    total = total + eoc(input[i]);
}
console.log(total);
