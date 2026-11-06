import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "site")

const navGroups = [
  [
    "Start",
    [
      ["index.html", "Wiki home"],
      ["getting-started.html", "Getting started"],
      ["limits.html", "Limits and non-goals"],
    ],
  ],
  [
    "Product",
    [
      ["ethics.html", "Ethics"],
      ["privacy.html", "Privacy"],
      ["methodology.html", "Methodology"],
      ["scoring-bands.html", "Scoring bands"],
      ["architecture.html", "Architecture"],
    ],
  ],
  [
    "API and sites",
    [
      ["api-overview.html", "API reference"],
      ["api-quotas.html", "Auth and quotas"],
      ["supported-sites.html", "Supported sites"],
      ["self-host.html", "Self-host"],
    ],
  ],
  ["Reference", [["glossary.html", "Glossary"]]],
]

const navHtml = (current) =>
  navGroups
    .map(([label, links]) => {
      const lis = links
        .map(([href, text]) => {
          const cur = href === current ? ' aria-current="page"' : ""
          return `<li><a href="${href}"${cur}>${text}</a></li>`
        })
        .join("\n")
      return `<div class="wiki-nav-group"><p class="wiki-nav-label">${label}</p><ul>\n${lis}\n</ul></div>`
    })
    .join("\n")

const pagerHtml = (prev, next) => {
  const left = prev
    ? `<a href="${prev[0]}">Previous: ${prev[1]}</a>`
    : "<span></span>"
  const right = next
    ? `<a href="${next[0]}">Next: ${next[1]}</a>`
    : "<span></span>"
  return `<nav class="wiki-pager" aria-label="Page">${left}${right}</nav>`
}

const shell = ({ file, title, body, pager }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} -- AxiomChess Docs</title>
  <meta name="description" content="AxiomChess product wiki: calibrated fair-play analysis for finished games. English only.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600;700&family=Syne:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  <link rel="icon" href="logo.svg" type="image/svg+xml">
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <header class="wiki-top">
    <p class="brand">
      <a href="index.html" aria-label="AxiomChess wiki home">
        <img src="logo.svg" width="24" height="24" alt="">
        AxiomChess
      </a>
    </p>
    <ul class="wiki-top-links" aria-label="Quick links">
      <li><a href="getting-started.html">Start</a></li>
      <li><a href="api-overview.html">API</a></li>
      <li><a href="methodology.html">Methodology</a></li>
      <li><a href="https://github.com/AxiomChess">GitHub</a></li>
    </ul>
  </header>
  <div class="wiki-frame">
    <nav class="wiki-nav" aria-label="Wiki">
${navHtml(file)}
    </nav>
    <div class="wiki-content">
      <main id="main-content" class="wiki-main" tabindex="-1">
${body}
${pager || ""}
      </main>
    </div>
  </div>
  <footer class="wiki-footer">
    <div class="wiki-footer-inner">
      <p>MIT first-party docs. Finished games only. Public-API-only. English only.</p>
      <p><a href="index.html">Wiki home</a> · <a href="https://github.com/AxiomChess">GitHub org</a></p>
    </div>
  </footer>
</body>
</html>
`

const write = (file, title, body, prev, next) => {
  const html = shell({
    file,
    title,
    body,
    pager: pagerHtml(prev, next),
  })
  fs.writeFileSync(path.join(root, file), html)
  console.log("wrote", file)
}

write(
  "index.html",
  "Wiki home",
  `
<div class="wiki-hero">
  <p class="wiki-hero-kicker">Product wiki</p>
  <p class="wiki-hero-brand">AxiomChess</p>
  <p class="wiki-hero-lead">Free and open-source chess fair-play analysis for finished games. Engine-backed reports with suspicion bands, uncertainty, and methodology notes -- never a raw accusation. This wiki is the long-form reference for operators, integrators, and players.</p>
  <hr class="wiki-hero-rule" aria-hidden="true">
</div>
<h1>Product wiki</h1>
<p class="lead">AxiomChess analyzes <strong>finished</strong> public games or user-supplied PGN. It is an educational analysis aid, not a federation tribunal and not live cheat detection.</p>
<div class="toc" aria-label="On this page">
  <p>On this page</p>
  <ol>
    <li><a href="#what">What AxiomChess is</a></li>
    <li><a href="#read">Where to read next</a></li>
    <li><a href="#pipeline">Analysis pipeline (summary)</a></li>
    <li><a href="#repos">Repositories</a></li>
    <li><a href="#truth">Truthfulness rules for this wiki</a></li>
  </ol>
</div>
<h2 id="what">What AxiomChess is</h2>
<p>AxiomChess offers a public HTTP API, a web app, and Stockfish-backed feature extraction that produces a calibrated suspicion score with an uncertainty interval. Every result carries methodology notes and false-positive guidance.</p>
<p>Supported ingest in v1:</p>
<ul>
  <li>Public game URL (Lichess or Chess.com, allowlisted hosts only)</li>
  <li>PGN paste (no site call)</li>
  <li>Username recent public games (paged list; optional analyze)</li>
</ul>
<p>Bands are only <code>low</code>, <code>elevated</code>, <code>high</code>, and <code>inconclusive</code>. The product never emits a definitive guilt label.</p>
<div class="callout">
  <p><strong>Public-API-only.</strong> Lichess official public API and Chess.com Published-Data API only. No private games, no login scraping, no rate-limit evasion.</p>
</div>
<h2 id="read">Where to read next</h2>
<ul class="card-list">
  <li><a href="getting-started.html">Getting started<span>Analyze a game in the web app or call the API health route</span></a></li>
  <li><a href="ethics.html">Ethics<span>Hard rules for fair access and report integrity</span></a></li>
  <li><a href="methodology.html">Methodology<span>engine-v1 and calibration-v1 formula, priors, uncertainty</span></a></li>
  <li><a href="api-overview.html">API reference<span>All /v1 routes, errors, OpenAPI pointer</span></a></li>
  <li><a href="architecture.html">Architecture<span>Multi-repo services, pipeline, storage</span></a></li>
  <li><a href="self-host.html">Self-host<span>Local API, Postgres, optional Redis, workers</span></a></li>
</ul>
<h2 id="pipeline">Analysis pipeline (summary)</h2>
<ol>
  <li><strong>Ingest</strong> -- URL, PGN, or username via adapters; SSRF allowlist for URLs.</li>
  <li><strong>Normalize</strong> -- canonical PGN + metadata (<code>NormalizedGame</code>).</li>
  <li><strong>Engine eval</strong> -- Stockfish UCI, MultiPV 3, depth policy <code>engine-v1</code>.</li>
  <li><strong>Features</strong> -- top-1/top-3 match, CPL, timing if clocks, opening-book boundary.</li>
  <li><strong>Calibrate</strong> -- score S in [0,1], half-width, ordinal band.</li>
  <li><strong>Output</strong> -- <code>AnalysisResultV1</code> JSON + human report.</li>
</ol>
<p>Full detail: <a href="methodology.html">Methodology</a> and <a href="architecture.html">Architecture</a>.</p>
<h2 id="repos">Repositories</h2>
<table>
  <caption>GitHub org AxiomChess</caption>
  <thead><tr><th>Repo</th><th>Role</th></tr></thead>
  <tbody>
    <tr><td><code>web</code></td><td>Marketing site, analyze UI, reports</td></tr>
    <tr><td><code>api</code></td><td>Public HTTP API, quotas, jobs, Postgres</td></tr>
    <tr><td><code>analyzer</code></td><td>Stockfish workers, features, scoring</td></tr>
    <tr><td><code>adapters</code></td><td>Site ingest + PGN normalize + fixtures</td></tr>
    <tr><td><code>design</code></td><td>Ink and Felt tokens and brand assets</td></tr>
    <tr><td><code>docs</code></td><td>This wiki (GitHub Pages)</td></tr>
    <tr><td><code>.github</code></td><td>Org templates and organization homepage profile</td></tr>
  </tbody>
</table>
<p>Org homepage: <a href="https://github.com/AxiomChess">https://github.com/AxiomChess</a>. Pages URL: <a href="https://axiomchess.github.io/docs/">https://axiomchess.github.io/docs/</a>.</p>
<h2 id="truth">Truthfulness rules for this wiki</h2>
<ul>
  <li>English only. No emoji.</li>
  <li>Do not invent endpoints, fields, licenses, uptime SLAs, or detection guarantees.</li>
  <li>When plan files and code disagree, update docs to match implemented packages after verification.</li>
  <li>Latency or availability SLAs are not claimed on these pages.</li>
</ul>
`,
  null,
  ["getting-started.html", "Getting started"],
)

write(
  "getting-started.html",
  "Getting started",
  `
<h1>Getting started</h1>
<p class="lead">Use the web app for interactive analysis, or call the HTTP API from your own tooling. Both paths share the same ethics constraints and band vocabulary.</p>
<div class="toc"><p>On this page</p><ol>
  <li><a href="#web">Web app</a></li>
  <li><a href="#api">API quick path</a></li>
  <li><a href="#inputs">Accepted inputs</a></li>
  <li><a href="#read-report">How to read a report</a></li>
  <li><a href="#next">Next reading</a></li>
</ol></div>
<h2 id="web">Web app</h2>
<ol>
  <li>Open the AxiomChess web deployment (local <code>pnpm dev</code> in repo <code>web</code>, or your hosted URL).</li>
  <li>Go to <code>/analyze</code>.</li>
  <li>Choose public game URL, PGN paste, or username lookup for <code>lichess</code> / <code>chesscom</code>.</li>
  <li>Wait for the job to complete, then open <code>/report/{id}</code>.</li>
</ol>
<p>Set <code>NEXT_PUBLIC_API_BASE_URL</code> to a running API. Private or unavailable games fail with a clear error; the UI does not encourage private-game access.</p>
<h2 id="api">API quick path</h2>
<pre><code>GET /v1/health
# expects JSON with status, service, apiVersion

POST /v1/analyze/pgn
Content-Type: application/json
{ "pgn": "&lt;canonical or near-canonical PGN&gt;" }

GET /v1/analyses/{id}
</code></pre>
<p>Anonymous default quota: 10 analyses / day / IP, burst 2 / minute. Details: <a href="api-quotas.html">Auth and quotas</a>.</p>
<p>Machine-readable contract: <code>GET /v1/openapi.json</code>.</p>
<h2 id="inputs">Accepted inputs</h2>
<table>
  <thead><tr><th>Input</th><th>Behavior</th></tr></thead>
  <tbody>
    <tr><td>Game URL</td><td>Host must be allowlisted; adapter fetches public game; fails closed if private</td></tr>
    <tr><td>PGN paste</td><td>Validated and normalized; no upstream site call</td></tr>
    <tr><td>Username</td><td>Lists recent public finished games; optional analyze queue</td></tr>
  </tbody>
</table>
<p>Standard chess only in v1. Unsupported variants return a clear error.</p>
<h2 id="read-report">How to read a report</h2>
<ul>
  <li><strong>Band</strong> -- ordinal label from calibrated score and uncertainty gates.</li>
  <li><strong>Score S</strong> -- continuous value in [0, 1] under policy <code>calibration-v1</code>.</li>
  <li><strong>Uncertainty</strong> -- half-width; if too wide or sample too small, band is <code>inconclusive</code>.</li>
  <li><strong>Features</strong> -- match rates, CPL, timing when clocks exist, book boundary.</li>
  <li><strong>Notes</strong> -- methodology and false-positive warnings always present.</li>
</ul>
<p>Full formula: <a href="methodology.html">Methodology</a>. Band cut points: <a href="scoring-bands.html">Scoring bands</a>.</p>
<h2 id="next">Next reading</h2>
<ul>
  <li><a href="ethics.html">Ethics and public-API-only policy</a></li>
  <li><a href="privacy.html">Privacy notice</a></li>
  <li><a href="api-overview.html">API reference</a></li>
</ul>
`,
  ["index.html", "Wiki home"],
  ["limits.html", "Limits and non-goals"],
)

write(
  "limits.html",
  "Limits and non-goals",
  `
<h1>Limits and non-goals</h1>
<p class="lead">AxiomChess is intentionally narrow. This page lists what the product will not do in v1, so operators and users do not expect tribunal-grade findings.</p>
<div class="toc"><p>On this page</p><ol>
  <li><a href="#non-goals">Non-goals</a></li>
  <li><a href="#sample">Sample-size and data limits</a></li>
  <li><a href="#legal">Legal and federation posture</a></li>
  <li><a href="#claims">Claims this wiki will not make</a></li>
</ol></div>
<h2 id="non-goals">Non-goals</h2>
<ul>
  <li><strong>Live-game monitoring or live fair-play analysis.</strong> The API and adapters analyze finished public games or user-supplied PGN only. Live streams, ongoing games, and real-time move watching are out of scope and will not be added.</li>
  <li>Account takeover, credential stuffing, captcha bypass, or any private-game access.</li>
  <li>Scraping HTML behind login, circumventing rate limits, or violating site Terms of Service.</li>
  <li>Definitive guilt labels without uncertainty and methodology.</li>
  <li>Closed-source engine forks or undistributable nets.</li>
  <li>Social features as a primary product (comments, reputation scores, public shaming feeds).</li>
  <li>Guaranteeing legal findings for federations or platforms.</li>
</ul>
<div class="callout">
  <p><strong>Finished games only.</strong> Requests that ask the product to watch or score a game still in progress are rejected by product policy. Use completed games via public URL, PGN, or username archives.</p>
</div>
<h2 id="sample">Sample-size and data limits</h2>
<p>Reports become <code>inconclusive</code> when uncertainty half-width is greater than 0.20 or usable plies after book exclusion are fewer than 20. Missing clocks widen uncertainty relative to a clocked peer of similar length. Book-heavy openings reduce usable sample size by design.</p>
<h2 id="legal">Legal and federation posture</h2>
<p>AxiomChess is an educational analysis aid. It does not replace human investigation, site fair-play teams, or arbitration processes. Prefer analyzing a player's own games or clearly public games.</p>
<h2 id="claims">Claims this wiki will not make</h2>
<ul>
  <li>No guaranteed detection rates.</li>
  <li>No invented uptime percentages.</li>
  <li>No fabricated latency SLAs on these pages.</li>
  <li>No third-party license text invented without upstream verification.</li>
</ul>
`,
  ["getting-started.html", "Getting started"],
  ["ethics.html", "Ethics"],
)

write(
  "ethics.html",
  "Ethics",
  `
<h1>Ethics and public-API-only policy</h1>
<p class="lead">AxiomChess analyzes finished games using engine-backed features and a calibrated suspicion score with uncertainty. It is an educational analysis aid, not a tribunal. Reports never output a definitive guilt label.</p>
<div class="toc"><p>On this page</p><ol>
  <li><a href="#hard">Hard rules</a></li>
  <li><a href="#lichess">Lichess</a></li>
  <li><a href="#chesscom">Chess.com</a></li>
  <li><a href="#reports">Report integrity</a></li>
  <li><a href="#ui">UI and copy requirements</a></li>
  <li><a href="#extension">Adding another site</a></li>
</ol></div>
<h2 id="hard">Hard rules</h2>
<ol>
  <li>Use only documented public endpoints and user-supplied or public PGNs.</li>
  <li>Lichess: official public API at <code>https://lichess.org</code> only. Respect one-request-at-a-time guidance; after HTTP 429 wait at least one minute before retry (per Lichess API tips).</li>
  <li>Chess.com: Published-Data API base <code>https://api.chess.com/pub/</code> only. Public read-only data; no private chat, conditional moves, or authenticated-only surfaces.</li>
  <li>Include another site only when a legal public route or standard public PGN export is documented. If none exists, do not add an adapter.</li>
  <li>No account takeover, no captcha bypass, no private game access, no ToS evasion.</li>
  <li>Reports must present uncertainty. Never output a definitive guilt label without a clear confidence band and methodology note.</li>
  <li>Prefer analyzing a player's own games or clearly public games. UI copy must state limits and false-positive risk.</li>
</ol>
<div class="callout">
  <p>These rules are non-negotiable for first-party code and for documentation examples. Demo scripts must not teach private-game scraping.</p>
</div>
<h2 id="lichess">Lichess</h2>
<p>Official docs: <a href="https://lichess.org/api">https://lichess.org/api</a>. Tips: <a href="https://lichess.org/page/api-tips">https://lichess.org/page/api-tips</a>.</p>
<ul>
  <li>Export user games and single-game export endpoints as documented in the official OpenAPI.</li>
  <li>Throttle: one request at a time from a worker; on 429 wait at least 60 seconds before retry.</li>
  <li>CI and unit tests use recorded fixtures; no live network required for green builds.</li>
</ul>
<h2 id="chesscom">Chess.com</h2>
<p>Published-Data API announcement and docs govern the base <code>https://api.chess.com/pub/</code>. Archives list, monthly games JSON, and monthly PGN paths are used as documented. PubAPI has no single-game endpoint; AxiomChess composite ids use <code>username/YYYY/MM/id</code> from list results.</p>
<h2 id="reports">Report integrity</h2>
<ul>
  <li>Bands only: <code>low</code>, <code>elevated</code>, <code>high</code>, <code>inconclusive</code>.</li>
  <li>Always attach methodology note, policy id, false-positive warning, and sample-size caveats.</li>
  <li>Do not change calibration cut points to make fixtures pass; cut a new policy version instead.</li>
</ul>
<p>See <a href="methodology.html">Methodology</a> and <a href="scoring-bands.html">Scoring bands</a>.</p>
<h2 id="ui">UI and copy requirements</h2>
<ul>
  <li>English only. No emoji.</li>
  <li>Clear errors for <code>private_or_unavailable</code> and <code>rate_limited</code>.</li>
  <li>No copy that encourages private-game access.</li>
  <li>Landing and report surfaces must keep brand-first, anti-slop visual rules from the design system.</li>
</ul>
<h2 id="extension">Adding another site</h2>
<p>Implement <code>SiteAdapter</code> with fixtures, allowlisted hosts, and documented public access only. Register in the adapters manifest consumed by <code>GET /v1/sites</code>. If a site has no legal public route, do not ship an adapter.</p>
`,
  ["limits.html", "Limits and non-goals"],
  ["privacy.html", "Privacy"],
)

write(
  "privacy.html",
  "Privacy",
  `
<h1>Privacy notice</h1>
<p class="lead">AxiomChess stores only what is needed to run analysis jobs and honor retention and erasure. The product does not sell personal data.</p>
<div class="toc"><p>On this page</p><ol>
  <li><a href="#what">What is stored</a></li>
  <li><a href="#retention">Retention</a></li>
  <li><a href="#erasure">Erasure</a></li>
  <li><a href="#keys">API keys</a></li>
  <li><a href="#logs">Logs</a></li>
  <li><a href="#basis">Processing basis (planning)</a></li>
</ol></div>
<h2 id="what">What is stored</h2>
<ul>
  <li>Analysis inputs and results (including normalized PGN while retained).</li>
  <li>Optional API key metadata (hashed secrets only).</li>
  <li>Request logs with request identifiers; IP retention is limited by operator configuration.</li>
</ul>
<p>Do not invent additional personal data categories in integrations without documenting them here.</p>
<h2 id="retention">Retention</h2>
<p>Default retention for analyses is <strong>30 days</strong> (<code>ANALYSIS_RETENTION_DAYS</code>). Operators may configure a different TTL; document the deployed value in your ops runbook. Expired analyses are not returned by <code>GET /v1/analyses/{id}</code> (404).</p>
<h2 id="erasure">Erasure</h2>
<p>Clients and operators can hard-delete an analysis with:</p>
<pre><code>DELETE /v1/analyses/{id}
</code></pre>
<p>Successful erasure responds with HTTP 204. After deletion, GET returns 404.</p>
<h2 id="keys">API keys</h2>
<p>Keys are hashed at rest with SHA-256 over <code>pepper:rawKey</code>. Raw keys are never stored. Invalid or revoked keys return 401 with <code>code: invalid_api_key</code>. Public self-serve key minting is out of scope for v1.</p>
<h2 id="logs">Logs</h2>
<p>Structured logs use <code>requestId</code>. Info-level logs use PGN content hashes rather than raw PGN bodies by default. Do not log secrets.</p>
<h2 id="basis">Processing basis (planning)</h2>
<p>Legal basis for public game analysis is processing of publicly available game data and user-supplied PGN, with minimization and erasure of stored analyses by id. This notice is not legal advice; operators should review their jurisdiction.</p>
<p class="callout"><strong>Summary:</strong> AxiomChess does not sell personal data. Retention defaults to 30 days. Erasure is available via <code>DELETE /v1/analyses/{id}</code>.</p>
`,
  ["ethics.html", "Ethics"],
  ["methodology.html", "Methodology"],
)

write(
  "methodology.html",
  "Methodology",
  `
<h1>Methodology and calibration</h1>
<p class="lead">Policy ids: engine policy <code>engine-v1</code> and calibration policy <code>calibration-v1</code>. This page freezes the documented formula used by the analyzer package. Do not change cut points to make fixtures pass; cut a new policy id instead.</p>
<div class="toc"><p>On this page</p><ol>
  <li><a href="#engine">Engine policy engine-v1</a></li>
  <li><a href="#features">Features</a></li>
  <li><a href="#priors">Planning prior anchors</a></li>
  <li><a href="#score">Score formula</a></li>
  <li><a href="#uncertainty">Uncertainty</a></li>
  <li><a href="#bands">Band mapping</a></li>
  <li><a href="#notes">Mandatory notes</a></li>
  <li><a href="#false">False-positive guidance</a></li>
</ol></div>
<h2 id="engine">Engine policy engine-v1</h2>
<ul>
  <li>Engine: official Stockfish via UCI (pinned release documented in analyzer NOTICE).</li>
  <li>MultiPV = 3.</li>
  <li>Depth = 18 for standard time controls; Depth = 16 for bullet when that policy branch runs.</li>
  <li>Threads and Hash are worker-sized and recorded in result metadata.</li>
</ul>
<p>Opening book: snapshot <code>opening-book-v1</code> from lichess-org/chess-openings (CC0). Book plies are excluded from match statistics; the novelty ply is reported.</p>
<h2 id="features">Features</h2>
<table>
  <thead><tr><th>Feature</th><th>Role</th></tr></thead>
  <tbody>
    <tr><td><code>match.top1Rate</code></td><td>Primary engine-likeness signal</td></tr>
    <tr><td><code>match.top3Rate</code></td><td>Secondary match signal</td></tr>
    <tr><td><code>cpl.average</code></td><td>Low average CPL raises suspicion</td></tr>
    <tr><td><code>match.usablePlies</code></td><td>Sample size for uncertainty and inconclusive gate</td></tr>
    <tr><td><code>timing.fastHighMatchStreakMax</code></td><td>Optional boost when clocks exist</td></tr>
    <tr><td>timing null vs present</td><td>Widens uncertainty when clocks are missing</td></tr>
  </tbody>
</table>
<h2 id="priors">Planning prior anchors</h2>
<p>These are planning priors for reproducibility. They are not claimed as empirical population estimates from a labeled corpus.</p>
<table>
  <thead><tr><th>Anchor</th><th>Value</th></tr></thead>
  <tbody>
    <tr><td><code>PRIOR_TOP1</code></td><td>0.42</td></tr>
    <tr><td><code>PRIOR_TOP3</code></td><td>0.68</td></tr>
    <tr><td><code>CPL_SOFT_CAP</code></td><td>200</td></tr>
    <tr><td><code>TIMING_STREAK_CAP</code></td><td>12</td></tr>
    <tr><td><code>TIMING_BOOST_MAX</code></td><td>0.12</td></tr>
    <tr><td><code>UNCERTAINTY_K</code></td><td>0.75</td></tr>
    <tr><td><code>MISSING_CLOCK_EXTRA_HW</code></td><td>0.05</td></tr>
  </tbody>
</table>
<h2 id="score">Score formula</h2>
<p>All arithmetic is IEEE-754 float64. Clamp x to [0, 1].</p>
<ol>
  <li><code>cplSignal = 1 - clamp(cpl.average / CPL_SOFT_CAP, 0, 1)</code></li>
  <li><code>matchSignal = 0.55 * top1Rate + 0.20 * top3Rate + 0.25 * cplSignal</code></li>
  <li>If timing present: <code>timingBoost = TIMING_BOOST_MAX * clamp(fastHighMatchStreakMax / TIMING_STREAK_CAP, 0, 1)</code>; else 0.</li>
  <li><code>S = clamp(matchSignal + timingBoost, 0, 1)</code></li>
</ol>
<p>PRIOR_TOP1 / PRIOR_TOP3 are design anchors; the v1 blend uses raw rates directly so the score stays monotone in match rates.</p>
<h2 id="uncertainty">Uncertainty</h2>
<ol>
  <li>If usablePlies &lt;= 0: halfWidth = 0.5, interval [0, 1].</li>
  <li>Else baseHw = UNCERTAINTY_K / sqrt(usablePlies); halfWidth = min(0.5, baseHw + (timing ? 0 : MISSING_CLOCK_EXTRA_HW)).</li>
  <li>Interval: low = max(0, S - halfWidth), high = min(1, S + halfWidth).</li>
</ol>
<h2 id="bands">Band mapping</h2>
<p>See <a href="scoring-bands.html">Scoring bands</a> for the frozen cut points (0.45 / 0.70 / half-width 0.20 / usable plies 20).</p>
<h2 id="notes">Mandatory notes</h2>
<p>Every result includes methodology identity (policy ids), false-positive warning, and sample-size caveats (short games, missing clocks, book length).</p>
<h2 id="false">False-positive guidance</h2>
<ul>
  <li>Strong players can match engine lines without assistance.</li>
  <li>Prepared openings inflate early match rates; book exclusion mitigates but does not eliminate theory effects.</li>
  <li>Missing clocks remove timing evidence and widen uncertainty.</li>
  <li>Short games often land in <code>inconclusive</code> by design.</li>
</ul>
<p>Authoritative freeze text also lives in <code>analyzer/docs/calibration-v1.md</code>.</p>
`,
  ["privacy.html", "Privacy"],
  ["scoring-bands.html", "Scoring bands"],
)

write(
  "scoring-bands.html",
  "Scoring bands",
  `
<h1>Scoring bands</h1>
<p class="lead">Ordinal bands exist for UI clarity. They are not legal findings. Only four labels are allowed.</p>
<div class="toc"><p>On this page</p><ol>
  <li><a href="#vocab">Vocabulary</a></li>
  <li><a href="#cuts">Frozen cut points</a></li>
  <li><a href="#examples">Illustrative reading</a></li>
  <li><a href="#ui">UI requirements</a></li>
</ol></div>
<h2 id="vocab">Vocabulary</h2>
<table>
  <thead><tr><th>Band</th><th>Meaning in product language</th></tr></thead>
  <tbody>
    <tr><td><code>low</code></td><td>Score below elevated threshold with enough usable plies and narrow enough uncertainty</td></tr>
    <tr><td><code>elevated</code></td><td>Mid band; warrants careful human reading of features and notes</td></tr>
    <tr><td><code>high</code></td><td>Score at or above high threshold under the same sample gates</td></tr>
    <tr><td><code>inconclusive</code></td><td>Uncertainty too wide or usable sample too small</td></tr>
  </tbody>
</table>
<p>Never emit a definitive guilt label. Never invent a fifth band name in first-party UI.</p>
<h2 id="cuts">Frozen cut points</h2>
<p>From PROJECT_SPEC and calibration-v1. Let S be the score in [0, 1] and H the uncertainty half-width.</p>
<ol>
  <li>If H &gt; 0.20 OR usablePlies &lt; 20 =&gt; <code>inconclusive</code></li>
  <li>Else if S &lt; 0.45 =&gt; <code>low</code></li>
  <li>Else if S &lt; 0.70 =&gt; <code>elevated</code></li>
  <li>Else =&gt; <code>high</code></li>
</ol>
<div class="callout"><p>Do not move these cut points to make acceptance fixtures pass. Fix code or mark a fixture out of scope with reason. A new calibration policy id is required for intentional prior changes.</p></div>
<h2 id="examples">Illustrative reading</h2>
<ul>
  <li>A short amateur game with few usable plies often returns <code>inconclusive</code> even if match rates look unusual.</li>
  <li>A long game with clocks and moderate match rates may land <code>low</code> or <code>elevated</code> depending on S.</li>
  <li>Missing clocks increase half-width relative to an otherwise similar clocked game.</li>
</ul>
<p>Acceptance fixtures A1-A5 are documented in analyzer acceptance notes; this wiki does not invent new numeric outcomes.</p>
<h2 id="ui">UI requirements</h2>
<ul>
  <li>Show band, score, uncertainty, and methodology notes together.</li>
  <li>Board replay and charts are optional companions on the report page; they must not replace uncertainty copy.</li>
  <li>Landing marketing may show a stylized report sample; it must not claim live detection.</li>
</ul>
`,
  ["methodology.html", "Methodology"],
  ["architecture.html", "Architecture"],
)

write(
  "architecture.html",
  "Architecture",
  `
<h1>Architecture</h1>
<p class="lead">AxiomChess is a multi-repo product. Each GitHub repository maps 1:1 to a local folder under the org umbrella.</p>
<div class="toc"><p>On this page</p><ol>
  <li><a href="#diagram">Logical services</a></li>
  <li><a href="#pipeline">Pipeline detail</a></li>
  <li><a href="#stack">Stack</a></li>
  <li><a href="#data">Data stores</a></li>
  <li><a href="#obs">Observability</a></li>
</ol></div>
<h2 id="diagram">Logical services</h2>
<pre><code>[Client / Integrator]
        |
        v
   +---------+       +-----------+       +-----------+
   |   web   | ----> |    api    | ----> | analyzer  |
   +---------+       +-----------+       | (workers) |
                         |               +-----------+
                         |                     |
                         v                     v
                    Postgres              Stockfish
                    (analyses)            (UCI process)
                         |
                    Redis (optional queue / rate cache)
                         |
                    adapters (ingest + PGN normalize)
</code></pre>
<table>
  <thead><tr><th>Component</th><th>Repo</th><th>Role</th></tr></thead>
  <tbody>
    <tr><td>Public HTTP API</td><td><code>api</code></td><td>Versioned REST, auth quotas, caching, job orchestration</td></tr>
    <tr><td>Web app</td><td><code>web</code></td><td>Marketing + analyze UX + report pages</td></tr>
    <tr><td>Analyzer</td><td><code>analyzer</code></td><td>Engine workers, feature extraction, calibrated scoring</td></tr>
    <tr><td>Site adapters</td><td><code>adapters</code></td><td>Per-site fetch + PGN normalize + fixtures</td></tr>
    <tr><td>Design system</td><td><code>design</code></td><td>Tokens, board theme, brand assets</td></tr>
    <tr><td>Docs</td><td><code>docs</code></td><td>This wiki on GitHub Pages</td></tr>
  </tbody>
</table>
<h2 id="pipeline">Pipeline detail</h2>
<ol>
  <li>Ingest URL | ID | username | PGN</li>
  <li>Normalize to canonical PGN + metadata</li>
  <li>Engine eval (MultiPV, depth policy)</li>
  <li>Features (match, CPL, timing if available, opening novelty)</li>
  <li>Calibrated score + explanation</li>
  <li>JSON result + human report</li>
</ol>
<h2 id="stack">Stack</h2>
<ul>
  <li>TypeScript throughout</li>
  <li>API: Hono + <code>@hono/node-server</code> on Node 20+</li>
  <li>Web: Next.js App Router + React + Tailwind</li>
  <li>Engine: official Stockfish (GPL) as external UCI process</li>
  <li>DB: PostgreSQL</li>
  <li>Queue/cache: Redis optional; single-node in-memory fallback</li>
  <li>Package manager: pnpm per repo</li>
</ul>
<h2 id="data">Data stores</h2>
<p>Postgres holds analyses, API key hashes, and schema migrations. Retention purge removes expired rows. Redis, when configured, backs rate limits and optional job queue depth.</p>
<h2 id="obs">Observability</h2>
<p>Structured JSON logs and in-process metrics (request counts, queue depth, engine durations, cache hit/miss, upstream 429). requestId on the HTTP path. Info logs prefer PGN content hashes over raw PGN.</p>
`,
  ["scoring-bands.html", "Scoring bands"],
  ["api-overview.html", "API reference"],
)

write(
  "api-overview.html",
  "API reference",
  `
<h1>API reference</h1>
<p class="lead">Public HTTP API for fair-play analysis. Paths match PROJECT_SPEC. Machine-readable OpenAPI is served at <code>GET /v1/openapi.json</code>. Education-first: responses never emit a definitive guilt label.</p>
<div class="toc"><p>On this page</p><ol>
  <li><a href="#base">Base path</a></li>
  <li><a href="#routes">Routes</a></li>
  <li><a href="#auth">Auth and quotas</a></li>
  <li><a href="#cache">Response cache</a></li>
  <li><a href="#errors">Errors</a></li>
  <li><a href="#sites">Supported sites</a></li>
  <li><a href="#ethics">Ethics constraints</a></li>
</ol></div>
<h2 id="base">Base path</h2>
<p><code>/v1</code></p>
<h2 id="routes">Routes</h2>
<table>
  <caption>Versioned REST surface</caption>
  <thead><tr><th>Method</th><th>Path</th><th>Purpose</th></tr></thead>
  <tbody>
    <tr><td><code>GET</code></td><td><code>/v1/health</code></td><td>Liveness / readiness summary</td></tr>
    <tr><td><code>POST</code></td><td><code>/v1/analyze/url</code></td><td>Analyze by public game URL (SSRF allowlist)</td></tr>
    <tr><td><code>POST</code></td><td><code>/v1/analyze/pgn</code></td><td>Analyze by PGN body</td></tr>
    <tr><td><code>POST</code></td><td><code>/v1/analyze/username</code></td><td>List recent public games; optional analyze queue</td></tr>
    <tr><td><code>GET</code></td><td><code>/v1/analyses/{id}</code></td><td>Get analysis job or result (404 if expired)</td></tr>
    <tr><td><code>DELETE</code></td><td><code>/v1/analyses/{id}</code></td><td>Hard-delete analysis by id (privacy erasure)</td></tr>
    <tr><td><code>GET</code></td><td><code>/v1/sites</code></td><td>List supported sites and capabilities</td></tr>
    <tr><td><code>GET</code></td><td><code>/v1/openapi.json</code></td><td>OpenAPI 3.1 document</td></tr>
  </tbody>
</table>
<h2 id="auth">Auth and quotas</h2>
<p>Defaults from the api package docs/quotas.md (aligned with PROJECT_SPEC):</p>
<table>
  <caption>Analysis quota defaults</caption>
  <thead><tr><th>Subject</th><th>Daily analyses</th><th>Burst</th></tr></thead>
  <tbody>
    <tr><td>Anonymous (per client IP)</td><td>10 / day</td><td>2 / minute</td></tr>
    <tr><td>API key</td><td>200 / day</td><td>20 / minute</td></tr>
  </tbody>
</table>
<ul>
  <li>Send an API key with <code>Authorization: Bearer &lt;key&gt;</code> or <code>X-API-Key: &lt;key&gt;</code>.</li>
  <li>Keys are hashed at rest (SHA-256 over pepper + raw key). Raw keys are never stored.</li>
  <li>Quota cost: each analysis create or completed-cache hit on <code>POST /v1/analyze/*</code> consumes 1 unit. Username listing without <code>analyze: true</code> does not consume analysis quota.</li>
  <li>Rate-limit headers when quota is consumed: <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>, <code>X-RateLimit-Reset</code>; <code>Retry-After</code> on <code>429</code>.</li>
  <li>Public self-serve key minting is out of scope for v1.</li>
</ul>
<p>Expanded detail: <a href="api-quotas.html">Auth and quotas</a>.</p>
<h2 id="cache">Response cache</h2>
<p>Identical completed analyses are reused by content hash of normalized PGN plus engine policy id (<code>engine-v1</code>). Cache hit responses include <code>X-Cache: HIT</code>; misses include <code>X-Cache: MISS</code>.</p>
<h2 id="errors">Errors</h2>
<p>Stable JSON error shape: <code>code</code>, <code>message</code>, optional <code>details</code>, <code>requestId</code>. Adapter and upstream failures map to shared codes without leaking secrets. Common adapter codes include <code>not_found</code>, <code>private_or_unavailable</code>, <code>rate_limited</code>, <code>unsupported_variant</code>, <code>upstream_error</code>.</p>
<h2 id="sites">Supported sites</h2>
<p><code>GET /v1/sites</code> returns the adapters <code>sites.manifest.json</code> contract. Human-readable table: <a href="supported-sites.html">Supported sites</a>.</p>
<h2 id="ethics">Ethics constraints</h2>
<ul>
  <li>Official public site APIs only; no private-game access or login scraping. This is the public-API-only policy.</li>
  <li>URL ingest is SSRF-safe: only allowlisted hosts for supported sites.</li>
  <li>Reports present uncertainty and methodology; never a definitive guilt label.</li>
  <li>Full policy: <a href="ethics.html">Ethics</a>.</li>
</ul>
`,
  ["architecture.html", "Architecture"],
  ["api-quotas.html", "Auth and quotas"],
)

write(
  "api-quotas.html",
  "Auth and quotas",
  `
<h1>Auth, quotas, rate limits, and cache</h1>
<p class="lead">Values follow PROJECT_SPEC and api/docs/quotas.md. Operators may tighten limits in deployment; document deployed numbers in your runbook.</p>
<div class="toc"><p>On this page</p><ol>
  <li><a href="#quotas">Quotas</a></li>
  <li><a href="#keys">API keys</a></li>
  <li><a href="#headers">Rate-limit headers</a></li>
  <li><a href="#cache">Response cache</a></li>
  <li><a href="#backends">Limiter backends</a></li>
</ol></div>
<h2 id="quotas">Quotas (v1 defaults)</h2>
<table>
  <thead><tr><th>Subject</th><th>Daily analyses</th><th>Burst</th></tr></thead>
  <tbody>
    <tr><td>Anonymous (per client IP)</td><td>10 / day</td><td>2 / minute</td></tr>
    <tr><td>API key</td><td>200 / day</td><td>20 / minute</td></tr>
  </tbody>
</table>
<p>Quota cost: each analysis create or completed-cache hit on <code>POST /v1/analyze/*</code> consumes 1 unit. Username listing without <code>analyze: true</code> does not consume analysis quota.</p>
<h2 id="keys">API keys</h2>
<ul>
  <li>Send <code>Authorization: Bearer &lt;key&gt;</code> or <code>X-API-Key: &lt;key&gt;</code>.</li>
  <li>Keys are hashed at rest with SHA-256 over <code>pepper:rawKey</code> (<code>API_KEY_PEPPER</code>). Raw keys are never stored.</li>
  <li>Invalid or revoked keys return <code>401</code> with <code>code: invalid_api_key</code>.</li>
  <li>Public self-serve key minting is out of scope for v1; operators insert hashes via DB helpers.</li>
</ul>
<h2 id="headers">Rate-limit headers</h2>
<table>
  <thead><tr><th>Header</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>X-RateLimit-Limit</code></td><td>Binding window limit</td></tr>
    <tr><td><code>X-RateLimit-Remaining</code></td><td>Remaining units in that window</td></tr>
    <tr><td><code>X-RateLimit-Reset</code></td><td>Unix epoch seconds when the window resets</td></tr>
    <tr><td><code>Retry-After</code></td><td>Present on 429; seconds to wait</td></tr>
  </tbody>
</table>
<p><code>429</code> body uses stable error shape with <code>code: rate_limited</code>.</p>
<h2 id="cache">Response cache</h2>
<p>Identical completed analyses are reused by content hash of normalized PGN + engine policy id (<code>engine-v1</code>).</p>
<ul>
  <li>Lookup uses non-expired analyses rows (<code>status=completed</code>).</li>
  <li>Cache hit: HTTP 200, header <code>X-Cache: HIT</code>, body includes existing id + result.</li>
  <li>Cache miss: HTTP 202, header <code>X-Cache: MISS</code>, new job enqueued.</li>
</ul>
<h2 id="backends">Limiter backends</h2>
<p>Redis when <code>REDIS_URL</code> is set and reachable; otherwise in-memory (single node).</p>
`,
  ["api-overview.html", "API reference"],
  ["supported-sites.html", "Supported sites"],
)

write(
  "supported-sites.html",
  "Supported sites",
  `
<h1>Supported sites</h1>
<p class="lead">v1 ships two adapters. Capabilities are advertised by <code>GET /v1/sites</code> and the adapters package <code>sites.manifest.json</code>.</p>
<div class="toc"><p>On this page</p><ol>
  <li><a href="#manifest">Manifest</a></li>
  <li><a href="#lichess">Lichess</a></li>
  <li><a href="#chesscom">Chess.com</a></li>
  <li><a href="#errors">Shared error codes</a></li>
  <li><a href="#extend">Extension rules</a></li>
</ol></div>
<h2 id="manifest">Manifest</h2>
<p>Machine-readable list: adapters <code>sites.manifest.json</code> (version 1). HTTP: <code>GET /v1/sites</code>.</p>
<table>
  <thead><tr><th>Site id</th><th>Auth</th><th>Capabilities</th><th>Variants</th></tr></thead>
  <tbody>
    <tr><td><code>lichess</code></td><td>none</td><td>parse_url, fetch_game, list_recent_games</td><td>standard</td></tr>
    <tr><td><code>chesscom</code></td><td>none</td><td>parse_url, fetch_game, list_recent_games</td><td>standard</td></tr>
  </tbody>
</table>
<h2 id="lichess">Lichess</h2>
<ul>
  <li>Base: <code>https://lichess.org</code> public API only.</li>
  <li>Docs: <a href="https://lichess.org/api">https://lichess.org/api</a></li>
  <li>On HTTP 429 wait at least 60 seconds before retry.</li>
  <li>Fixtures under <code>adapters/fixtures/lichess/</code>; offline tests in CI.</li>
</ul>
<h2 id="chesscom">Chess.com</h2>
<ul>
  <li>Base: <code>https://api.chess.com/pub/</code> only.</li>
  <li>Archives and monthly games / PGN paths as documented by the Published-Data API.</li>
  <li>No single-game PubAPI endpoint; <code>fetchGame</code> uses composite ids <code>username/YYYY/MM/id</code> from <code>listRecentGames</code>.</li>
  <li>Fixtures under <code>adapters/fixtures/chesscom/</code>.</li>
</ul>
<h2 id="errors">Shared error codes</h2>
<p><code>not_found</code>, <code>private_or_unavailable</code>, <code>rate_limited</code>, <code>unsupported_variant</code>, <code>upstream_error</code>.</p>
<h2 id="extend">Extension rules</h2>
<p>Add a site only with documented public access, allowlisted hosts, fixtures, and SSRF-safe URL parsing. If no legal public route exists, do not add an adapter. See <a href="ethics.html">Ethics</a>.</p>
`,
  ["api-quotas.html", "Auth and quotas"],
  ["self-host.html", "Self-host"],
)

write(
  "self-host.html",
  "Self-host",
  `
<h1>Self-host</h1>
<p class="lead">Run the API and workers locally or on your own infrastructure. Sibling checkouts of adapters and analyzer are required for the api package path dependencies.</p>
<div class="toc"><p>On this page</p><ol>
  <li><a href="#prereq">Prerequisites</a></li>
  <li><a href="#api">API</a></li>
  <li><a href="#engine">Stockfish</a></li>
  <li><a href="#web">Web</a></li>
  <li><a href="#env">Environment notes</a></li>
</ol></div>
<h2 id="prereq">Prerequisites</h2>
<ul>
  <li>Node.js 20+ (CI commonly uses 22)</li>
  <li>pnpm 10+</li>
  <li>PostgreSQL 16 (or compatible) for persistent analyses</li>
  <li>Optional Redis for shared rate limits / queue</li>
</ul>
<h2 id="api">API</h2>
<pre><code>cd api
pnpm install
cp .env.example .env
# set DATABASE_URL, and API_KEY_PEPPER for key hashing
pnpm build
pnpm migrate
pnpm start
</code></pre>
<p>Health check: <code>GET /v1/health</code> should return JSON with <code>status</code>, <code>service</code>, and <code>apiVersion</code>.</p>
<h2 id="engine">Stockfish</h2>
<pre><code>cd analyzer
pnpm install
pnpm engine:download
</code></pre>
<p>Binary is not committed. License is GPL v3; keep NOTICE and source pointer. Optional: <code>AXIOMCHESS_STOCKFISH_PATH</code>.</p>
<h2 id="web">Web</h2>
<pre><code>cd web
pnpm install
pnpm tokens:sync
# set NEXT_PUBLIC_API_BASE_URL to the API origin
pnpm dev
</code></pre>
<h2 id="env">Environment notes</h2>
<ul>
  <li>Never commit <code>.env</code> or real secrets. Use <code>.env.example</code> placeholders only.</li>
  <li><code>ANALYSIS_RETENTION_DAYS</code> defaults to 30.</li>
  <li><code>REDIS_URL</code> enables Redis-backed limiters when reachable.</li>
  <li>URL ingest rejects non-allowlisted hosts (SSRF gate).</li>
</ul>
<p>Also read <a href="privacy.html">Privacy</a> and <a href="api-quotas.html">Auth and quotas</a>.</p>
`,
  ["supported-sites.html", "Supported sites"],
  ["glossary.html", "Glossary"],
)

write(
  "glossary.html",
  "Glossary",
  `
<h1>Glossary</h1>
<p class="lead">Stable terms used across the wiki, API, and UI. English only.</p>
<table>
  <thead><tr><th>Term</th><th>Definition</th></tr></thead>
  <tbody>
    <tr><td>AnalysisResultV1</td><td>Versioned JSON analysis result schema (<code>version: "v1"</code>)</td></tr>
    <tr><td>Band</td><td>Ordinal label: low, elevated, high, or inconclusive</td></tr>
    <tr><td>calibration-v1</td><td>Frozen scoring/uncertainty policy id</td></tr>
    <tr><td>CPL</td><td>Centipawn loss relative to engine evaluation</td></tr>
    <tr><td>engine-v1</td><td>Frozen UCI search policy (MultiPV 3, depth 18/16)</td></tr>
    <tr><td>Half-width</td><td>Uncertainty radius around score S</td></tr>
    <tr><td>Ink and Felt</td><td>Design direction: cool chalk surfaces, emerald felt accent</td></tr>
    <tr><td>NormalizedGame</td><td>Adapters output contract: canonical PGN + metadata</td></tr>
    <tr><td>opening-book-v1</td><td>CC0 opening book snapshot used to exclude theory plies</td></tr>
    <tr><td>Public-API-only</td><td>Ingest restricted to documented public endpoints and public/user PGN</td></tr>
    <tr><td>Usable plies</td><td>Post-book plies included in match/CPL sample</td></tr>
  </tbody>
</table>
<p>Return to <a href="index.html">Wiki home</a>.</p>
`,
  ["self-host.html", "Self-host"],
  null,
)

console.log("wiki pages complete")
