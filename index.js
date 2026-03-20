#!/usr/bin/env node
'use strict';

const args = process.argv.slice(2);

function printHelp() {
  console.log(`Usage: truncate-lines [options] [file]

Truncate each line to a maximum width.

Options:
  -w, --width <n>    Maximum line width (default: 80)
  -e, --ellipsis     Append "..." when truncated
  -m, --marker <s>   Custom truncation marker (implies --ellipsis)
  -h, --help         Show this help
  -v, --version      Show version

Examples:
  cat log.txt | truncate-lines -w 120
  truncate-lines -w 40 -e file.txt
  truncate-lines -w 50 -m "…" file.txt`);
}

let width = 80;
let ellipsis = false;
let marker = '...';
let filePath = null;

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '-h' || a === '--help') { printHelp(); process.exit(0); }
  if (a === '-v' || a === '--version') {
    console.log(require('./package.json').version);
    process.exit(0);
  }
  if (a === '-w' || a === '--width') { width = parseInt(args[++i], 10); continue; }
  if (a === '-e' || a === '--ellipsis') { ellipsis = true; continue; }
  if (a === '-m' || a === '--marker') { marker = args[++i]; ellipsis = true; continue; }
  if (!filePath) filePath = a;
}

if (isNaN(width) || width < 1) {
  console.error('Error: width must be a positive integer');
  process.exit(1);
}

function truncLine(line) {
  if (line.length <= width) return line;
  if (ellipsis) {
    const cut = width - marker.length;
    if (cut < 0) return line.slice(0, width);
    return line.slice(0, cut) + marker;
  }
  return line.slice(0, width);
}

function processStream(stream) {
  let buf = '';
  stream.setEncoding('utf8');
  stream.on('data', (chunk) => {
    buf += chunk;
    const parts = buf.split('\n');
    buf = parts.pop();
    for (const line of parts) {
      process.stdout.write(truncLine(line) + '\n');
    }
  });
  stream.on('end', () => {
    if (buf.length > 0) {
      process.stdout.write(truncLine(buf) + '\n');
    }
  });
  stream.on('error', (err) => {
    console.error('Error: ' + err.message);
    process.exit(1);
  });
}

if (filePath) {
  const fs = require('fs');
  if (!fs.existsSync(filePath)) {
    console.error(`Error: file not found: ${filePath}`);
    process.exit(1);
  }
  processStream(fs.createReadStream(filePath));
} else {
  if (process.stdin.isTTY) {
    printHelp();
    process.exit(0);
  }
  processStream(process.stdin);
}
