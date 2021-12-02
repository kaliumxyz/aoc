const fs = require("fs");

raw = fs.readFileSync(process.argv[2] || "input", "utf8");
input = raw.split('\n');

orbits_map = [];

function Orbit(parent, value) {
    this.parent = parent;
    this.value = value;
    return this;
}

orbits = [new Orbit(null, "COM")];

function main(input) {
    input.forEach(line => {
        line = line.split(")");
        if (line.length !== 2)
            process.exit(1);
        orbits.push(new Orbit(orbits.find(x => x.value == line[0]) || line[0], line[1]));
        orbits_map[line[1]] = line[0];
    });

    orbits = orbits.map(orbit => {
        orbit.parent = orbits.find(x => x.value == orbit.parent) || orbit.parent;
        return orbit;
    });
}
console.log("running");
main(input);
console.log("result: ");

function rec (orbit) {
    if (orbit.parent) {
        return rec(orbit.parent) + 1;
    }
    return 0;
}

par_you = [];

function resolve (orbit) {
    if (orbit.parent) {
        par_you.push(orbit);
        resolve(orbit.parent);
    }
}

par_san = [];
first = undefined;

function resolve_san (orbit) {
    if (orbit.parent) {
        if (par_you.find(x => x.value === orbit.parent.value)) {
            if (first === undefined) {
                first = orbit.parent;
            }
        }
        par_san.push(orbit);
        resolve_san(orbit.parent);
    }
}

let res = 0;
orbits.forEach(orbit => {
    res += rec(orbit);
    if (isNaN(res)) {
        process.exit(1);
    }
});

console.log(res);

you = orbits.find(orbit => orbit.value === "YOU");
san = orbits.find(orbit => orbit.value === "SAN");

resolve(you);
resolve_san(san);

console.log(par_you.length);
console.log(par_san.length);
console.log(first);
console.log(par_you);

console.log(par_you.findIndex(x => x.value == first.value)+ par_san.findIndex(x => x.value == first.value) - 2);
