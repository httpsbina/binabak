# Binafsha Bakhramova — Portfolio

Interactive personal portfolio built as a static site and packaged for GitHub Pages.

## Publish on GitHub Pages

1. Create a GitHub repository.
   - For the root personal site, name it `httpsbina.github.io`.
   - Or use any repository name (for example `portfolio`) for a project site.
2. Upload **everything in this folder** to the repository root. `index.html` must stay at the top level.
3. Commit to `main`.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select **main** and **/(root)**, then save.
7. Give the first deployment a minute or two, then open the URL GitHub shows in the Pages settings.

If the repository is named `httpsbina.github.io`, the site will use the root account Pages URL. If it has another repository name, GitHub Pages normally publishes it under that repository path.

## Folder structure

```text
.
├── index.html
├── .nojekyll
├── README.md
├── STACK.md
└── assets/
    ├── common-senses/
    │   ├── community-presentation.pptx
    │   └── live-map.html
    ├── projects/
    │   ├── gerrymander-maps.png
    │   ├── nyu-poster.png
    │   └── tbca-site.png
    └── resume/
        └── Binafsha_Bakhramova_Resume.pdf
```

## Editing later

Most of the visual experience is intentionally self-contained in `index.html`, including the photo experience, decorative art, map artwork, and voicemail audio. That reduces the chance of broken assets on GitHub Pages.

The files under `assets/` are the external documents/images that the site links to directly. Keep their paths intact unless you also update the corresponding links in `index.html`.

## No build step

There is no npm install, bundler, framework build, or server required. GitHub Pages can serve the files directly from the repository root.
