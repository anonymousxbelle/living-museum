# The Living Museum

A creative arts class project: **31 artists, 5 galleries, 93 featured works**, with an atmospheric, imaginary-museum presentation made entirely from **real stock photography, real artist information, and links/previews to actual artworks and performances**. No AI-generated imagery or illustrations are used.

## Open the museum

### Fastest option
Open **`museum-preview.html`** in your browser. This is a single, self-contained HTML file with the layout, styles, artist data, and navigation. Keep an internet connection for museum photography and source-hosted previews.

### Recommended for editing / publishing
The main site lives in `index.html`, `src/data.js`, `src/app.js`, and `src/styles.css`. **No npm install or build step is required.**

On Windows with Python installed, double-click `start-museum.bat`. Alternatively, in a terminal within this folder:

```bash
python -m http.server 8000
```

Then visit **http://localhost:8000**. You can also use a VS Code Live Server extension.

### Publish on GitHub Pages

1. Create a new public GitHub repository (for example, `living-museum`).
2. Upload `index.html`, `src/`, `assets/`, and `.nojekyll` to the repository root. (`museum-preview.html` is optional.)
3. In **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. Open the GitHub Pages URL after deployment finishes.

All links use `#` routing, so gallery and artist navigation works on GitHub Pages without custom rewrites.

## Organization

- **The Art of Sound:** 6 artists
- **The Art of Performance:** 4 artists
- **The Art of Words:** 9 artists
- **Visual Arts:** 10 artists
- **The Art of Form:** 2 artists

Each artist has a brief biography, three named works with explanations and dates, and access to source materials.

## Authenticity, image rights, and media availability

- **Gallery photographs:** sourced from Unsplash and Pexels; credits are on the site's About & Credits page, along with licensing references.
- **Artist portraits and original art:** the site dynamically retrieves previews through the English Wikipedia API, then checks whether the file has a **Wikimedia Commons reuse license**. Only files identified as freely reusable are embedded. Click through to the file page for author and license specifics.
- **Literary and theatrical works:** live cover previews (when the correct edition is returned) from Open Library. Covers are copyrighted by their respective rights holders; Open Library encourages direct links to its Covers API for public-facing displays. Each card links to an Open Library search so viewers can inspect editions.
- **Music:** source-hosted YouTube videos are embedded only for manually verified recordings. For other works, the cards link to a search for genuine recordings, rather than claiming that an unrelated or unverified recording is authentic.
- Some contemporary or copyrighted artworks **cannot be embedded** without permission. Those entries retain their original title, date, description, and a source/discovery link. Do not re-upload unauthorized images in order to fill gaps.
- Browsers with strict tracking/privacy protections, blocked APIs, or no internet connection may not show remote images. In that case the museum displays styled typography and source links instead of made-up pictures.
- Wikipedia gives introductory context, not a substitute for scholarly references; verify deeper claims against primary collections and archives before final class submission.

## Editing the content

All galleries and artists are in **`src/data.js`**. Every artist has `id`, `name`, `years`, `role`, `bio`, `wikipedia`, `works`, and `gallery`. All 93 works are already defined; edit the dates, background texts, or selected works in one place. The site automatically updates gallery counts and exhibit cards.

`src/styles.css` contains the visual theme and animations. There is a `prefers-reduced-motion` rule for accessibility. `src/app.js` handles routing, authentic-media lookups, the lightbox, and navigation.

Whenever you edit a source file, rebuild the optional standalone `museum-preview.html` using `python tools/bundle.py`. The normal multi-file site (`index.html`) requires no rebuild.

## Starter sources and APIs

- Unsplash license: https://unsplash.com/license
- Pexels license: https://www.pexels.com/license/
- Wikimedia Commons reuse: https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia
- MediaWiki cross-site API: https://www.mediawiki.org/wiki/API:Cross-site_requests
- Open Library Covers API: https://openlibrary.org/dev/docs/api/covers
- Open Library Search API: https://openlibrary.org/dev/docs/api/search
- Ray Charles official lyric video (Hit the Road Jack): https://www.youtube.com/watch?v=uSiHqxgE2d0
- Vadim Chaimovich Chopin nocturne recording: https://www.youtube.com/watch?v=-PaYq5Pt228

## Scope

This is the initial museum version. There is **no passport, game, quiz, or constellation**. The focus is the entrance, five gallery environments, 31 artist exhibits, authentic source access to 93 works, and subtle atmospheric motion.
