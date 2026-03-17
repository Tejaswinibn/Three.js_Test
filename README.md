
# Enable Talent — Landing Page

Short description
This is the landing-page for Enable Talent, a web app that helps employers and organisations find, evaluate, and hire talented people with disabilities. The app focuses on accessibility, discoverability, and inclusive hiring resources.

Live site


Key features
- Accessible, responsive UI built with Next.js and Tailwind CSS
- Navigation, event listings, programs & awards, and resources for employers and talents
- Minimal, tree-shakable icons via lucide-react (used for chevrons, etc.)
- Mobile-friendly hamburger menu and desktop dropdowns
- Static/public assets under /public (logos, icons, images)

Tech stack
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- lucide-react (icons)
- PostCSS, ESLint

Repository structure (relevant)
- app/ — Next.js app routes and pages
- components/ — shared React components (Header, etc.)
- public/ — assets (icons, images, logo)
- styles/globals.css — global styles
- next.config.ts, tsconfig.json, package.json, postcss.config.mjs, eslint.config.mjs

Requirements
- Node.js 18+ (or the version used by your environment)
- npm or pnpm

Quick start (development)
1. Install dependencies
   npm install

2. Run the dev server
   npm run dev
   Open http://localhost:3000

Build for production
- npm run build
- npm start

Useful scripts (from package.json)
- dev — run development server
- build — build production app
- start — run production server
- lint — run ESLint (if configured)

Accessibility & inclusive design
- Use semantic HTML, ARIA attributes where needed, and meaningful alt text for images
- Focus states and keyboard navigation are important for users relying on keyboards or assistive tech
- Maintain high color contrast and legible font sizes

Customisation / environment
- No secret environment variables are required for the static landing page by default.
- If you add APIs or secrets, add them to a .env.local and document their usage.

Contributing
1. Fork the repo and create a branch for your feature/fix
2. Follow existing code style (TypeScript + Tailwind utility classes)
3. Run linting locally and add tests if applicable
4. Open a PR with a clear summary of changes


Contact / Maintainers
- Project maintained by the Enable Talent team. Add contact details or links here.
