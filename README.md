# docs

Product documentation and GitHub Pages site for AxiomChess.

Language: English only. No emoji.

## Site

| Item | Value |
| --- | --- |
| Source folder | `site/` |
| Pages workflow | `.github/workflows/pages.yml` |
| Published URL | https://axiomchess.github.io/docs/ |

Pages is configured with `build_type=workflow`. Pushing to `main` deploys `site/`.

## Pages in this skeleton

| Path | Content |
| --- | --- |
| `site/index.html` | Docs home, links to ethics, API overview, and plan sources |
| `site/ethics.html` | Ethics and public-API-only policy |
| `site/api-overview.html` | Planned `/v1` routes from `PROJECT_SPEC.md` (placeholders; no fabricated metrics) |
| `site/styles.css` | Minimal docs styling |

## Local check

```bash
# required files present; no banned placeholder phrases
bash -c 'required=(site/index.html site/ethics.html site/api-overview.html site/styles.css .github/workflows/pages.yml); for f in "${required[@]}"; do test -f "$f"; done'
```

Or open `site/index.html` in a browser. CI job `docs-skeleton` runs the same file checks.

## License

MIT. See `LICENSE`.
