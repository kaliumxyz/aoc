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
  let risk = 0;
  l(file);
  input.pop()
  flag = [];
  lows = [];
  input.forEach((line,j) => {
    // l(line.split(''))
    line.split('').forEach((n, i, arr) => {
      n = +n
      flag[`${j}-${i}`] = []
      // first row
      if(j == 0) {
        if(input[j+1][i] <= n) {
          flag[`${j}-${i}`].push(input[j+1][i]);
        }
      } else {
        if(input[j-1][i] <= n) {
          flag[`${j}-${i}`].push(input[j-1][i]);
        }
        // if not last row
        if(j != input.length - 1) {
          if(input[j+1][i] < n) {
            flag[`${j}-${i}`].push(input[j+1][i]);
          }
        }
      }
      // first column
      if(i == 0) {
        if(line[i+1] <= n) {
          flag[`${j}-${i}`].push(line[i+1]);
        }
      } else {
        if(line[i-1] <= n) {
          flag[`${j}-${i}`].push(line[i-1]);
        }
        // if not last column
        if(i != line.length - 1) {
          if(line[i+1] <= n) {
            flag[`${j}-${i}`].push(line[i+1]);
          }
        }
      }
      // if (file == "test") {
      //     l(`${j}-${i}`, n ,flag[`${j}-${i}`])
      // }
      if (!flag[`${j}-${i}`].length) {
        risk += +n
        risk += 1
        lows.push({n, j, i})
        // if(input[j-1][i] < n) {
        //   flag = false;
        //   // l('n')
        // }
        // if(input[j+1][i] < n) {
        //   flag = false;
        //   // l('n')
        // }
      }
    })
  });
  // if (file == "test") {
  l(risk)
  l(lows.length)
  let res = lows.map((low,index) => {
    let map = recurse(low, input);
    return {map, hash: JSON.stringify(map.sort())}
  })
  let fin = []
  res.forEach(x => fin.find(y => x.hash == y.hash)?"":fin.push(x))
  fin = fin.map(x => x.map.length).sort((x,y)=> y - x)
  l(fin[0] * fin[1] * fin[2])
  // Object.keys(flag).map((x,i) => l(x, flag[x]))
  // }
}

function recurse (point, map, been = []) {
    let {j, i} = point;
      been = [point,...been]
      if(check(j+1,i, map, been)) {
        been = recurse({j:j+1, i}, map, been);
      }
      if(check(j-1,i, map, been)) {
        been = recurse({j:j-1, i}, map, been);
      }
      if(check(j,i+1, map, been)) {
        been = recurse({j, i:i+1}, map, been);
      }
      if(check(j,i-1, map, been)) {
        been = recurse({j, i:i-1}, map, been);
      }
    return been;
      // } else {
      //   if(input[j-1][i] <= n) {
      //     flag[`${j}-${i}`].push(input[j-1][i]);
      //   }
      //   // if not last row
      //   if(j != input.length - 1) {
      //     if(input[j+1][i] < n) {
      //       flag[`${j}-${i}`].push(input[j+1][i]);
      //     }
      //   }
      // }
      // // first column
      // if(i == 0) {
      //   if(line[i+1] <= n) {
      //     flag[`${j}-${i}`].push(line[i+1]);
      //   }
      // } else {
      //   if(line[i-1] <= n) {
      //     flag[`${j}-${i}`].push(line[i-1]);
      //   }
      //   // if not last column
      //   if(i != line.length - 1) {
      //     if(line[i+1] <= n) {
      //       flag[`${j}-${i}`].push(line[i+1]);
      //     }
      //   }
      // }
}

function check(x,y, input ,been = []) {
  if(x < 0 || y < 0) {
    return false
  }
  if(x > input.length || y > input[0].length - 1) {
    return false
  }
  try {
    if(input[x][y] == 9)
      return false
  } catch (e) {
    return false
  }
  return !been.find(point => point.j == x && point.i == y)
}
