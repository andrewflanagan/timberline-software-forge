# Timberline Code Forge

Timberline Code Forge is an Astro site for a Pacific Northwest software consultancy focused on system software, autonomy, robotics back ends, and field-ready engineering work.

The site is built as a compact marketing and content platform: a custom home page for the consultancy, a contact form backed by a runtime API route, and a Markdown/MDX blog that can grow into technical writing, case studies, and deployment notes.

## Purpose

This project presents Timberline Code Forge as a specialist consultancy for teams building software close to hardware. The primary visitor path is:

1. Learn what kinds of systems Timberline works on.
2. Understand the service areas and project process.
3. Submit an inquiry through the contact form or email directly.
4. Read supporting technical content through the blog.

The home page is intentionally more focused than a generic agency site. It emphasizes autonomy, embedded and edge systems, sensor integration, robotics back ends, CI/CD for field systems, and operationally reliable software.

## Design Direction

The visual design uses a dark Pacific Northwest palette: evergreen, canopy green, moss, copper, ember, and snow-cream accents. The tone is technical and grounded rather than glossy or generic.

Key design elements:

- Sticky header with anchor navigation for the main landing sections.
- Full-viewport hero using `public/images/timberline-logo.png` as the background image.
- Service cards for the main consulting areas.
- A process section organized around system discovery, architecture, implementation, and verification.
- A compact contact form designed for project inquiries.
- Separate blog layout inherited from the Astro starter, available for future technical articles.

Some blog and about-page content still appears to be starter placeholder content. Replace that material before treating those pages as production-ready editorial pages.

## Tech Stack

- Astro 5
- TypeScript
- Astro Content Collections for Markdown and MDX blog posts
- Astro MDX integration
- Astro sitemap integration
- Astro RSS support
- Cloudflare Workers via `@astrojs/cloudflare`
- Wrangler for local Worker preview and deployment
- Resend for contact-form email delivery

## Project Structure

```text
.
|-- public/
|   |-- images/
|   |   `-- timberline-logo.png
|   |-- fonts/
|   |-- blog-placeholder-*.jpg
|   `-- favicon.svg
|-- src/
|   |-- components/
|   |   |-- BaseHead.astro
|   |   |-- Header.astro
|   |   |-- Footer.astro
|   |   |-- HeaderLink.astro
|   |   `-- FormattedDate.astro
|   |-- content/
|   |   `-- blog/
|   |       `-- *.md / *.mdx
|   |-- layouts/
|   |   `-- BlogPost.astro
|   |-- pages/
|   |   |-- index.astro
|   |   |-- about.astro
|   |   |-- rss.xml.js
|   |   |-- api/
|   |   |   `-- contact.ts
|   |   `-- blog/
|   |       |-- index.astro
|   |       `-- [...slug].astro
|   |-- styles/
|   |   `-- global.css
|   |-- consts.ts
|   |-- content.config.ts
|   `-- env.d.ts
|-- astro.config.mjs
|-- package.json
|-- tsconfig.json
|-- wrangler.json
`-- worker-configuration.d.ts
```

## Main Routes

- `/` - Custom Timberline Code Forge landing page with services, process, about, and contact sections.
- `/blog/` - Blog index generated from the `blog` content collection.
- `/blog/[slug]/` - Individual Markdown or MDX blog post pages.
- `/about/` - Astro starter-style about page. This should be rewritten before launch.
- `/rss.xml` - RSS feed generated from blog content.
- `/api/contact` - Runtime POST endpoint for the contact form.

## Content Model

Blog posts live in `src/content/blog/` and are loaded by `src/content.config.ts`.

Each post should include this frontmatter:

```yaml
title: "Post title"
description: "Short summary for previews and metadata"
pubDate: 2026-06-03
updatedDate: 2026-06-03
heroImage: "/blog-placeholder-1.jpg"
```

`updatedDate` and `heroImage` are optional, but the current blog listing expects `heroImage` to exist when rendering post cards.

## Contact Form

The contact form on the home page posts to `/api/contact`.

The API route:

- Runs at request time with `export const prerender = false`.
- Reads `name`, `email`, `company`, and `message` from form data.
- Requires `name`, `email`, and `message`.
- Sends email through Resend to `hello@timberlinecodeforge.com`.

Required environment variable:

```bash
RESEND_API_KEY=your_resend_api_key
```

The configured sender is:

```text
Timberline Contact <contact@timberlinecodeforge.com>
```

That domain and sender must be verified in Resend before production delivery will work.

## Local Development

Install dependencies:

```bash
npm install
```

Start the Astro dev server:

```bash
npm run dev
```

By default, Astro serves the site at:

```text
http://localhost:4321
```

## Validation

Build the site:

```bash
npm run build
```

Run the project check script:

```bash
npm run check
```

The check script runs:

```bash
astro build && tsc && wrangler deploy --dry-run
```

Use this before deployment to catch Astro build errors, TypeScript issues, and Cloudflare Worker deployment problems.

## Previewing the Worker Build

Preview the Cloudflare Worker locally:

```bash
npm run preview
```

This runs an Astro build and then starts Wrangler locally against the built Worker output.

## Deployment

This project is configured for Cloudflare Workers.

Deployment configuration lives in:

- `astro.config.mjs`
- `wrangler.json`

Important production settings:

- Astro output is `server`.
- The Cloudflare adapter is enabled.
- Worker entrypoint is `./dist/_worker.js/index.js`.
- Static assets are served from `./dist`.
- `nodejs_compat` is enabled in Wrangler.
- Observability and source map upload are enabled.

Deploy with npm:

```bash
npm run build
npm run deploy
```

Or run both in one command:

```bash
npm run build && npm run deploy
```

Before the first production deploy:

1. Configure the Cloudflare account and Worker target for Wrangler.
2. Add `RESEND_API_KEY` as a Worker secret.
3. Verify `contact@timberlinecodeforge.com` in Resend.
4. Confirm `site` in `astro.config.mjs` matches the production domain.
5. Replace starter blog/about content with production copy.

Set the Resend secret with Wrangler:

```bash
npx wrangler secret put RESEND_API_KEY
```

Then deploy:

```bash
npm run deploy
```

## Useful npm Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Astro development server. |
| `npm run build` | Build the production site into `dist/`. |
| `npm run preview` | Build and preview through Wrangler. |
| `npm run check` | Build, type-check, and run a Wrangler dry-run deploy. |
| `npm run deploy` | Deploy the built Cloudflare Worker. |
| `npm run cf-typegen` | Generate Cloudflare Worker environment types. |
| `npm run astro -- --help` | Show Astro CLI help. |

## Launch Notes

Before launch, review these items:

- Update `src/consts.ts` from starter values to Timberline-specific metadata.
- Replace starter content in `src/pages/about.astro`.
- Replace placeholder blog posts or remove the blog until real content is ready.
- Confirm all contact email addresses and Resend sender domains.
- Test the contact form against a deployed Worker environment.
- Run `npm run check` before final deploy.
