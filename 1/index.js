const fs = require("fs");

for (j = 0; j < 99; j++) {
    for (k = 0; k < 99; k++) {
        input = fs.readFileSync("input", "utf8");
        input = input.split(',').map(x => +x);
        input[1] = j;
        input[2] = k;
        for (i = 0; i < input.length; i++ ) {
            let op = input[i];
            switch (op) {
            case 1:
                val0 = input[++i];
                val1 = input[++i];
                pos = input[++i];
                input[pos] = input[val0] + input[val1];
                break;
            case 2:
                val0 = input[++i];
                val1 = input[++i];
                pos = input[++i];
                input[pos] = input[val0] * input[val1];
                break;
            case 99:
                if (input[0] == 19690720) {
                    console.log(j,k)
                    console.log(input);
                    process.exit(0);
                }
                break;
            default:
                console.error(`unknown opcode ${op}`);
                process.exit(1);
                break;
            }
        }
    }
}
