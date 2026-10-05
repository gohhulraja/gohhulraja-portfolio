# Gohhul Raja — Portfolio CMS

A full-stack personal portfolio with:

- React + Vite
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- One private admin login
- Editable profile, bio, hero text, current idea, links and profile image
- Add/edit/delete projects
- Add/edit/delete Instagram-style posts
- Image uploads
- Public portfolio pages
- Responsive dark cinematic UI

## 1. Install

```bash
npm install
```

## 2. Create Supabase project

Create a project at https://supabase.com/.

Then open the SQL Editor and run:

`supabase/schema.sql`

## 3. Create the only admin account

In Supabase:

Authentication → Users → Add user

Create exactly:

`gohhulraja@gmail.com`

Use your chosen admin password there. The password is deliberately NOT stored in this project.

The SQL policies restrict write access to this email address. Supabase RLS is the security boundary; the React check is only a UI guard.

## 4. Get API settings

Supabase Dashboard → Project Settings → API.

Copy:

- Project URL
- Publishable key

Create `.env` in the project root:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Never put a Supabase `service_role` key in this React app.

## 5. Run

```bash
npm run dev
```

Open:

`http://localhost:5173/`

Admin:

`http://localhost:5173/admin`

## 6. Deploy

Deploy the project to Vercel or another static hosting provider.

Add the same two environment variables in the hosting provider.

Because the content lives in Supabase, you can edit the portfolio from any device after deployment.

## Security

The browser contains only the Supabase publishable key. Database write permissions are protected by Row Level Security and the authenticated admin email. The admin password is handled by Supabase Auth and is never hardcoded into JavaScript.
