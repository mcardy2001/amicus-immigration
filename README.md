# Amicus Immigration Consultants Canada Inc. — Website

Marketing website for **Amicus Immigration Consultants Canada Inc.**, a Mississauga-based immigration firm helping foreign workers and families move to Canada for jobs in construction, hospitality, food service and other essential roles.

Built as a static, single-folder site — no build step, no framework. Just open `index.html` in a browser, or push to any static host (GitHub Pages, Netlify, Cloudflare Pages, etc.).

## Pages

- `index.html` — Home (hero, value props, services overview, testimonials)
- `services.html` — Detailed services and immigration pathways
- `about.html` — Founder bio (Dinshaw Engineer), values, office
- `resources.html` — FAQ, checklists, government links
- `contact.html` — Contact form (Formspree) + office details + map

## Tech

- Plain HTML5 + CSS3 + a tiny vanilla JS file (`js/main.js`)
- Fonts via Google Fonts (Inter + Source Serif Pro)
- Embedded Google Maps via iframe (no API key required)
- Responsive: mobile menu, fluid grid, content reflows down to ~360px width
- No backend, no build, no JS framework

## Before you publish — quick to-dos

1. **Activate the contact form.** Open `contact.html` and replace `YOUR_FORMSPREE_ID` with the form ID you get from [Formspree](https://formspree.io) (free tier).
2. **Confirm phone & email.** The site uses placeholder contact details:
   - Phone: `(905) 999-9999` — replace in the footer of every page and in `contact.html`.
   - Email: `info@amicusimmigration.ca` — replace if different.
3. **(Optional) Add a real logo.** The header currently uses a typographic "A" mark. If you have a logo PNG/SVG, drop it into `images/` and swap the `.brand-mark` element for an `<img>`.
4. **(Optional) Add a real founder photo.** `about.html` uses a stylized SVG placeholder. To use a real photo, replace the `.about-portrait` `<svg>` block with `<img src="images/dinshaw.jpg" alt="Dinshaw Engineer" />`.

A simple find-and-replace across all `.html` files will handle the phone and email updates in one pass.

## Push to GitHub (mcardy2001)

These steps assume you have [Git](https://git-scm.com/) installed and you're signed in to GitHub as `mcardy2001`.

```bash
# 1. Unzip the project somewhere convenient, then cd into it
cd amicus-immigration

# 2. Initialize a git repo
git init
git branch -M main
git add .
git commit -m "Initial commit: Amicus Immigration website"

# 3. Create the repo on GitHub.com under your account (mcardy2001):
#    https://github.com/new
#    - Repository name: amicus-immigration  (or whatever you prefer)
#    - Visibility: Public (required for free GitHub Pages) or Private
#    - DO NOT initialize with a README, .gitignore, or license (we already have them)

# 4. Connect and push
git remote add origin https://github.com/mcardy2001/amicus-immigration.git
git push -u origin main
```

If you prefer the [GitHub CLI](https://cli.github.com/), steps 3–4 collapse to:

```bash
gh repo create mcardy2001/amicus-immigration --public --source=. --remote=origin --push
```

## Publish for free on GitHub Pages

After pushing to GitHub:

1. Go to your repo on GitHub → **Settings → Pages**.
2. Under **Source**, choose **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`. Save.
4. Wait ~1 minute. Your site will be live at:
   `https://mcardy2001.github.io/amicus-immigration/`

To use a custom domain (e.g. `amicusimmigration.ca`):

1. In **Settings → Pages → Custom domain**, enter the domain and save. A `CNAME` file will be added to the repo automatically.
2. At your domain registrar, create:
   - An `A` record for the apex pointing to GitHub's Pages IPs (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`), **or**
   - A `CNAME` for `www` pointing to `mcardy2001.github.io`.
3. Wait for DNS to propagate, then tick **Enforce HTTPS** in the Pages settings.

## Alternative hosts (also free)

- **Netlify** — drag-and-drop the unzipped folder at [app.netlify.com/drop](https://app.netlify.com/drop). Live in seconds.
- **Cloudflare Pages** — connect the GitHub repo, leave build command blank, set output directory to `/`.
- **Vercel** — same idea: connect the repo, no framework preset needed.

## Editing content

All copy is right inside the `.html` files — no CMS, no JSON. Open any page in a text editor and edit between the tags. The shared header/footer is duplicated across each page; if you change one, mirror the change in the others (or, if this gets painful, ask me to refactor with a small build step or move to a static site generator).

## Disclaimer about the placeholder copy

The testimonials, statistics ("10+ years", "500+ placements", etc.) and contact details on this site are sensible placeholders based on your brief. Please review and update them with real numbers and approved client quotes before going live, and make sure the CICC license number and any legally required disclosures are added.
