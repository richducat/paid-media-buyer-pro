# Salt — commercial launch & Google setup

## URLs
- **Landing (indexable, share this):** https://paidmediapro.eb28.co/salt
- **App:** https://paidmediapro.eb28.co/demo/salt
- **Guest requests:** https://paidmediapro.eb28.co/demo/request.html

## Google setup (10 minutes, needs the owner)
1. **Search Console** — add the property `paidmediapro.eb28.co` at
   https://search.google.com/search-console. Choose the "HTML tag" method,
   copy the token, and paste it into `public/salt-landing.html` where it says
   `REPLACE_WITH_SEARCH_CONSOLE_TOKEN`. Redeploy, then click Verify.
2. **Submit the sitemap** — in Search Console → Sitemaps, submit
   `https://paidmediapro.eb28.co/sitemap.xml`.
3. **Request indexing** — Search Console → URL Inspection → enter
   `/salt` → Request indexing.
4. **Analytics (optional)** — create a GA4 property, then paste its gtag
   snippet just before `</head>` in `salt-landing.html`. (Left out by default
   so no tracking ships without the owner's choice + a privacy note.)

## SEO already in place
- Title, meta description, keywords, canonical, theme-color
- Open Graph + Twitter card with a rendered 1200×630 image (`/salt-og.png`)
- JSON-LD `SoftwareApplication` structured data (rich results eligible)
- `robots.txt` (allows the landing, hides the app/API) + `sitemap.xml`
- Semantic headings, descriptive footer copy, fast self-contained page

## Security (hardened this round)
- Rate limiting on all writes (per-IP + per-room), 429 on flood
- GET is read-only (can't be used to evict live gig rooms)
- PATCH (accept/decline) requires the booth's operator token — guests can't
  moderate the queue
- Streaming body-size cap (rejects oversized/chunked bodies)
- Feedback file capped (~2 MB) so it can't fill the disk
- CSP + X-Frame-Options + nosniff + Referrer-Policy + Permissions-Policy,
  scoped to Salt paths (the main product's pages are untouched)
- All guest-submitted text is HTML-escaped on render (no stored XSS)

## Environment variables (set in cPanel → Node app)
- `SALT_FEEDBACK_KEY` — secret for reading the beta feedback inbox at
  `/api/dj/feedback?key=...`. Defaults to `saltbeta` if unset; **set a real
  value for production.**

## Honest limitations before a paid launch
- Data stores are in-memory / single-file on shared hosting — fine for a
  demo and light beta, but a real launch needs a database (Postgres/Redis)
  and DJ accounts (the operator token is per-browser, not a login).
- **Recommend Salt gets its own domain** (e.g. saltdj.app) for branding,
  clean SEO, and cookie/security isolation from the Paid Media Pro product
  it currently rides on.
- Explicit-lyric data and library metadata are still illustrative except for
  analyzed imports; production needs a licensed lyrics/analysis pipeline.
