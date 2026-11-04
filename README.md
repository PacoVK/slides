# Slides

Slides of my talks, published at [pascal.euhus.dev/slides](https://pascal.euhus.dev/slides/).

## Structure

- `_slides/` is published to GitHub Pages as is.
  - `_slides/index.html`: the landing page, hand-written.
  - `_slides/index/assets/`: its stylesheet, fonts (SIL OFL, licenses next to the files) and favicon.
  - `_slides/<talk>/`: one folder per talk, usually a PDF.
- `documentation_the_good/`, `_shared/`, `generator.js`: Asciidoctor/reveal.js sources of the 2022 HTML deck. Only its built output in `_slides/documentation_the_good/` is published.

The landing page uses the same neo-brutalism design as [pascal.euhus.dev](https://pascal.euhus.dev). `main.css` is a hand-copied subset of the website's `assets/css/main.css`: when the brand changes there, copy the changes here.

## Add a talk

1. Put the file at `_slides/<talk>/<file>.pdf`.
2. Add a card to `_slides/index.html`: copy the last `<li class="card">` and adjust number, title, subtitle, event and link. Card colours follow automatically.
3. Open a pull request. CI checks that every local link on the landing page resolves.

## Local preview

```sh
docker compose up
```

Then open <http://localhost:3000>. CSS changes are injected without a reload, HTML changes reload the page (browser-sync in a Node container, nothing to install locally).

## Deployment

`.github/workflows/deploy.yml` checks the landing page links and, on `main`, deploys `_slides/` with the official GitHub Pages actions. The repository's Pages source must be set to **GitHub Actions** (Settings → Pages). Dependabot keeps the actions and the Node image up to date.
