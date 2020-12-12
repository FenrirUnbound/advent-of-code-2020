#!/usr/bin/env node

const fs = require('fs');

function loadInputs(filename) {
  const data = fs.readFileSync(filename, 'utf-8');
  //const lines = data.split(/\r\n/);
  const lines = data.split(/\r?\n/);
  return lines;
}

function groupUp(lines) {
  let groups = [];
  let processing = {};
  let max = 0;
  lines.forEach(line => { 
    const input = line.trim();
    if (input.length === 0) {
      Object.keys(processing).forEach(k => {
        if (processing[k] !== max) {
          delete processing[k];
	}
      });
      groups.push(processing);
      processing = {};
      max = 0;
      return;
    }
    max += 1;
    [...input].forEach(c => {
      if (!processing.hasOwnProperty(c)) {
        processing[c] = 0
      }
      processing[c] += 1;
    });
  });

  if (Object.keys(processing).length > 0) {
    groups.push(processing);
  }
  return groups;
}

function tally(groups) {
  const result = groups.reduce((acc, cur) => {
    console.log(cur);
    return acc + Object.keys(cur).length;
  }, 0);
  return result;
}

function main() {
  //const inputs = loadInputs('./test.txt');
  const inputs = loadInputs('./inputs.txt');
  const groups = groupUp(inputs);
  console.log(tally(groups));
}

main();
