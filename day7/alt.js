#!/usr/bin/env node

const fs = require('fs');

function parseForChildren(line) {
  const result = {};
  let processor = [];
  while(line.length > 0) {
    const word = line.shift();
    if (word.indexOf('bag') === 0) {
      const count = parseInt(processor.shift());
      const first = processor.shift();
      const second = processor.shift();
      result[`${first}_${second}`] = count;
      processor = [];
      continue;
    }
    processor.push(word);
  }

  return Object.keys(result).reduce((agg, curr) => {
    let count = result[curr];
    while (count > 0) {
      agg.push(curr);
      count -= 1;
    }

    return agg;
  }, []);
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
  let count = 0;
  let processor = rules[start];

  while (processor.length > 0) {
    const target = processor.shift();
    count += 1;
    if (rules.hasOwnProperty(target)) {
      rules[target].forEach(item => processor.push(item));
    }
  }
 
  return count;
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
  //console.log(moses);
  const result = oldtraverse(moses, 'shiny_gold');
  console.log(result);
}

//main('./test.txt');
//main('./another.txt');
main('./input.txt');
