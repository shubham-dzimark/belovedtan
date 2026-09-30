# BelovedTan

A Next.js site with an admin panel where pages are designed in a drag-and-drop visual editor ([Puck](https://puckeditor.com)).

- **Public site**: `/` and any published page URL, e.g. `/about-us`
- **Admin panel**: `/admin` (sign in required)

## Stack

| Part | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router, server actions) |
| Visual editor | `@puckeditor/core` |
| Database | SQLite via libSQL + Drizzle ORM (swap to Turso for production) |
| Auth | bcrypt password hashes + signed, httpOnly session cookie (`jose`) |

## Getting started

```bash
npm install
cp .env.example .env      # then fill in SESSION_SECRET and ADMIN_PASSWORD
npm run setup             # creates the database tables, the first admin and a Home page
npm run dev
```

Open http://localhost:3000/admin and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`.

## Admin panel

The admin UI is built with [Mantine](https://mantine.dev) (sidebar layout, tables, dialogs, notifications, light/dark mode).
The full-screen visual editor and the previews render outside Mantine so its styles never reach the page canvas.

- **Header / Footer** (sidebar → Site layout): the site-wide header and footer, each with its own visual editor,
  draft/preview/publish. Every page shows the published header and footer; a page can hide either one under
  **Page → Show site header / Show site footer** in its editor.

- **Global widgets** (sidebar → Content): reusable sections. In the page editor, select a section and click
  ★ **Save as global widget** in its toolbar; it then appears under **★ Global widgets** in the block list of every
  page (including new ones). Editing a widget (draft/preview/publish) updates every page using it. **Detach** in the
  section toolbar turns one copy back into a normal section; deleting a widget detaches all of its copies first.
  Sections that contain other blocks (Section, Columns) can't be saved as global widgets.
- **Pages**: list every page with its status, then edit, preview, duplicate, unpublish or change its settings.
- **New page**: set a title and URL, then go straight into the editor. Use `/` as the URL for the home page.
- **Editor**: drag widgets from the left panel onto the canvas and edit them in the right panel.
  - **Save draft** (or Ctrl+S) saves without changing the live site.
  - **Preview** saves and opens the draft in a new tab.
  - **Publish** makes the current version live.
- **Users**: add or remove admins and change your password.

Drafts and published versions are stored separately, so visitors only see changes after **Publish**.

## Landing-page sections

The editor has a **Page sections** group with full-width sections for a complete landing page:

Site header, Hero banner, Intro + link list, Services showcase, Offer cards, Service list over image,
Heading + feature columns, Full-width image, Locations, Promo banner, Product showcase, Social feed, Site footer.

Every text, link, image, colour and list item is editable in the right-hand panel; lists (cards, services,
locations, footer columns, social links…) can be added to, removed and reordered. Image fields accept a URL or
an **Upload** (JPG, PNG, WebP, GIF, AVIF, MP4, WebM up to 50 MB), and hero/banner sections accept a background video.

When creating a page, choose **Landing page template** to start with every section filled in with placeholder
content. `npm run db:landing` creates a published example at `/landing`.

Uploaded files are stored in `data/uploads/` and served from `/uploads/…`. Like the SQLite file, that folder
needs persistent disk in production (or swap the upload route for S3/R2/Cloudinary).

## Adding widgets

Widgets live in [`src/puck/config.tsx`](src/puck/config.tsx); the landing sections are in [`src/puck/blocks/`](src/puck/blocks/) with styles in [`src/puck/landing.css`](src/puck/landing.css). Each one has `fields` (the settings panel), `defaultProps` and `render`. Add a type to `Props`, a component entry and, optionally, add it to a category. Shared widget CSS is in [`src/app/globals.css`](src/app/globals.css).

## Project layout

```
src/
  app/
    (site)/[[...slug]]/     public pages rendered from published data
    admin/
      login/                sign-in page
      (panel)/              dashboard, new page, page settings, users (with sidebar)
      editor/[id]/          full-screen Puck editor
      preview/[id]/         draft preview
      actions.ts            all server actions (every one re-checks the session)
  db/                       Drizzle schema and client
  lib/                      session, auth check, page queries, slug helpers
  puck/                     widget config and starter templates
  proxy.ts                  redirects signed-out users away from /admin
scripts/seed.ts             creates the first admin and Home page
```

## Database scripts

| Command | What it does |
| --- | --- |
| `npm run db:push` | Apply `src/db/schema.ts` to the database |
| `npm run db:seed` | Create the admin from `.env` and a Home page (safe to re-run) |
| `npm run db:landing` | Create a published example landing page at `/landing` |
| `npm run db:studio` | Browse the database in Drizzle Studio |
| `npm run db:generate` / `db:migrate` | Versioned migrations, if you prefer them to `push` |

## Deploying

The local SQLite file (`data/belovedtan.db`) works on a single server or VPS. On serverless hosts such as Vercel, the filesystem isn't persistent, so use a hosted libSQL database (e.g. [Turso](https://turso.tech)): set `DATABASE_URL=libsql://…` and `DATABASE_AUTH_TOKEN`, then run `npm run setup` once against it. Always set a unique `SESSION_SECRET` in production.
