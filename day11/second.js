#!/usr/bin/env node

const fs = require('fs');

class Node {
  constructor(x, y, occupied) {
    this.x = x;
    this.y = y;
    this.occupied = occupied;
    this.neighbors = [];
  }

  isEmpty() {
    return !this.occupied;
  }

  isFilled() {
    return this.occupied;
  }

  coords() {
    return [this.x, this.y];
  }

  addNeighbor(n) {
    const exists = this.neighbors.find((c) => {
      const [x, y] = c.coords();
      const [nX, nY] = n.coords();

      return (x === nX) && (y === nY);
    });

    if (!exists) {
      this.neighbors.push(n);
    }
  }

  getNeighbors() {
    return this.neighbors;
  }

  toggle() {
    this.occupied = !this.occupied;
  }

  occupy() {
    this.occupied = true;
  }

  empty() {
    this.occupied = false;
  }
}


function loadInput(filename) {
  const data = fs.readFileSync(filename, 'utf-8');
  const lines = data.split(/\r?\n/);

  if (lines[lines.length-1] === '') {
    lines.pop();
  }

  return lines;
}

function printMap(seats, width, length) {
  let result = {};

  seats.forEach((s) => {
    const [x,y] = s.coords();

    if (!result.hasOwnProperty(y)) {
      result[y] = [...Array(width).keys()].map(i => '.');
    }

    result[y][x] = (s.isFilled()) ? '#' : 'L';
  });

  [...Array(length).keys()].map((i) => {
    const line = result[i];
    console.log(line.join(''));
  });
}

function getFromMap(mapping, x, y) {
  if (!mapping.hasOwnProperty(x)) {
    return null;
  }

  if (!mapping[x].hasOwnProperty(y)) {
    return null;
  }

  return mapping[x][y];
}

function findTopLeft(mapping, seat, width, length) {
  let [x, y] = seat.coords();

  while( x > 0 && y > 0 ) {
    x -= 1;
    y -= 1;

    const n = getFromMap(mapping, x, y);
    if (n !== null) {
      return n;
    }
  }

  return null;
}

function findTopMid(mapping, seat, width, length) {
  let [x, y] = seat.coords();

  while (y > 0) {
    y -= 1;

    const n = getFromMap(mapping, x, y);
    if (n !== null) {
      return n;
    }
  }

  return null
}

function findTopRight(mapping, seat, width, length) {
  let [x, y] = seat.coords();

  while ( x < (width-1) && y > 0) {
    x += 1;
    y -= 1;

    const n = getFromMap(mapping, x, y);
    if (n !== null) {
      return n;
    }
  }

  return null;
}

function findLeft(mapping, seat, width, length) {
  let [x, y] = seat.coords();

  while (x > 0) {
    x -= 1;

    const n = getFromMap(mapping, x, y);
    if (n !== null) {
      return n;
    }
  }

  return null;
}

function findRight(mapping, seat, width, length) {
  let [x, y] = seat.coords();

  while (x < (width - 1)) {
    x += 1;

    const n = getFromMap(mapping, x, y);
    if (n !== null) {
      return n;
    }
  }

  return null;
}
function findBotLeft(mapping, seat, width, length) {
  let [x, y] = seat.coords();

  while (x > 0 && y < (length -1)) {
    x -= 1;
    y += 1;

    const n = getFromMap(mapping, x, y);
    if (n !== null) {
      return n;
    }
  }

  return null;
}

function findBotMid(mapping, seat, width, length) {
  let [x, y] = seat.coords();

  while (y < (length -1)) {
    y += 1;
    const n = getFromMap(mapping, x, y);
    if (n !== null) {
      return n;
    }
  }

  return null;
}

function findBotRight(mapping, seat, width, length) {
  let [x, y] = seat.coords();

  while (y < (length -1) && x < (width-1)) {
    y += 1;
    x += 1;
    const n = getFromMap(mapping, x, y);
    if (n !== null) {
      return n;
    }
  }

  return null;
}

function mapBuilder(inputs, width, length) {
  let result = [];
  const mapping = {};

  inputs.forEach((row, i) => {
    [...row].forEach((cell, j) => {
      if (cell === '.') {
        return;
      }

      const occupied = (cell === '#');
      const n = new Node(j, i, occupied);

      if (!mapping.hasOwnProperty(j)) {
        mapping[j] = {};
      }

      mapping[j][i] = n;
      result.push(n);
    });
  });

  // attach neighbors
  result.forEach((s) => {
    [findTopLeft, findTopMid, findTopRight,
     findLeft, findRight,
     findBotLeft, findBotMid, findBotRight].forEach((f) => {
       const c = f(mapping, s, width, length);
       if (c !== null) {
         c.addNeighbor(s);
         s.addNeighbor(c);
       }
     });
  });

  // only return the chairs because the floor doesn't matter
  return result;
}

function process(seats) {
  let toToggle = [];

  seats.forEach((s) => {
    let crowd = 0;
    s.getNeighbors().forEach((n) => {
      if (n.isFilled()) {
        crowd += 1;
      }
    });

    if (s.isEmpty() && crowd === 0) {
      toToggle.push(s);
    }
    if (s.isFilled() && crowd >= 5) {
      toToggle.push(s);
    }
  });

  if (toToggle.length ===0) {
    return false;
  }

  toToggle.forEach(s => s.toggle());
  return true;
}

function countOccupied(seats) {
  let count = 0;

  seats.forEach(s => {
    if (s.isFilled()) {
      count += 1;
    }
  });

  return count;
}

function main(inputFilename, debug) {
  const inputs = loadInput(inputFilename);
  const map = mapBuilder(inputs, inputs[0].length, inputs.length);


  //console.log(map);

  let counter = 0;
  let canary = true;

  while (canary && counter < 1000000) {
    const toggled = process(map);

    if (toggled) {
      counter += 1;
    } else {
      canary = false;
    }
  }

  const result = countOccupied(map);
  console.log(`Result: ${result}`);
}

//main('./test.txt', false);
main('./input.txt', false);
