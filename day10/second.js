#!/usr/bin/env node

const fs = require('fs');

function loadInputs(filename) {
  const data = fs.readFileSync(filename, 'utf-8');
  const lines = data.split(/\r?\n/);

  if (lines[lines.length-1] === '') {
    lines.pop();
  }

  return lines.map(i => parseInt(i)).sort((a,b) => a-b);
}

function augmentFinal(inputs) {
  const last = inputs[inputs.length - 1];

  inputs.push(last+3);
  inputs.unshift(0);

  return inputs;
}

function findLinks(inputs, index) {
  const max = inputs.length-1;
  let candidates = [index+1, index+2, index+3];

  const result = candidates.reduce((agg, current) => {
    if (current > max) {
      return agg;
    }

    const maybe = inputs[current];
    if ((maybe - 3) <= inputs[index]) {
      agg.push(current);
    }

    return agg;
  }, []);

  return result;
}


function calcPaths(inputs) {
  let count = 0;
  let processor = [0];
  const lastIndex = inputs.length-1;

  while(processor.length > 0) {
    const index = processor.shift();

    if (index === lastIndex) {
      count += 1;
      continue;
    }

    const toAdd = findLinks(inputs, index);
    toAdd.forEach(i => processor.push(i));
  }

  return count;
}

function pathFinder(inputs) {
  let count = 1;
  let streak = 0;

  let start = 0;
  inputs.forEach((i) => {
    const diff = i - start;
    //console.log(`diff: ${diff} for ${i} ? ${streak}`);

    if (diff === 1) {
      streak += 1;
    } else if (diff === 3) {
      if (streak === 0) {
        start = i;
        return;
      }
      const paths = calcPaths([...Array(streak+1).keys()]);
      //console.log(`streak: ${streak} (${i}) ${paths}`);

      count = count * paths;
      streak = 0;
    }

    start = i;
  });

  return count;
}

function main(inputFile) {
  const adapters = loadInputs(inputFile);
  augmentFinal(adapters);

  //console.log(adapters);

  const paths = pathFinder(adapters);
  console.log(`Paths: ${paths}`);
}

//main('./test.txt');
//main('./largetest.txt');
main('./input.txt');
