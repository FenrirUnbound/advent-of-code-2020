#!/usr/bin/env node

const fs = require('fs');

class Cache {
  constructor(maxSize) {
    this.size = maxSize;
    this.store = [];
  }

  add(i) {
    if (this.store.length === this.size) {
      this.store.shift();
    }

    this.store.push(i);
  }

  checkSum(s) {
    const copy = JSON.parse(JSON.stringify(this.store));

    copy.sort((a,b) => a-b);
    let canary = 0;
    let first = 0;
    let last = copy.length - 1;
    while(first < last) {
      const sum = copy[first] + copy[last];
      if (sum === s) {
        return [copy[first], copy[last]];
      }

      if (sum > s) {
        last -= 1;
      } else {
        first += 1;
      }

      canary += 1;
      if (canary > copy.length * 10) {
        return [];
      }
    }

    return [];
  }

  print() {
    console.log(this.store);
  }
}

function loadInput(filename) {
  const data = fs.readFileSync(filename, 'utf-8');
  const lines = data.split(/\r?\n/);

  if (lines[lines.length-1] === '') {
    lines.pop();
  }

  return lines.map(i => parseInt(i));
}

function main(inputFilename, preamble) {
  const inputs = loadInput(inputFilename);

  const cache = new Cache(preamble);
  inputs.splice(0, preamble).forEach(i => cache.add(i));

  const result = inputs.find(i => {
    const check = cache.checkSum(i);
    if (check.length === 0) {
      return true;
    }

    cache.add(i);
    return false;
  });

  cache.print();
  console.log(result);
}

main('./test.txt', 5);
//main('./input.txt', 25);
