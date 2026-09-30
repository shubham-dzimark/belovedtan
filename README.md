# BelovedTan

A Next.js website with an admin panel where pages are designed in a drag-and-drop visual editor ([Puck](https://puckeditor.com)).

- **Public site**: `/` and any published page URL, e.g. `/massage-therapy`
- **Admin panel**: `/admin` (sign-in required)

## Stack

| Part | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router, server actions) |
| Visual editor | `@puckeditor/core` |
| Admin UI | [Mantine](https://mantine.dev) + Tabler icons |
| Database | SQLite via libSQL + Drizzle ORM (can point at Turso in production) |
| Auth | bcrypt password hashes + signed, httpOnly session cookie (`jose`) |

---

## Running the project

### 1. Requirements

- **Node.js 20.9 or newer** (check with `node -v`; download from https://nodejs.org)
- **npm** (comes with Node.js)
- **Git**

### 2. Get the code and install dependencies

```bash
git clone https://github.com/shubham-dzimark/belovedtan.git
cd belovedtan
npm install
```

### 3. Create your `.env` file

Copy the example file:

```bash
# macOS / Linux / Git Bash
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

Then open `.env` and fill in:

| Variable | What to put |
| --- | --- |
| `DATABASE_URL` | Leave as `file:./data/belovedtan.db` to use a local SQLite file. |
| `DATABASE_AUTH_TOKEN` | Leave empty for local SQLite (only needed for a hosted Turso/libSQL database). |
| `SESSION_SECRET` | A long random string (at least 32 characters). Generate one with the command below. |
| `ADMIN_NAME` | Name of the first admin user. |
| `ADMIN_EMAIL` | Email you'll sign in with. |
| `ADMIN_PASSWORD` | Password you'll sign in with (at least 8 characters). |

Generate a `SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

> `.env` holds secrets and is ignored by Git. Never commit it.

### 4. Create the database

```bash
npm run setup
```

This creates `data/belovedtan.db` with all tables, adds the admin user from `.env`, and creates a starter Home page.
It's safe to run again: existing users and pages are left alone.

### 5. Start the site

**Development** (auto-reloads when you change code):

```bash
npm run dev
```

**Production** (faster; use this when showing the site to others):

```bash
npm run build
npm start
```

Then open:

- Website: http://localhost:3000
- Admin panel: http://localhost:3000/admin (sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`)

After code changes in production mode, stop the server (Ctrl+C), run `npm run build` again, then `npm start`.
Content changes made in the admin panel never need a rebuild.

### 6. Optional: example content

```bash
# A published example landing page at /landing
npm run db:landing

# A published example service page at /massage-therapy
npm run db:landing -- service massage-therapy "Massage Therapy"
```

You can also create pages from the **Landing page** or **Service page** templates in **Admin → New page**.

### Sharing the site over the internet (temporary link)

To show the site running on your computer to someone else, use a tunnel such as [ngrok](https://ngrok.com):

1. Start the site in **production** mode (`npm run build`, then `npm start`).
2. One-time setup: create a free ngrok account, then run `ngrok config add-authtoken <your-token>`.
3. In a second terminal: `ngrok http 3000`
4. Share the `https://….ngrok-free.app` (or `.ngrok-free.dev`) link it prints. The admin panel is at that link + `/admin`.

The link only works while your computer and both terminals are running, and it changes each time you restart ngrok
on the free plan. If you share admin access, create a separate account under **Admin → Users**.

Dev mode (`npm run dev`) also works through ngrok and Cloudflare tunnels (they're allowed in `next.config.ts`),
but production mode is much faster.

### Moving your content to another machine

Pages, the header/footer, global widgets and users are stored in the database, **not** in Git. To move a site's
content, copy these alongside the code:

- `data/belovedtan.db`: all content and users
- `data/uploads/`: images and videos uploaded in the editor

### Troubleshooting

| Problem | Fix |
| --- | --- |
| `Port 3000 is in use` / `Another next dev server is already running` | A server is already running. Use it, or stop it (Ctrl+C in its terminal) before starting another. |
| `Another next build process is already running` | A previous build didn't exit. Close it, or delete `.next/lock`, then build again. |
| Can't sign in | Check `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`. If you changed the password under **Users**, use the new one. Run `npm run db:seed` if the user was never created. |
| `SESSION_SECRET must be set to at least 32 characters` | Add a long random `SESSION_SECRET` to `.env` (see step 3) and restart the server. |
| Page text missing when opened through a tunnel | Use production mode, or restart `npm run dev` so it picks up the allowed tunnel domains. |
| "Hydration mismatch" overlay mentioning `bis_skin_checked` | Caused by the Bitdefender browser extension, not the site. It's filtered out in development; disabling the extension for `localhost` also stops it. |

---

## Admin panel

- **Pages**: list every page with its status, then edit, preview, duplicate, unpublish or change its settings.
- **New page**: set a title and URL and pick a template (Landing, Service or Blank). Use `/` as the URL for the home page.
- **Global widgets**: reusable sections. In the page editor, select a section and click ★ **Save as global widget**
  in its toolbar; it then appears under **★ Global widgets** in the block list of every page, including new ones.
  Editing a widget (draft/preview/publish) updates every page using it. **Detach** in the section toolbar turns one
  copy back into a normal section; deleting a widget detaches all of its copies first. Sections that contain other
  blocks (Section, Columns) can't be saved as global widgets.
- **Header / Footer** (Site layout): the site-wide header and footer, each with its own visual editor. Every page shows
  the published header and footer; a page can hide either one under **Page → Show site header / Show site footer**.
- **Users**: add or remove admins and change your password.
- **Visual editor**: drag sections from the left panel onto the canvas and edit them in the right panel.
  - **Save draft** (or Ctrl+S) saves without changing the live site.
  - **Preview** saves and opens the draft in a new tab.
  - **Publish** makes the current version live.

Drafts and published versions are stored separately, so visitors only see changes after **Publish**.

The admin screens use Mantine (with light/dark mode). The full-screen editor and previews render outside Mantine so its
styles never reach the page canvas.

## Page sections

**Landing sections:** Hero banner, Intro + link list, Services showcase, Offer cards, Service list over image,
Heading + feature columns, Full-width image, Locations, Promo banner, Product showcase, Social feed.

**Service-page sections:** Page hero, Icon strip, Service intro + locations, Split image + text.

**Site-wide (edited under Header / Footer):** Site header, Site footer.

**Basic widgets:** Section, Columns, Spacer, Divider, Heading, Text, Button, Image.

Every text, link, image, colour and list item is editable in the right-hand panel, and lists can be added to,
removed and reordered. Other controls:

- **Page settings** (click **Page** in the editor): fonts, heading style, text size, colors, entrance animations,
  and show/hide the site header and footer.
- **Per section**: a **Typography** group (font, sizes, weights, colors) and an **Entrance animation** setting.
- **Uploads**: image fields accept a URL or an upload (JPG, PNG, WebP, GIF, AVIF, MP4, WebM up to 50 MB). Hero and
  banner sections also accept a background video.

## Adding widgets

Widgets are registered in [`src/puck/config.tsx`](src/puck/config.tsx); the page sections live in
[`src/puck/blocks/`](src/puck/blocks/) with styles in [`src/puck/landing.css`](src/puck/landing.css). Each one has
`fields` (the settings panel), `defaultProps` and `render`. Add a type to `Props`, a component entry and, optionally,
add it to a category.

## Project layout

```
src/
  app/
    (site)/[[...slug]]/     public pages (published content between the site header and footer)
    admin/
      login/                sign-in page
      (panel)/              dashboard, new page, page settings, global widgets, users (Mantine UI)
      editor/[id]/          full-screen page editor
      site/[part]/          header / footer editors
      global/[id]/          global widget editor
      preview/…             draft previews
      _components/          admin shell, Mantine setup, shared visual editor
      actions.ts            all server actions (each one re-checks the session)
    api/uploads/            upload endpoint (admins only)
    uploads/[name]/         serves uploaded files
  db/                       Drizzle schema and client
  lib/                      session, auth check, pages, header/footer, global widgets, uploads
  puck/                     widget config, sections, fields, templates, animations
  proxy.ts                  redirects signed-out users away from /admin
scripts/                    seed, example pages, one-off migrations
```

## Database scripts

| Command | What it does |
| --- | --- |
| `npm run setup` | `db:push` + `db:seed`: create tables, the first admin and a Home page |
| `npm run db:push` | Apply `src/db/schema.ts` to the database (run after pulling schema changes) |
| `npm run db:seed` | Create the admin from `.env` and a Home page (safe to re-run) |
| `npm run db:landing` | Create a published example page from a template (see step 6) |
| `npm run db:studio` | Browse the database in Drizzle Studio |
| `npm run db:generate` / `db:migrate` | Versioned migrations, if you prefer them to `push` |

## Deploying to Vercel (with all your local content)

On Vercel the database lives on **Turso** (hosted SQLite) and uploaded images/videos on **Vercel Blob**.
The code switches automatically: with `BLOB_READ_WRITE_TOKEN` set, editor uploads go to Blob; without it they are
saved to `data/uploads` as before.

### 1. Create the Turso database

1. Sign up at https://turso.tech and click **Create Database** (e.g. `belovedtan`). Note the region.
2. Copy the database **URL** (`libsql://…turso.io`) and create a **token** with read & write access.

### 2. Create the Vercel project and Blob store

1. Sign up at https://vercel.com with GitHub, then **Add New… → Project** and import this repository.
2. Add these **Environment Variables** before the first deploy:

   | Name | Value |
   | --- | --- |
   | `DATABASE_URL` | your Turso URL |
   | `DATABASE_AUTH_TOKEN` | your Turso token |
   | `SESSION_SECRET` | a new long random string |

3. Click **Deploy**.
4. In the project, open **Storage → Create → Blob**, create a store and **connect it to this project**. Vercel adds
   `BLOB_READ_WRITE_TOKEN` to the project automatically. Copy the token too (Storage → your store → **.env.local**
   tab); you need it once in the next step.
5. **Redeploy** (Deployments → ⋯ → Redeploy) so the site picks up the Blob token.

### 3. Copy your local content online

From your computer, in the project folder (PowerShell):

```powershell
$env:TARGET_DATABASE_URL = "libsql://your-db.turso.io"
$env:TARGET_DATABASE_AUTH_TOKEN = "your-turso-token"
$env:BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_…"
npm run deploy:data
```

This creates the tables on Turso, uploads everything in `data/uploads/` to Vercel Blob, and copies every user, page,
header/footer and global widget, with image links pointing at the uploaded copies. Your local database and files are
only read, never changed. It refuses to overwrite a database that already has content; run
`npm run deploy:data -- --replace` to replace the online content with your local content again.

Then open `https://your-project.vercel.app/admin` and sign in with your **local** admin email and password.

### Updating

- **Code:** `git push` to `main`; Vercel redeploys automatically.
- **Content:** edit it directly in the online admin panel. (Running `deploy:data -- --replace` again overwrites
  online edits with your local data.)
- **Schema changes:** if `src/db/schema.ts` changes, re-run `npm run deploy:data -- --replace`, or run
  `npm run db:push` with `DATABASE_URL` / `DATABASE_AUTH_TOKEN` set to the Turso values.

### Other hosts

On a VPS with a persistent disk no extra services are needed: copy the project and the `data/` folder, create
`.env`, then `npm install`, `npm run build` and `npm start` (behind PM2 and Nginx/Caddy for HTTPS).

Always use a unique `SESSION_SECRET` in production.
