#!/usr/bin/env node
const fs = require("fs");


fs.readdirSync("input").forEach(file => {
  const input = fs.readFileSync(`input/${file}`, "utf8").split("\n")
  // if (file == 'test')
    main(input, file)
});

function sparse(arr) {
  return parse(arr.split(''))
}

function l(...msg) {
  console.log(...msg)
}

function parse(arr) {
  return parseInt(arr.join(""), 2)
}

function main(input, file) {
  l(file);
  input.pop()
  let acc = 0
  let acc2 = 0
  input.forEach((line,j) => {
    const map = []
    const exp = line.split(' |')[0].split(' ')
    exp.forEach(x => {
      switch(x.length) {
        case 2:
          map[1] = x.split('')
          break;
        case 3:
          map[7] = x.split('')
          break;
        case 4:
          map[4] = x.split('')
          break;
        case 7:
          map[8] = x.split('')
          break;
      }
    })
    exp.forEach(x => {
      switch(x.length) {
        case 5: // 2 5 3
          let seg5 = x.split('')
          switch (seg5.filter(y => y == map[1][0] || y == map[1][1]).length) {
            case 1: // 2 5
              let segright = x.split('')
              switch (segright.filter(y => y == map[4][0] || y == map[4][1] || y == map[4][2] || y == map[4][3]).length) {
                case 3:
                  map[5] = x.split('')
                  break;
                case 2:
                  map[2] = x.split('')
                  break;
              }
              break;
            case 2: // 3
              map[3] = x.split('')
              break;
          }
          break;
        case 6: // 9 6 0
          let seg6 = x.split('')
          switch (seg6.filter(y => y == map[1][0] || y == map[1][1]).length) {
            case 1: //  6
              map[6] = x.split('')
              break;
            case 2: //  0 9
              let segmid = x.split('')
              switch (segmid.filter(y => y == map[4][0] || y == map[4][1] || y == map[4][2] || y == map[4][3]).length) {
                case 3: //  0
                  map[0] = x.split('')
                  break;
                case 4: // 9
                  map[9] = x.split('')
                  break;
              }
          }
          break;
      }
    })
    // map.forEach((x,i) => console.log(i, x))
    let smap = map.map(x => x.sort().join(''))
    // console.log(smap)
    const seg = line.split('| ')[1]
    let res = '';
    seg.split(' ').forEach(x => {
      // console.log(x)
      switch(x.length) {
        case 2:
          res += 1
          acc += 2
          break;
        case 3:
          res += 7
          acc += 3
          break;
        case 7:
          res += 8
          acc += 7
          break;
        case 4:
          res += 4
          acc += 4
          break;
        default:
          let y = x.split('').sort().join('')
          // console.log(y)
          res += smap.indexOf(y)
          break;
      }
    })
    // console.log(res)
    acc2 += +res
  });
  console.log(acc, acc2)
}
