const fs = require("fs");
const readline = require('readline');
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
});

rl.on('close', () => {
    mkrl();
});

function mkrl () {
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '> '
    });

}
async function main() {
    input = fs.readFileSync("test", "utf8");
    input = input.split(',').map(x => +x);
    for (i = 0; i < input.length; i++ ) {
        let op = input[i];
        switch (op) {
        case 1:
            console.log('1');
            val0 = input[++i];
            val1 = input[++i];
            pos = input[++i];
            input[pos] = input[val0] + input[val1];
            break;
        case 2:
            console.log('2');
            val0 = input[++i];
            val1 = input[++i];
            pos = input[++i];
            input[pos] = input[val0] * input[val1];
            break;
        case 3:
            console.log('3');
            rl.prompt();
            for await (const line of rl) {
                val0 = input[++i];
                input[val0] = +line;
                break;
            }
            break;
        case 4:
            console.log('4');
            val0 = input[++i];
            console.log(input[val0]);
            rl.close();
            break;
        case 99:
            if (input[0] == 19690720) {
                console.log(j,k);
                console.log(input);
                process.exit(0);
            }
            break;
        default:
            console.error(`unknown opcode ${op}`);
            console.log(input);
            process.exit(1);
            break;
        }
    }
    console.log(input);
}

main();
