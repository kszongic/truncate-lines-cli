# truncate-lines-cli

[![npm version](https://img.shields.io/npm/v/@kszongic/truncate-lines-cli)](https://www.npmjs.com/package/@kszongic/truncate-lines-cli)
[![npm downloads](https://img.shields.io/npm/dm/@kszongic/truncate-lines-cli)](https://www.npmjs.com/package/@kszongic/truncate-lines-cli)
[![license](https://img.shields.io/npm/l/@kszongic/truncate-lines-cli)](./LICENSE)
[![node](https://img.shields.io/node/v/@kszongic/truncate-lines-cli)](https://nodejs.org)
![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
![platform](https://img.shields.io/badge/platform-win%20%7C%20mac%20%7C%20linux-blue)

Truncate each line of stdin or a file to a maximum width. **Zero dependencies.** Works on Windows, macOS, and Linux.

```bash
$ cat server.log | truncate-lines -w 80 -e
[2026-03-20T10:48:12Z] INFO  Request received from 192.168.1.42 path=/api/us...
[2026-03-20T10:48:12Z] ERROR Connection pool exhausted after 30000ms timeout...
[2026-03-20T10:48:13Z] WARN  Slow query detected: SELECT * FROM orders JOIN...
```

## Why?

- **Log files are unreadable** — one JSON blob per line, 2000+ characters wide, wrecks your terminal
- **CSV columns overflow** — data pipelines dump wide rows that break `column` and `less`
- **`cut` doesn't know about display width** — it counts bytes, not characters, and can't add ellipsis
- **Cross-platform pain** — `cut -c` on macOS, `Out-String -Width` on Windows, different every time
- **Pipe-friendly** — works with `tail -f`, `grep`, `jq`, and every other Unix tool

One command. Every platform. Done.

## Install

```bash
npm i -g @kszongic/truncate-lines-cli
```

Or run directly without installing:

```bash
npx @kszongic/truncate-lines-cli -w 80 -e file.txt
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
truncate-lines -w 50 -m "→" file.txt
```

## Options

| Option | Description |
|---|---|
| `-w, --width <n>` | Maximum line width (default: 80) |
| `-e, --ellipsis` | Append `…` when a line is truncated |
| `-m, --marker <s>` | Custom truncation marker (implies `--ellipsis`) |
| `-h, --help` | Show help |
| `-v, --version` | Show version |

## Recipes

### 🔍 Tame real-time logs

```bash
tail -f /var/log/app.log | truncate-lines -w 120 -e
```

No more horizontal scroll. See the important part of every line instantly.

### 📊 Preview wide CSV files

```bash
truncate-lines -w 100 -e data.csv | column -t -s,
```

Get a quick glance at your data without opening a spreadsheet.

### 🐳 Readable Docker logs

```bash
docker logs my-app 2>&1 | truncate-lines -w 160 -e
```

Container logs with JSON payloads finally fit your terminal.

### 🔗 Chain with grep for focused debugging

```bash
grep ERROR app.log | truncate-lines -w 100 -e
```

Filter first, then truncate — see the error context without the noise.

### 📁 Clean directory listings

```bash
find . -type f | truncate-lines -w 60 -m "…"
```

Deep directory trees stay readable.

### 📦 Use in npm scripts

```json
{
  "scripts": {
    "logs:preview": "cat logs/latest.log | truncate-lines -w 120 -e",
    "test:report": "npm test 2>&1 | truncate-lines -w 100 -e"
  }
}
```

## Use Cases

| Scenario | Command |
|---|---|
| Log monitoring | `tail -f app.log \| truncate-lines -w 120 -e` |
| CSV preview | `truncate-lines -w 80 -e data.csv` |
| CI output cleanup | `npm test 2>&1 \| truncate-lines -w 150` |
| Terminal dashboard | Pipe any wide output through before display |
| Slack/email snippets | Truncate before copying to keep formatting clean |
| Fixed-width reports | `truncate-lines -w 72` for email-safe plain text |

## How It Works

Reads stdin or a file line by line. For each line longer than the specified width, slices to `width - marker.length` and appends the marker (if `--ellipsis` or `--marker` is set). Lines shorter than the width pass through unchanged.

- **Streaming** — processes one line at a time, handles files of any size
- **No regex** — pure string slicing, fast on massive log files
- **UTF-8 safe** — works with multi-byte characters

## Comparison

| Tool | Zero deps | Cross-platform | Ellipsis | Custom marker | Streaming | Install |
|---|---|---|---|---|---|---|
| **truncate-lines-cli** | ✅ | ✅ Win/Mac/Linux | ✅ | ✅ | ✅ | `npx @kszongic/truncate-lines-cli` |
| `cut -c1-80` | N/A | ❌ Unix only | ❌ | ❌ | ✅ | Built-in (Unix) |
| `fold -w 80` | N/A | ❌ Unix only | ❌ | ❌ | ✅ (wraps, doesn't truncate) | Built-in (Unix) |
| `awk '{print substr($0,1,80)}'` | N/A | ❌ Unix only | ❌ | Manual | ✅ | Built-in (Unix) |
| PowerShell `Out-String -Width` | N/A | ❌ Windows only | ❌ | ❌ | ❌ | Built-in (Win) |

## Related Tools

- [tabulate-cli](https://github.com/kszongic/tabulate-cli) — Render data as ASCII tables
- [whitespace-cli](https://github.com/kszongic/whitespace-cli) — Visualize invisible characters
- [codeblock-cli](https://github.com/kszongic/codeblock-cli) — Extract code blocks from Markdown
- [lorem-gen-cli](https://github.com/kszongic/lorem-gen-cli) — Generate placeholder text
- [strip-trailing-ws-cli](https://github.com/kszongic/strip-trailing-ws-cli) — Remove trailing whitespace

## License

MIT © 2026 kszongic
