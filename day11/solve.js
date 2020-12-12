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
    this.neighbors.push(n);
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

function mapBuilder(inputs, width) {
  let result = [];
  let lastRow = [...Array(width).keys()].map(i => null);
  let currentRow = [];
  let lastChecked = null;

  inputs.forEach((row, i) => {
    [...row].forEach((cell, j) => {
      if (cell === '.') {
        currentRow.push(null);
        lastChecked = null;
        return;
      }
      const occupied = (cell === '#');

      const n = new Node(j, i, occupied);
      // add neighbors from above
      if (j >= 1 ) {
        const topLeft = lastRow[j-1];
        if (!!topLeft) {
          topLeft.addNeighbor(n);
          n.addNeighbor(topLeft);
        }
      }

      const topMid = lastRow[j];
      if (!!topMid) {
        topMid.addNeighbor(n);
        n.addNeighbor(topMid);
      }

      if (j < (width)) {
        const topRight = lastRow[j+1];
        if (!!topRight) {
          topRight.addNeighbor(n);
          n.addNeighbor(topRight);
        }
      }
      // add neighbor from before
      if (!!lastChecked) {
        lastChecked.addNeighbor(n);
        n.addNeighbor(lastChecked);
      }

      lastChecked = n;
      currentRow.push(n);
      result.push(n);
    });

    lastRow = currentRow;
    currentRow = [];
    lastChecked = null;
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
    if (s.isFilled() && crowd >= 4) {
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
  const map = mapBuilder(inputs, inputs[0].length);

  let counter = 0;
  let canary = true;

  if (debug) {
    printMap(map, inputs[0].length, inputs.length);    
    console.log();
  }
  while(canary && counter < 100000) {
    const didToggle = process(map);

    if (didToggle) {
      counter += 1;
    } else {
      canary = false;
    }

    if (debug) {
      printMap(map, inputs[0].length, inputs.length);    
      console.log();
    }
  }

  const result = countOccupied(map);
  console.log(`Result: ${result}`);
}

//main('./test.txt', false);
main('./input.txt', false);
