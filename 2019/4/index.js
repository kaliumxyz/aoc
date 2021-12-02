//153517-630395
let sum = [];
function main() {
    for (i = 153517; i < 630395; i++) {
        str = "" + i;
        reg = /11|22|33|44|55|66|77|88|99|00/g;
        reg2 = /11|22|33|44|55|66|77|88|99|00/g;
        match = str.match(reg);
        match2 = str.match(/111|222|333|444|555|666|777|888|999|000/g);
        match3 = str.match(/11111|22222|33333|44444|55555|66666|77777|88888|99999|00000/g);
        if (match2) {
            if (match.length > 1 && match2.length === 1)
            if (!match3 && str.replace(match2[0], "XXX").match(reg2)) {
                add(i);
            }
        } else {
            if (match) {
                add(i);
            }
        }
    }
    console.log(sum.length);
}

function add(num) {
    if (str[0] <= str[1] && str[1] <= str[2] && str[2] <= str[3] && str[3] <= str[4] && str[4] <= str[5]) {
        sum.push(i);
    }
}

main();
