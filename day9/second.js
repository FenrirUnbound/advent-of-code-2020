#!/usr/bin/env node

const fs = require('fs');

function loadInput(filename) {
  const data = fs.readFileSync(filename, 'utf-8');
  const lines = data.split(/\r?\n/);

  if (lines[lines.length-1] === '') {
    lines.pop();
  }

  return lines.map(i => parseInt(i));
}

function main(inputFilename, targetSum) {
  const inputs = loadInput(inputFilename);

  let start = 0;
  let last = 0;

  const result = inputs.find((current, index) => {
    let sum = current;
    let foundIndex = index;

    const set = inputs.slice(index+1).find((working, j) => {
      sum += working;

      if (sum === targetSum) {
        foundIndex = index+j;
        return true;
      }

      // short circuit the loop
      if (sum > targetSum) {
        return true;
      }
    });

    if (foundIndex > index) {
      start = index;
      last = foundIndex;
      // we found it
      return true;
    }
  });


  if (start === last) {
    console.log('could not find the set');
    return;
  }

  const copy = JSON.parse(JSON.stringify(inputs.slice(start, last+1)));
  copy.sort((a,b)=>a-b);

  console.log(`${copy[0]} :: ${copy[copy.length-1]}`);

  const toPrint = copy[0] + copy[copy.length-1];
  console.log(toPrint);
}

//main('./test.txt', 127);
main('./input.txt', 1212510616);
