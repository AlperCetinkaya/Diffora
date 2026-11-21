# Diffora — Developer Toolkit

[English](README.en.md) | [Türkçe](README.md)

A browser-based app for comparing two text/code files side by side and inspecting JSON/XML service responses. Matching lines appear in green and differences in red. Blank cells keep the two sides aligned when lines are added or removed.

## Tools and navigation

Diffora provides seven independent tools in a shared navigation layout:

- [Comparison](https://alpercetinkaya.com.tr/diffora/compare/)
- [JSON / XML Viewer](https://alpercetinkaya.com.tr/diffora/viewer/)
- [URL / Base64 Encode–Decode](https://alpercetinkaya.com.tr/diffora/codec/)
- [Timestamp Converter](https://alpercetinkaya.com.tr/diffora/timestamp/)
- [Regex Tester](https://alpercetinkaya.com.tr/diffora/regex/)
- [JSON → C# Model](https://alpercetinkaya.com.tr/diffora/csharp/)
- [SQL Formatter](https://alpercetinkaya.com.tr/diffora/sql/)

Desktop uses a left sidebar; smaller screens use a top tool menu. Switching tools, browser back/forward, and language changes preserve inputs. Legacy `#viewer` links open the new Viewer address. The app root opens Comparison by default.

For direct links on GitHub Pages, `dist/compare/index.html`, `dist/viewer/index.html`, `dist/codec/index.html`, `dist/timestamp/index.html`, `dist/regex/index.html`, `dist/csharp/index.html`, and `dist/sql/index.html` are checked in. After changing the main `dist/index.html`, regenerate them with:

```bash
npm run build
```

This command only generates seven static entry pages; no backend or database is required. `npm test` also refreshes the entry pages automatically.

## SQL Formatter

The [live formatter](https://alpercetinkaya.com.tr/diffora/sql/) supports PostgreSQL and SQL Server (Transact-SQL). Choose the dialect, 2/4-space or tab indentation, and uppercase/lowercase/preserved keywords. Paste SQL or load/drop a UTF-8 `.sql`/`.txt` file, format it, then copy the full result or download `.sql`. Each dialect has its own example. Input/option edits clear stale results; tool navigation and language changes preserve inputs and output.

Tests cover PostgreSQL CTEs, casts, `$1` parameters, JSON operators, quoted identifiers, and dollar-quoted text, plus T-SQL TOP, bracket identifiers, `@parameters`, Unicode strings, transactions, pagination and GO batches (including repeat counts). Strings, quoted identifiers and comment contents are preserved. Dollar-quoted function bodies remain unchanged internally. This is a formatter, not a SQL validator or execution engine. Stored procedure bodies and SQLCMD/psql commands are not fully supported. No database connection is opened.

All processing is local in a disposable worker with a 3-second timeout. Limits: 512 KB UTF-8 input and 2,097,152 output characters. Worker, dialect, preservation, stable formatting, UI, file, clipboard and download tests are included in `npm test`. Turkish, English and German interfaces are available.

The locally bundled engine uses **sql-formatter 15.10.0** (MIT) with only PostgreSQL/Transact-SQL dialects and the **nearley** runtime (MIT). Licenses are in `dist/vendor/`. No CDN is used at runtime. `npm ci && npm run build` regenerates the bundle using pinned esbuild and refreshes all static routes; `npm run build:sql` rebuilds only the SQL engine.

## JSON → C# Model

**Include JsonPropertyName attributes** is enabled by default. Disable it to generate all classes without these attributes. PascalCase names remain; configure serializer name mapping for JSON keys such as `created_at`. Regenerate after changing the option.

The [live generator](https://alpercetinkaya.com.tr/diffora/csharp/) creates C# 10+ classes compatible with System.Text.Json. Paste or load UTF-8 JSON, choose a root class name and optional namespace, then generate, copy or download a `.cs` file. The Viewer has **Generate C# model** for validated JSON; it transfers the complete source without changing Viewer content. XML cannot be transferred as JSON.

Nested objects become separate classes, arrays become `List<T>`, names use PascalCase and `[JsonPropertyName]` preserves the original JSON keys. Invalid/colliding property names are normalized and made unique. Generated references use fully qualified names to avoid model-name collisions. All items in object arrays are merged: missing/null fields and null list items are nullable. Root input must be an object or an array containing at least one object and only objects/null; use the root type in the generated comment for array deserialization.

Numeric literals are inferred without JavaScript rounding: `int`, then `long`, then exact `decimal` where representable. Mixed/incompatible types, numbers outside decimal limits, empty arrays and null-only fields use `JsonElement` (nullable when appropriate), with inference notes. Dates remain `string` by default; optional ISO detection recognizes valid offset-bearing timestamps as `DateTimeOffset`. Inference describes only the supplied sample, not the full API contract; review numeric ranges and nullable assumptions.

Content stays local. Generation uses a disposable worker with a 3-second timeout. Limits: 2 MB input, 64 nesting levels, 50,000 values, 150 classes, 500 properties per class, 3,000 properties total and 500,000 generated characters. Duplicate keys are rejected instead of silently discarded. Editing input/options invalidates old exports. Turkish, English and German are supported.

`npm test` includes inference, UI, file, clipboard, download, worker and Viewer-transfer tests. With a .NET 8 SDK installed, `npm run test:csharp-dotnet` also compiles seven generated fixtures and checks deserialization, exact numeric values, JSON names and nullable lists. `DIFFORA_DOTNET_BIN` can select a dotnet executable; `DIFFORA_DOTNET_ROOT` optionally selects direct Roslyn compilation with SDK reference assemblies.

## Regex Tester

The [live tool](https://alpercetinkaya.com.tr/diffora/regex/) tests JavaScript regular expressions with `g`, `i`, `m`, `s`, and `u`. Enter the pattern without surrounding slashes, paste test text, and choose **Find matches** or **Replace**. Matches are highlighted; numbered, named, and unmatched optional groups are listed. Empty matches use a vertical bar. Positions use zero-based UTF-16 indexes.

Replacement follows JavaScript string substitution semantics, including `$$`, `$&`, `$1`–`$99`, `$<name>`, and prefix/suffix tokens. The full replacement output can be copied. Input and option changes invalidate stale results; tool navigation and language changes preserve content. Processing stays local in a disposable Web Worker with a 2-second timeout and manual stop, so pathological backtracking does not run on the UI thread.

Limits: 200 KB UTF-8 test text, 10,000 characters each for pattern/replacement, 20,000 total matches, and 2,000,000 replacement output characters. Exceeding a processing limit reports an error rather than returning partial replacement text. Highlighting previews the first 32,000 characters and 500 matches; the list shows 100 matches, up to 20 numbered/named groups each, with long values truncated. Successful match counts and copied replacement output are complete. This uses browser JavaScript syntax, not .NET/PCRE/PostgreSQL dialects.

## Timestamp Converter

The [live tool](https://alpercetinkaya.com.tr/diffora/timestamp/) converts Unix timestamps to dates and wall-clock dates to timestamps. Choose seconds, milliseconds or automatic detection, plus an IANA time zone. Results include seconds, milliseconds, UTC ISO 8601 and local date/time with the UTC offset. Each value can be copied independently. **Use current time** fills both inputs.

Auto detection treats absolute values below 100 billion as seconds; choose an explicit unit for older or distant dates. Seconds accept up to three decimal places. Milliseconds must be integers. Date input belongs to the selected time zone, defaults to Europe/Istanbul, and supports years 0001–9999. Invalid calendar dates, daylight-saving gaps and ambiguous repeated hours produce explicit errors. For ambiguous hours, use UTC input or an exact timestamp. Input/option changes clear stale results. Turkish, English and German are supported; processing is entirely local.

## URL / Base64 Encode–Decode

The [live tool](https://alpercetinkaya.com.tr/diffora/codec/) encodes and decodes UTF-8 text locally. It supports URL component/parameter mode, full URL mode, form/query (`+` as space), and standard or URL-safe Base64. Base64 decoding ignores whitespace and line breaks, validates padding when present, and accepts correctly unpadded input.

Paste text or load a file. Copy or download the result, or move it back to the input with the reverse operation selected. Changing input or options clears stale output. Input is limited to 2 MB. Base64 is an encoding, not encryption; decoded binary data is reported as an error rather than displayed as invalid UTF-8. Content stays in the browser and is not uploaded.

URL component mode encodes reserved characters; full URL mode preserves the `: / ? & = #` separators. Full URL decoding leaves encoded reserved characters such as `%2F` intact to preserve URL structure.

## JSON / XML Viewer

In the [live Viewer](https://alpercetinkaya.com.tr/diffora/viewer/) tab, paste a service response or load a UTF-8 file. **Format and validate** auto-detects JSON/XML, with manual format selection also available.

- Collapsible tree for nested objects, arrays, and XML elements
- Syntax-colored code view with line numbers and 2- or 4-space indentation
- Syntax error details, line/column positions where provided by the parser, and **Go to error**
- Key/value search and match navigation
- Indented/minified output, copy, and `.json` / `.xml` download
- Explicit action to open JSON/XML embedded in a JSON string
- Formatting preserves large JSON numbers, duplicate keys, and numeric spellings
- XML mixed text, CDATA, and `xml:space` preserve meaningful whitespace
- Turkish, English, and German interfaces; switching tabs preserves inputs

Invalid source is not automatically corrected. The Viewer accepts up to 2 MB. DTD/DOCTYPE is unsupported; parsing supports up to 512 nested levels. Tree rendering is limited to 8,000 nodes / 120 levels for ordinary content and 1,000 nodes for large content; long keys and values are shortened in previews. Code previews show up to 200 lines, 32,768 characters, and 1,000 characters per line. Syntax coloring is disabled for large previews. These limits are disclosed onscreen; search covers the visible preview only. **Copy and Download always use the complete output.** XML schema/XSD validation is not included.

## Features

- Choose files, drag and drop them, or paste text directly
- Side-by-side comparison with line numbers
- Highlight the section between the common prefix and suffix of changed lines
- Counts of matching, changed, added, and removed lines
- Show differences only
- Navigate to the previous or next group of changes
- Ignore whitespace differences
- Swap sides and clear contents
- Turkish, English, and German interfaces with a remembered language preference
- Dark theme with navy accents and a responsive layout
- Built-in example and comparison via `Ctrl+Enter` / `⌘+Enter`

## Run locally

No build step, npm installation, API key, or database is required. You only need a modern browser and, for the example below, Python 3.

```bash
git clone https://github.com/AlperCetinkaya/Diffora.git
cd Diffora
python3 -m http.server 3000 --directory dist
```

Open **http://localhost:3000** in your browser. On Windows, your Python command may be `python` or `py`.

If the repository is private, cloning requires GitHub authentication.

## Usage

1. Add the original file to the left panel and the updated file to the right, or paste their contents.
2. Enable **Ignore whitespace** if needed.
3. Click **Compare files**.
4. Review green matches and red differences. A striped cell means there is no corresponding line on that side.
5. Use **Differences only** to hide matching lines and the arrow buttons to navigate between groups of changes.

Use the menu in the top-right corner to switch the interface language. This does not translate or modify the file contents.

## Privacy

File contents are read and compared in your browser; the app does not upload them to a server. The app does not save the texts to persistent storage. Only the language preference is stored in the browser's `localStorage`.

Fonts are loaded from Google Fonts, so opening the app may make an external font request. System fonts are used if the fonts cannot be loaded.

## Technology and project structure

Diffora is built with HTML, CSS, and vanilla JavaScript. It uses no runtime JavaScript libraries or server application.

```text
Diffora/
├── README.md       # Turkish documentation
├── README.en.md    # English documentation
├── .gitignore
└── dist/
    ├── index.html  # Page and interface structure
    ├── style.css   # Theme, comparison colors, and responsive layout
    ├── diff.js     # Line matching and alignment algorithm
    ├── viewer-core.js # JSON/XML parsing and formatting
    ├── viewer.js      # Viewer tab and interactions
    ├── viewer.css     # Viewer layout and theme
    ├── i18n.js     # TR / EN / DE translations and language preference
    └── app.js      # File reading, comparison display, and interactions
```

The `dist/` directory contains directly editable application sources; it is not generated by a build step.

The comparison trims common leading and trailing lines. It uses longest common subsequence (LCS) for small sections and a bounded Myers search for large sections with sparse changes. Consecutive deletions and insertions become side-by-side rows. The core algorithm normalizes CRLF and CR line endings to LF.

## Limits

- File selection and drag and drop accept files up to **2 MB each**. The same file-size check does not apply to pasted text.
- Files are read as UTF-8 text. Binary files containing NUL characters are rejected. The app does not extract content from PDF, Word, or image files.
- After common leading and trailing lines are removed, comparisons whose `(n + 1) × (m + 1)` matrix exceeds **12 million cells** use the large-document algorithm. Its search steps and stored trace cells are each capped at 12 million. Large, substantially different files may still exceed the processing limit; in that case old results are cleared and smaller sections should be compared.
- Ignoring whitespace removes all whitespace characters within each line from the comparison; it does not analyze code semantics.
- This version is intended for text comparison. It does not resolve Git conflicts, merge files, provide syntax highlighting, or export edited files.

## Validation

You can check JavaScript syntax with Node.js:

```bash
node --check dist/app.js
node --check dist/diff.js
node --check dist/i18n.js
```

These commands do not replace browser testing. For an interface check, load the example, add and remove a line, compare identical and empty contents, and confirm that switching languages preserves the texts and comparison result.

## Deployment

Publish the **`dist/` directory** on any static web server. No build command is needed. Uploading the repository to GitHub does not automatically enable GitHub Pages.

## Regression tests

Run with Node.js without installing dependencies:

```bash
node tests/long-documents.cjs
node tests/regressions.cjs
```

To run the full suite including Viewer tests, use Node.js 24.15+ (24.x):

```bash
npm ci
npm test
```

`jsdom` is a development/test dependency only. The deployed app does not require npm or a backend.

Tests cover long documents, sparse changes, state after capacity errors, difference navigation, and ignored-whitespace highlighting. The first command generates sample TXT files in `fixtures/` and a `results.json` file. DOM state tests use a test model and do not replace real browser testing.

### Large Viewer output

Hidden code views are not rendered eagerly. Minifying updates only a bounded preview; copying uses the complete formatted result rather than shortened screen text. The copy button is disabled while a write is pending and a status message is shown. Editing the input prevents a stale copy-success message from appearing for new content.

`tests/viewer-large.cjs` covers pasted 1.85 MB JSON, a near-2 MB single-value JSON document, large XML, repeated minify/indent/copy cycles, complete downloads, and clipboard errors. `npm run bench:viewer` provides a Node/jsdom benchmark; it is not a measurement of browser layout or the real system clipboard.
