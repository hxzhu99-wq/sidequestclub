# Side Quest Club (by Sourcely): static site

Plain HTML, CSS and JS. No build step.

## Files
- index.html: home
- ideas/index.html: 10 ideas to kick off your tiny business today
- test/index.html: 3 ways to test an idea for under $50
- map/index.html: interactive China factory cluster map
- privacy/index.html: privacy template (edit before launch)
- 404.html, favicon.svg, robots.txt, sitemap.xml
- assets/style.css, assets/app.js

## Before you publish
1. Find and replace `YOUR-DOMAIN.com` with your real domain in every file (canonical tags, sitemap.xml, robots.txt, privacy page).
2. Sign-ups: follow the separate sign-up setup steps (Google Sheet + Apps Script), then paste the web app URL into `SIGNUP_ENDPOINT` in assets/app.js. Left empty, the form shows "Sign-ups are opening soon".
3. Have the privacy page checked for where you operate, and set a real contact address.
4. The site uses root paths (`/ideas/`), so deploy at the root of a domain or subdomain.

## Deploy (any one)
- Netlify or Cloudflare Pages: drag the unzipped folder in. Vercel: `vercel --prod` in this folder.
- GitHub Pages: push the folder contents, enable Pages, add a custom domain.
Make sure index.html sits at the top level of what you upload.

## What works on the live site
- Likes and saves are kept in the visitor's browser (no counts across visitors).
- Share uses the device share sheet or copies the link.
- Comments are not on the static site. Add a service such as Giscus later.
- The factory map is a simplified, hand-drawn outline with approximate positions. Cluster notes are general knowledge, not vetted factories; check them before launch.
