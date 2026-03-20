# @kszongic/truncate-lines-cli

[![npm version](https://img.shields.io/npm/v/@kszongic/truncate-lines-cli)](https://www.npmjs.com/package/@kszongic/truncate-lines-cli)
[![license](https://img.shields.io/npm/l/@kszongic/truncate-lines-cli)](./LICENSE)

Truncate each line of stdin or a file to a maximum width. Zero dependencies.

## Install

```bash
npm install -g @kszongic/truncate-lines-cli
```

## Usage

```bash
# Truncate lines to 80 chars (default)
cat log.txt | truncate-lines

# Custom width
cat data.csv | truncate-lines -w 120

# Add ellipsis when truncated
truncate-lines -w 40 -e file.txt

# Custom truncation marker
truncate-lines -w 50 -m "…" file.txt
```

## Options

| Option | Description |
|---|---|
| `-w, --width <n>` | Maximum line width (default: 80) |
| `-e, --ellipsis` | Append `...` when line is truncated |
| `-m, --marker <s>` | Custom truncation marker (implies `--ellipsis`) |
| `-h, --help` | Show help |
| `-v, --version` | Show version |

## Examples

```bash
# Trim long log lines for terminal display
tail -f app.log | truncate-lines -w 120 -e

# Prepare fixed-width output
cat names.txt | truncate-lines -w 30

# Use unicode ellipsis
echo "This is a very long line of text" | truncate-lines -w 20 -m "…"
# Output: This is a very lon…
```

## License

MIT © 2026 kszongic
