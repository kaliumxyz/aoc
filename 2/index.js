const fs = require("fs");

input = fs.readFileSync(process.argv[2] || "input", "utf8");
wires = input.split('\n');

bound = 30;
gmap = [];
for (i=-bound; i < bound; i++) {
    gmap[i] = [];
    for (j=-bound; j < bound; j++) {
        gmap[i][j] = ".";
    }
}

wires.forEach(wire => {
    let map = [];
    let x = 0;
    let y = 0;
    for (i=-bound; i < bound; i++) {
        map[i] = [];
        for (j=-bound; j < bound; j++) {
            map[i][j] = ".";
        }
    }
    wire = wire.split(',');
    wire.forEach(piece => {
        direction = piece[0];
        length = piece.slice(1);
        switch (direction) {
        case'U':
            y += +length;
            map[y][x] = '|';
            if (gmap[y][x] !== '.') {
                gmap[y][x] = 'x';
            } else {
                gmap[y][x] = '|';
            }
            break;
        case'D':
            y += +length;
            map[y][x] = '|';
            if (gmap[y][x] !== '.') {
                gmap[y][x] = 'x';
            } else {
                gmap[y][x] = '|';
            }
            break;
        case'R':
            x += +length;
            map[y][x] = '-';
            if (gmap[y][x] !== '.') {
                gmap[y][x] = 'x';
            } else {
                gmap[y][x] = '-';
            }
            break;
        case'L':
            x += +length;
            map[y][x] = '-';
            if (gmap[y][x] !== '.') {
                gmap[y][x] = 'x';
            } else {
                gmap[y][x] = '-';
            }
            break;
        }
    });
    let result = "";
    for (i=-bound; i < bound; i++) {
        for (j=-bound; j < bound; j++) {
            result += map[i][j];
        }
        result += "\n";
    }
    console.log(result);
});

result = "";
for (i=-bound; i < bound; i++) {
    for (j=-bound; j < bound; j++) {
        result += gmap[i][j];
    }
    result += "\n";
}
console.log(result);
