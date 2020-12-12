#!/usr/bin/env node

const fs = require('fs');

function loadInput(filename) {
  const data = fs.readFileSync(filename, 'utf-8');
  const lines = data.split(/\r?\n/);

  if (lines[lines.length-1] === '') {
    lines.pop();
  }

  return lines;
}

function compileInstructions(input) {
  const instructions = input.map((i) => {
    const [op, value] = i.split(' ');

    return {
      op: op.trim(),
      value: parseInt(value.trim())
    };
  });
  return instructions;
}

function runProgram(instructions) {
  const maxCount = instructions.length;
  const wat = Array(maxCount).fill(false);
  let acc = 0;
  let canary = maxCount;
  let line = 0;

  let last = 0;
  for (let canary = 0; canary <= maxCount; canary++) {
    const op = instructions[line];

    if (wat[line] === true) {
      console.log('infinite loop detected');
      return {infinite: true, acc, line, last};
    }

    wat[line] = true;
    last = line;

    switch(op.op) {
    case 'jmp':
        line += op.value;
        break;
    case 'acc':
        acc += op.value;
    case 'nop':
        line += 1;
        break;
    }

    if (line >= maxCount) {
      console.log('exceeded program. ending');
      return {infinite: false, acc: acc, line};
    }

  }
}

function bruteForceNops(instructions) {
  const targets = [];

  instructions.forEach((element, index) => {
    if (element.op === 'nop') {
      targets.push(index);
    }
  });


  const found = targets.find((element) => {
    const working = JSON.parse(JSON.stringify(instructions));

    // override to jmp
    working[element].op = 'jmp'; 

    const result = runProgram(working);
    if (!result.infinite) {
      return element
    }
  });

  return found;
}

function bruteForceJmp(instructions) {
  const targets = [];

  instructions.forEach((element, index) => {
    if (element.op === 'jmp') {
      targets.push(index);
    }
  });


  const found = targets.find((element) => {
    const working = JSON.parse(JSON.stringify(instructions));

    // override to nop
    working[element].op = 'nop'; 

    const result = runProgram(working);
    if (!result.infinite) {
      return element
    }
  });

  return found;
}

function main(inputFilename) {
  const inputs = loadInput(inputFilename);
  const program = compileInstructions(inputs);

  const result = runProgram(program);
  //const result = bruteForceNops(program);
  //const result = bruteForceJmp(program);

  console.log(`Result: ${JSON.stringify(result)}`);
}

//main('./test.txt');
//main('./input.txt');
main('./changeup.txt');
