const fs = require("fs");

input = fs.readFileSync(process.argv[2] || "input", "utf8");
wires = input.split('\n');

points = [];

function Point(x = 0, y = 0, o = '') {
    this.x = x;
    this.y = y;
    this.o = o;
    return this;
}

function Line(x = 0, y = 0, px = 0, py = 0, sum = 0, o = '') {
    this.x = x;
    this.y = y;
    this.px = px;
    this.py = py;
    this.o = o;
    this.sum = sum;
    return this;
}

function convert(wire) {
    let x = 0;
    let y = 0;
    let sum = 0;
    wire = wire.split(',');
    lines = [new Line()];
    wire.forEach(piece => {
        direction = piece[0];
        orientation = '';
        length = +piece.slice(1);
        px = x;
        py = y;
        sum += length;
        console.log('.length', length);
        console.log('.sum: ', sum);
        switch (direction) {
        case'U':
            y += length;
            orientation = 'v';
            break;
        case'D':
            y -= length;
            orientation = 'v';
            break;
        case'R':
            x += length;
            orientation = 'h';
            break;
        case'L':
            x -= length;
            orientation = 'h';
            break;
        }
        lines.push(new Line(x, y, px, py, sum, orientation));
        // points.push(new Point(x,y, orientation));
    });
    return lines;
}

function check(map, wire) {
    let x = 0;
    let y = 0;
    let sum = 0;
    wire = wire.split(',');
    hits = [];
    h = map.filter(x => x.o == 'h');
    v = map.filter(x => x.o == 'v');
    wire.forEach(piece => {
        direction = piece[0];
        length = +piece.slice(1);
        let px = x;
        let py = y;
        let orientation = '';
        sum += length;
        switch (direction) {
        case'U':
            y += length;
            orientation = 'v';
            break;
        case'D':
            y -= length;
            orientation = 'v';
            break;
        case'R':
            x += length;
            orientation = 'h';
            break;
        case'L':
            x -= length;
            orientation = 'h';
            break;
        }
        console.log('length', length);
        console.log('sum: ', sum);
        switch (orientation) {
        case 'h':
            z = v.filter(point => (point.y < y && point.py > y) || (point.y > y && point.py < y));
            z = z.filter(point => (point.x < x && point.x > px) || (point.x > x && point.x < px));
            if (z.length) {
                console.log('hits: ', z,'\nx:', x,'y:', y,'px:', px,'py:', py);
                z = z.map(point => {
                    let dis = Math.abs(y) + Math.abs(point.x);
                    console.log(point.px - x, point.y - py, point.sum, sum);
                    return {y: y, x: point.x, dis: dis, sum: sum + point.sum - Math.abs(point.px - x) - Math.abs(point.y - py)};
                });
                console.log('hit: ', z, '\n');
                hits = hits.concat(z);
            }
        break;
        case 'v':
            z = h.filter(point => (point.x < x && point.px > x) || (point.x > x && point.px < x));
            z = z.filter(point => (point.y < y && point.y > py) || (point.y > y && point.y < py));
            if (z.length) {
                console.log('hits: ', z,'\nx:', x,'y:', y,'px:', px,'py:', py, 'sum', sum);
                z = z.map(point => {
                    let dis = Math.abs(point.y) + Math.abs(x);
                    console.log(Math.abs(point.x - px) + Math.abs(point.py - y));
                    return {y: point.y, x: x, dis: dis, sum: sum + point.sum - Math.abs(point.py - y) - Math.abs(point.x - px)};
                });
                console.log('hit: ', z, '\n');
                hits = hits.concat(z);
            }
        break;
        }
    });
    return hits;
}

first = convert(wires[0]);
hits = check(first, wires[1]);
console.log('result:');
let res;
hits.forEach(line => {
    if (!res) {
        res = line;
    } else {
        if (res.sum > line.sum) {
            res = line;
        }
    }
});
// hits.find(lines => {
//     return true;
// });
console.log(res);
