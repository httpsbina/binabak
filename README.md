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

After changing CSS, JavaScript or content JSON, run `node scripts/stamp-assets.mjs`. It adds content-based resource versions so returning visitors and preview tabs receive the current files. The site still needs no build step.

The optional browser regression suite uses an installed Playwright package:

```sh
node scripts/check-browser.cjs
```

Set `PLAYWRIGHT_MODULE` to a package path if it is installed outside this repository, `CHROMIUM_EXECUTABLE` to use an existing Chromium executable, or `PREVIEW_URL` to test a different local server. Screenshots and results go to a temporary directory; `REVIEW_ARTIFACTS` overrides that destination.

The November 23 cleanup passed 84 responsive layouts, 120 detailed views, 32 full-photo fits and 12 shared page entrances. It also checked search persistence and empty states, all contextual replies, PDF download, sticky project-dialog Close controls, attachment fit/zoom, Sudoku and reduced motion. Desktop and phone screenshots were visually reviewed.

The November 18 review covered all six pages across 14 viewport configurations, from a 320px phone to the 1683 × 3476 zoomed-out preview. It included 144 detailed layout and image-fit checks across the six résumé sections, nine emails, five photo-library/album views, ten project notes and attachment viewers. No tested horizontal text overflow, clipped calendar-card copy, failed local assets or JavaScript runtime errors remained.

Interaction checks covered the actual PDF download; every contextual email reply; search; map fit/zoom; all 16 full-size photographs on desktop and phone; album and keyboard navigation; Sudoku validation, repeated hints, reset and inline completion; and keyboard skip navigation. Full messages and long project notes remain scrollable inside their readers. Inbox snippets intentionally show one line.

## Visual review

The existing paper, Polaroid, scrapbook and Apple Photos references remain the aesthetic source: espresso grid, cream paper, oxblood accents, original typefaces and the user’s actual photographs. The review preserves those choices and adds no new decorative stickers. Page changes use a short 6px content entrance, while window frames stay still. The same entrance runs on all six app views, including the first visit. Hint and Reset do not animate. Reduced motion disables the entrance and hover movement.

- [Poolsuite](https://poolsuite.net/) was inspected for bounded desktop windows and persistent navigation.
- [Jessica Hische’s portfolio](https://jessicahische.is/) was inspected for clear artwork groupings and restrained interface typography.
- Apple’s [Notes view guidance](https://support.apple.com/en-ie/guide/notes/apd8b73d28be/mac) and the [USWDS typography guidance](https://designsystem.digital.gov/components/typography/) were consulted for readable grouping and clear separation. The Home paper notes are spaced so neither covers the other.
- Nielsen Norman Group’s guidance on [content dispersion](https://www.nngroup.com/articles/content-dispersion/) informed the limits on window height and empty space. Its [consistency guidance](https://www.nngroup.com/articles/consistency-and-standards/) informed shared navigation, controls and image treatment.

The resulting layout keeps the window and dock together, compacts short laptop views, adapts narrow calendar columns into readable day groups, keeps all 16 desktop photo thumbnails visible without changing image proportions, and prevents attachment thumbnails from crossing inbox rows. Phone layouts keep the existing collage materials in a readable vertical arrangement.

## November 23 research and cleanup

The supplied scrapbook and stationery references remain the visual direction. Research informed the organization and behavior rather than replacing the palette or adding arbitrary decorations:

- [Brittany Chiang](https://brittanychiang.com/) and [Maggie Appleton](https://maggieappleton.com/) were reviewed for clear hierarchy and expressive design with readable content. Notes now uses one text column with more space between projects, instead of packing research into adjacent columns.
- Nielsen Norman Group’s [visual design guidance](https://www.nngroup.com/articles/good-visual-design/) informed quieter grid lines, clearer secondary labels and consistent grouping. Secondary text is a darker warm gray; the cream, wine, sage and rose palette and existing typefaces remain.
- [Apple’s motion guidance](https://developer.apple.com/design/human-interface-guidelines/motion) informed retaining the brief, shared content entrance with stationary frames. There is no page zoom or fade, and reduced motion remains supported.
- [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) informed the secondary-text adjustment. This is a targeted readability improvement, not a claim of whole-site conformance.
- [MDN’s caching guidance](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching) informed content-based asset URLs after the actual preview was found to be using old cached scripts and styles.

Unused calendar modes, the misleading Today action and the decorative Notes formatting control were removed. Search now keeps its query when opening a result, gives a useful empty state and restores content when cleared. Compose starts a new message; Reply keeps the selected email subject. Long project dialogs keep Close within reach. Photo hover uses an outline without darkening the photographs. Folder and download controls use official Lucide icons, with their license included in `assets/ui/lucide-license.txt`.

## Hosting

Publish the repository root using GitHub Pages. All application and image paths are relative, so the site works at a custom domain or a repository subpath. Hash routes do not need server rewrites. Fonts load from Google Fonts with local system fallbacks.

The original website remains available in Git history. The local `_mockup/` directory is unrelated work and is not part of this implementation.
