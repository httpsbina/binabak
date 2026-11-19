# Binafsha Bakhramova

A personal portfolio built as six familiar desktop apps: Home, Calendar, Notes, Health, Mail and Photos. Static HTML, CSS and JavaScript, ready for GitHub Pages.

## Preview

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open <http://127.0.0.1:4173>. No build step, API keys or backend are needed. Serve the directory over HTTP because the app loads its content from JSON.

## Content and assets

- `assets/content/portfolio.json` contains the approved project notes, résumé sections and nine portfolio emails.
- `assets/photos/library.json` defines the 16 photographs, original dimensions and three albums. Images stay in their original proportions.
- `assets/resume/Binafsha_Bakhramova_Resume.pdf` is the downloadable résumé.
- `assets/ui/` holds the original dock icons, stationery and interface icons.
- `assets/app.js` handles hash navigation, project dialogs, photo viewing, mail search, contextual replies and Sudoku.
- `assets/app.css` holds the palette, typography, responsive layouts and steady navigation without page zoom or fade effects.

The portfolio emails are curated project conversations. Reply opens the visitor’s email app addressed to Binafsha with the selected subject; the website does not send email or connect to a private inbox. Maps and plots are public local attachments and open without Slack access. GitHub attachments open the actual project or pull request.

## Checks

```sh
node --check assets/app.js
node scripts/check-site.mjs
```

Browser verification covered all six views at 1440, 1024 and 390 pixels; ten project dialogs; six résumé sections and the PDF download; replies from all nine emails; mail search; full-map fit and zoom; all 16 photos and album navigation; Sudoku validation, hints, reset and inline completion; and motion-free page changes. The checks inspect local asset requests and JavaScript errors as well as visible behavior.

## Hosting

Publish the repository root using GitHub Pages. All application and image paths are relative, so the site works at a custom domain or a repository subpath. Hash routes do not need server rewrites. Fonts load from Google Fonts with local system fallbacks.

The original website remains available in Git history. The local `_mockup/` directory is unrelated work and is not part of this implementation.
