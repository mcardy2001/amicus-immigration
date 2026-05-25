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
2. **Confirm phone & email.** The site currently uses:
   - Phone: `(519) 476-0734`
   - Email: `dan.amicus@gmail.com`
3. **Add Dinshaw's founder photo.** The about page is already wired to display `images/dinshaw.jpg`. Save the headshot into the project's `images/` folder using the exact filename **`dinshaw.jpg`**. Square or portrait-oriented photos look best — the image is auto-cropped to a square with the focal point biased toward the top so faces stay in frame. If your photo is a `.png`, either rename it to `.jpg` (browsers don't actually care about the extension) or edit the `src` attribute in `about.html` to match.
4. **(Optional) Add a real logo.** The header currently uses a typographic "A" mark. If you have a logo PNG/SVG, drop it into `images/` and swap the `.brand-mark` element for an `<img>`.
5. **Confirm the "Talk to an agent" section on the home page.** This section gives visitors a chat with **Amie**, our AI assistant, plus three ways to reach a real person:
   - **Call us now** — uses the office number above. Works as tap-to-call on phones and opens FaceTime/Skype/your default calling app on Macs and PCs.
   - **WhatsApp** — currently points to `wa.me/15194760734` (the office number). If WhatsApp Business uses a different number, edit the `talk-option--whatsapp` link in `index.html` (the `wa.me/...` URL). The pre-filled message is editable via the `?text=` parameter on the same URL.
   - **Book a video call** — currently links to the contact page. To enable real self-serve scheduling, sign up for a free [Calendly](https://calendly.com) or [Cal.com](https://cal.com) account, create a "20-minute consultation" event, and replace `href="contact.html"` on the `talk-option--book` link with your booking URL. (Both services offer free tiers and auto-integrate with Google Calendar / Zoom / Meet.)

## About "Amie", the AI chat assistant

The AI chat on the home page is **Amie** — a client-side intent-matching assistant defined entirely in `js/chatbot.js`. It works immediately on GitHub Pages with no API keys, no backend, and no monthly fees. The knowledge base lives in the `INTENTS` array at the top of that file — each intent has keyword patterns, a response, and follow-up suggestions. Edit, add, or remove intents freely; changes take effect on the next page load.

**Strengths of this approach:**
- Free forever, no usage limits
- Privacy-friendly (no data leaves the visitor's browser)
- Fast (no network round-trip for each reply)
- Easy to audit and edit (every answer is a string you can read)

**Limits of this approach:**
- Doesn't understand novel phrasing the way a real LLM does
- Can't handle truly open-ended questions
- Won't summarize or reason about the visitor's specific situation

**To upgrade Amie to a real LLM** (recommended once you start getting meaningful traffic), replace the `getReply()` function in `chatbot.js` with a `fetch` to one of:

1. **[Chatbase](https://chatbase.co)** — easiest path. Upload your website URL, FAQ documents, and brand-voice samples. They train a GPT-4 chatbot and give you an embed script. From ~USD $19/mo. You'd remove the current chat UI entirely and paste their `<script>` tag instead.
2. **[Voiceflow](https://voiceflow.com)** — more visual, more configurable. Free tier exists. Same idea: design the bot, get an embed.
3. **Custom Claude/OpenAI integration via a serverless function** — keep the existing UI; deploy a Cloudflare Worker or Vercel Function that holds the API key, queries Claude/GPT, and returns the reply. Modify `getReply()` to `fetch` your worker URL. Most flexible, but you maintain the prompt and infrastructure yourself. Expect $5–50/mo depending on traffic.

The current rules-based approach is a solid year-one solution. Most visitor questions are predictable (cost, timeline, eligibility, family, which province) and the existing intents cover them well. Upgrade when visitors start asking nuanced situational questions the bot can't handle.

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

The featured testimonial on the home page from **Stephanie Duchesne** (August 2020) is real and was provided from Dan's LinkedIn recommendations. **One word was edited:** her original text described Dan as an "immigration lawyer" — this was changed to "immigration consultant" because Dan is a Registered Canadian Immigration Consultant (RCIC), not a lawyer, and the distinction is regulated in Canada by the CICC. Please review and confirm this edit is acceptable, and consider asking Stephanie's permission to use the (lightly edited) recommendation publicly on the site.

The remaining four testimonials below Stephanie's and the "500+ placements" stat are sensible placeholders based on your brief. Please review and update them with real numbers and approved client quotes before going live, and make sure the CICC license number and any legally required disclosures are added. The founding year (2008) is treated as the source of truth for the experience claims.
