#!/usr/bin/env node

const fs = require('fs');

const DIRECTIONS = ['N', 'E', 'S', 'W'];

class Plane {
  constructor() {
    this.dir = 'E';
    this.dirIndex = 1;
    this.x = 0;
    this.y = 0;
  }

  face(dir, deg) {
    let inc = (dir === 'L') ? -1 : 1;

    switch(deg) {
    case 90:
      inc = inc * 1;
      break;
    case 180:
      inc = inc * 2;
      break;
    case 270:
      inc = inc * 3;
      break;
    default:
      console.error(`Invalid input: ${dir}, ${deg}`);
    }

    this.dirIndex = (this.dirIndex + inc + 4) % 4;
    this.dir = DIRECTIONS[this.dirIndex];
  }

  move(dir, dist) {
    const bearing = (dir === 'F') ? this.dir : dir;

    switch(bearing) {
    case 'N':
        this.y += dist;
        break;
    case 'S':
        this.y -= dist;
        break;
    case 'E':
        this.x += dist;
        break;
    case 'W':
        this.x -= dist;
        break;
    default:
        console.error(`Invalid input for move: ${dir}(${bearing}), ${dist}`);
    }
  }

  process(instruction) {
    const dir = instruction[0];
    const units = parseInt(instruction.slice(1));

    if (dir === 'L' || dir === 'R') {
      return this.face(dir, units);
    }

    return this.move(dir, units);
  }

  ping() {
    return [this.x, this.y];
  }
}

class Waypoint {
  constructor() {
    this.x = 0;
    this.y = 0;

    this.wpx = 10;
    this.wpy = 1;
  }

  face(dir, deg) {
    const x = this.wpx;
    const y = this.wpy;

    switch(`${dir}${deg}`) {
    case 'L90':
    case 'R270':
      this.wpx = y * -1;
      this.wpy = x;
      break;
    case 'L180':
    case 'R180':
      this.wpx = x * -1;
      this.wpy = y * -1;
      break;
    case 'R90':
    case 'L270':
      this.wpx = y;
      this.wpy = x * -1;
      break;
    default:
      console.error(`Unknown inputs: ${dir}, ${deg}`);
    }
  }

  move(dir, dist) {
    switch(dir) {
    case 'N':
      this.wpy += dist;
      break;
    case 'S':
      this.wpy -= dist;
      break;
    case 'E':
      this.wpx += dist;
      break;
    case 'W':
      this.wpx -= dist;
      break;
    case 'F':
      [...Array(dist).keys()].forEach(() => {
        this.x += this.wpx;
        this.y += this.wpy;
      });
      break;
    default:
      console.error(`Unknown inputs: ${dir}, ${dist}`);
    }
  }

  process(instruction) {
    const dir = instruction[0];
    const units = parseInt(instruction.slice(1));

    if (dir === 'L' || dir === 'R') {
      return this.face(dir, units);
    }

    return this.move(dir, units);
  }

  ping() {
    return [this.x, this.y];
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

function main(inputFile) {
  const inputs = loadInput(inputFile);
  const ship = new Waypoint();

  //console.log(inputs.length);

  inputs.forEach(instruction => ship.process(instruction));

  const result = ship.ping();
  console.log(result);
}

//main('./test.txt');
main('./input.txt');
