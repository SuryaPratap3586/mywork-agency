# MyWorkAgency: public website

Next.js 15 (App Router), TypeScript, Tailwind CSS 4, Framer Motion, Supabase. **No admin code in this project.** Content is managed from the separate `admin/` project (see the README one level up).

## Run
```bash
npm install
cp .env.example .env.local     # SITE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, REVALIDATE_SECRET
npm run dev
```
Run `../database/schema.sql` in Supabase first.

## Pages
Home (long page: hero, client logos, introduction, services, "Everything included", why choose us, statistics, featured work, auto-playing video slider, "How it works", testimonials, team, industries, blog, FAQ, call to action), About, Our Work and project pages, Blog and article pages (table of contents, search, categories, pagination, SEO), Testimonials, Careers and job pages with an application form (private resume upload), Privacy, Terms, 404, sitemap.xml, robots.txt.

Until the database is connected you will see a few clearly-labelled sample projects and posts. Testimonials, jobs and videos never show sample data.

## How it stays up to date
Pages refresh by themselves every minute. When you publish in the admin, it also calls `POST /api/revalidate` (protected by `REVALIDATE_SECRET`) so the change appears immediately.

## Deploy (Vercel)
Import the repo with **Root Directory = `website`**, add the variables from `.env.example`, set `SITE_URL` to your real domain.
