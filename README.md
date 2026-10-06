# DSA Prep Tracker

A free, open-source, single-page tracker for data structures & algorithms interview preparation.
No build step, no backend, no account. Open `index.html` and start solving. Your progress is saved in your browser.

## Features

- **Topics tab**: 500 curated, de-duplicated LeetCode problems across 15 topics, each tagged
  Easy/Medium/Hard and Must / Should / Stretch, with a one-line pattern hint.
  Problems asked by many companies show an "N cos." note.
- **Companies tab**: pick a company (428 available) and see every problem it has asked, grouped by topic and
  sorted by how often it appears. Filter by time window (30 days / 3 months / 6 months / all time).
- **Progress tab**: overall percentage, must-do count, per-topic table (solved, Easy/Medium/Hard,
  must-do, in progress, revisit) with colour highlighting and a "next focus" suggestion.
- **Status per problem**: Not Started, In Progress, Solved, Revisit. Shared between the Topics and Companies tabs.
- **Search and filters**: by title, tag, difficulty, priority and status.
- **Light / dark theme**: follows your system by default, with a manual toggle that is remembered.
- **Backup**: export and import your progress as JSON, or download the per-topic report as CSV.
- Works offline and on mobile.

## Getting started

```bash
git clone <your-repo-url>
cd dsa-tracker
# open index.html in a browser, or serve the folder:
python3 -m http.server 8000     # then visit http://localhost:8000
```

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Page markup and tab/filter controls |
| `style.css` | Styles, including light/dark theme variables |
| `script.js` | App logic: rendering, filters, progress, theme, import/export |
| `data.js` | Curated topic list (`T`). Edit this to change the sheet |
| `companies.js` | Generated company-wise data (`GN`, `P`, `C`) |

Scripts are plain browser JavaScript loaded in this order: `data.js`, `companies.js`, `script.js`.

## Customising the problem list

Each topic in `data.js` has a name, a week label, a description and a list of questions:

```js
// [leetcodeNumber, title, difficulty, priority, note]
[217, "Contains Duplicate", "E", "M", "Set membership check"]
```

- `difficulty`: `E` (Easy), `M` (Medium), `H` (Hard)
- `priority`: `M` (Must), `S` (Should), `X` (Stretch)
- The LeetCode number is also the key used to store progress, so keep it unique across the whole sheet.
- The problem link is built from the title, so use LeetCode's exact title.

## Where progress is stored

Everything stays in your browser's `localStorage`; nothing is sent anywhere.

| Key | Content |
| --- | --- |
| `dsa_tracker_v1` | Status per problem |
| `dsa_theme` | Chosen theme (light/dark) |
| `dsa_ui_v1` | Last tab, company and time window |

Clearing site data erases your progress, so use **Export progress** on the Progress tab to keep a backup.

## Data sources and credits

- Company-wise problem lists come from
  [liquidslr/leetcode-company-wise-problems](https://github.com/liquidslr/leetcode-company-wise-problems)
  (data as of June 2025). That repository did not include a license file when this project was built,
  so check its terms before redistributing the generated `companies.js`.
- The curated sheet was assembled with reference to well-known public prep lists
  (Striver's A2Z / SDE sheet, NeetCode 150, CodeSmash) and company-frequency data. The problems themselves
  belong to LeetCode, and this project links to them rather than copying their content.
- This project is not affiliated with or endorsed by LeetCode, takeUforward, NeetCode or CodeSmash.
  Some linked problems are LeetCode Premium and need a subscription to view.

## Contributing

Contributions are welcome.

1. Fork the repository and create a branch.
2. Make your change. Typical contributions: add or remove problems in `data.js`, fix a wrong
   difficulty or pattern note, improve the UI, or fix bugs.
3. Open the page in a browser and check the Topics, Companies and Progress tabs in both themes.
4. Open a pull request describing what you changed and why.

Guidelines for the problem list: avoid duplicates and near-duplicates, prefer problems that teach a reusable
pattern or are commonly asked, and keep notes short.

## Roadmap ideas

- Company filter on the Progress tab
- Spaced-repetition reminders for "Revisit" problems
- Notes per problem
- More segment tree, DSU and advanced graph problems

## License

Released under the [MIT License](LICENSE). You are free to use, copy, modify and distribute this project.
The company data and the LeetCode problems retain their original owners' terms (see above).
