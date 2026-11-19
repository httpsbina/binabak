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
- `assets/app.css` holds the palette, typography, responsive layouts and steady frames with a brief content entrance and gentle dock hover, without page zoom or fade effects.

The portfolio emails are curated project conversations. Reply opens the visitor’s email app addressed to Binafsha with the selected subject; the website does not send email or connect to a private inbox. Maps and plots are public local attachments and open without Slack access. GitHub attachments open the actual project or pull request.

## Checks

```sh
node --check assets/app.js
node scripts/check-site.mjs
```

The November 18 review covered all six pages across 14 viewport configurations, from a 320px phone to the 1683 × 3476 zoomed-out preview. It included 144 detailed layout and image-fit checks across the six résumé sections, nine emails, five photo-library/album views, ten project notes and attachment viewers. No tested horizontal text overflow, clipped calendar-card copy, failed local assets or JavaScript runtime errors remained.

Interaction checks covered the actual PDF download; every contextual email reply; search; map fit/zoom; all 16 full-size photographs on desktop and phone; album and keyboard navigation; Sudoku validation, repeated hints, reset and inline completion; and keyboard skip navigation. Full messages and long project notes remain scrollable inside their readers. Inbox snippets intentionally show one line.

## Visual review

The existing paper, Polaroid, scrapbook and Apple Photos references remain the aesthetic source: espresso grid, cream paper, oxblood accents, original typefaces and the user’s actual photographs. The review preserves those choices and adds no new decorative stickers. Page changes use a short 6px content entrance, while window frames stay still. Hint and Reset do not animate. Reduced motion disables the entrance and hover movement.

- [Poolsuite](https://poolsuite.net/) was inspected for bounded desktop windows and persistent navigation.
- [Jessica Hische’s portfolio](https://jessicahische.is/) was inspected for clear artwork groupings and restrained interface typography.
- Nielsen Norman Group’s guidance on [content dispersion](https://www.nngroup.com/articles/content-dispersion/) informed the limits on window height and empty space. Its [consistency guidance](https://www.nngroup.com/articles/consistency-and-standards/) informed shared navigation, controls and image treatment.

The resulting layout keeps the window and dock together, compacts short laptop views, adapts narrow calendar columns into readable day groups, keeps all 16 desktop photo thumbnails visible without changing image proportions, and prevents attachment thumbnails from crossing inbox rows. Phone layouts keep the existing collage materials in a readable vertical arrangement.

## Hosting

Publish the repository root using GitHub Pages. All application and image paths are relative, so the site works at a custom domain or a repository subpath. Hash routes do not need server rewrites. Fonts load from Google Fonts with local system fallbacks.

The original website remains available in Git history. The local `_mockup/` directory is unrelated work and is not part of this implementation.
