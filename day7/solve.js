#!/usr/bin/env node

const fs = require('fs');

function parseForChildren(line) {
  const result = {};
  let processor = [];
  while(line.length > 0) {
    const word = line.shift();
    if (word.indexOf('bag') === 0) {
      const count = processor.shift();
      const first = processor.shift();
      const second = processor.shift();
      result[`${first}_${second}`] = true;
      processor = [];
      continue;
    }
    processor.push(word);
  }
  return Object.keys(result);
}

function processRule(line) {
  const p = line.split(' ');
  const words = p.splice(3);

  // get rid of "contains"
  words.shift();

  const result = {};
  const keyName = p.slice(0,2).join('_');
  result[keyName] = [];

  if (words[0] === 'no') {
    // no child bags
    return result;
  }
  const children = parseForChildren(words);
  result[keyName] = children;

  return result;
}

function loadInput(filename) {
  const data = fs.readFileSync(filename, 'utf-8');
  const lines = data.split(/\r?\n/);
  const last = lines[lines.length-1];
  if (last === '') {
    lines.pop();
  }
  return lines;
}

function mergeRules(dest, src) {
  Object.keys(src).forEach(k => {
    if (!dest.hasOwnProperty(k)) {
      dest[k] = [];
    }

    const result = dest[k].concat(src[k]);
    dest[k] = result;
  });

  return dest;
}

function oldtraverse(rules, start) {
  const result = {};
  let processor = rules[start];

  while (processor.length > 0) {
    const target = processor.shift();
    result[target] = true;
    if (rules.hasOwnProperty(target)) {
      rules[target].forEach(item => processor.push(item));
    }
  }
 
  return Object.keys(result);
}

function invertRules(rules) {
  const result = {};
  Object.keys(rules).forEach(k => {
    const l = rules[k];
    l.forEach(color => {
      if (!result.hasOwnProperty(color)) {
        result[color] = [];
      }
      result[color].push(k);
    });
  });
  return result;
}

function main(inputFilename) {
  const inputs = loadInput(inputFilename);

  let moses = {};

  inputs.forEach(line => {
    const rule = processRule(line);
    moses = mergeRules(moses, rule); 
  });
  const theLaw = invertRules(moses);
  const result = oldtraverse(theLaw, 'shiny_gold');
  console.log(result);
  console.log(result.length);
}

//main('./test.txt');
main('./input.txt');
