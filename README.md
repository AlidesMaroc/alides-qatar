# Alides Qatar — qa.alides.org

Static site for Alides' Qatar practice. Built as plain HTML/CSS, designed for GitHub Pages with a custom subdomain. No build step, no framework, no dependencies.

## Contents

| Path | Purpose |
|------|---------|
| `index.html` | Homepage |
| `qatar/executive-search-doha/` | Pillar page — Executive Search |
| `qatar/board-advisory-qatar/` | Pillar page — Board Advisory |
| `assets/og-alides-qatar.jpg` | Open Graph / social share image (1200×630) |
| `sitemap.xml` | Sitemap (homepage + pillar pages) |
| `robots.txt` | Crawl directives |
| `CNAME` | Custom domain declaration (qa.alides.org) |
| `404.html` | Error page |

## Deploying to GitHub Pages

1. Create a repository on GitHub (e.g. `alides-qatar`).
2. Upload the **contents** of this folder to the repository root (not the folder itself).
3. In **Settings → Pages**, set Source to the `main` branch, folder `/ (root)`.
4. The `CNAME` file will declare `qa.alides.org` automatically.
5. At your domain registrar (where `alides.org` is managed), add a **CNAME** DNS record:
   - Host/Name: `qa`
   - Value: `YOUR-GITHUB-USERNAME.github.io`
6. GitHub will issue a free HTTPS certificate automatically (allow up to 24h for DNS + SSL).

Your main site (`www.alides.org` on Wix) is unaffected — the `qa` subdomain is independent.

## Before publishing — checklist

- [ ] **Contact form:** replace `YOUR_FORM_ID` in `index.html` with your Formspree form ID
      (create a free form at https://formspree.io, point it to your email).
- [ ] **Email:** confirm `contact@alides.org` is the right address (used in footers + mailto).
- [ ] **Doha presence:** the copy states "present in Doha, serving Qatar" — confirm this is
      accurate, or adjust the wording.
- [ ] **Arabic script (قطر):** have a native Arabic reader validate the kufic rendering on the
      site and on the OG image.
- [ ] **OG image:** confirm `assets/og-alides-qatar.jpg` is the version you want for social sharing.
- [ ] **Content:** the site is complete — homepage, six expertise pillar pages, an Insights
      index and six articles. All internal links resolve. Review the article copy and bylines
      before publishing (some are attributed to Mehdi El Idrissi, Managing Partner).

## Adding the remaining pillar pages

Each pillar page follows the same structure. Copy an existing one
(e.g. `qatar/board-advisory-qatar/index.html`), change the `<title>`, meta description,
canonical URL, schema, H1, and body copy, then add the URL to `sitemap.xml`.

## Editing

All content is in the HTML files directly. There is no CMS — edits are made in the code.
Colours and fonts are defined as CSS variables at the top of each file's `<style>` block.
