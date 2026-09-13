# Cláudio Victor — Portfolio

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![GitHub](https://img.shields.io/badge/GitHub-claudiovictors-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/claudiovictors)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-claudiovictor-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/claudiovictor/)

Personal portfolio of **Cláudio Manuel Victor**, a **Full-Stack Developer** focused on backend systems, PHP, Go, RESTful APIs, and business applications based in Luanda, Angola.

---

## ⚡ Features & Highlights

- **Dark / Light Theme Mode**: Smooth theme toggling with system preference detection and `localStorage` persistence.
- **Dynamic Projects & GitHub Sync**: Real-time integration with the GitHub REST API (`/users/claudiovictors/repos`) with graceful static fallback for offline or rate-limited environments.
- **Technical SEO Ready**:
  - Semantic HTML5 structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
  - Single, structured `<h1>` hierarchy.
  - Complete Schema.org JSON-LD structured data (`WebSite`, `ProfilePage`, `Person`).
  - Open Graph and Twitter Cards (`summary_large_image`) with 1200x630 custom social preview card.
  - Complete favicon set (`favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`).
  - Accessible Skip Link (`Skip to main content`).
- **Production Files Included**:
  - `robots.txt` and `sitemap.xml` for search engine crawlers.
  - Custom `404.html` error page with quick navigation back home.
  - `vercel.json` configured with clean URLs, immutable asset caching, and security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).

---

## 🛠️ Tech Stack

- **Core**: HTML5, Modern CSS3 (CSS Variables, Flexbox, CSS Grid), Vanilla JavaScript (ES6+)
- **Build Tool**: Vite (Lightning-fast development and optimized production bundling)
- **Icons**: Boxicons CDN
- **Fonts**: Inter, JetBrains Mono, Syne
- **Hosting**: Ready for Vercel, GitHub Pages, Netlify, or any static hosting service

---

## 📁 Project Structure

```text
├── public/
│   ├── assets/
│   │   ├── apple-touch-icon.png     # Apple touch icon (180x180)
│   │   ├── favicon-16x16.png        # Favicon 16x16
│   │   ├── favicon-32x32.png        # Favicon 32x32
│   │   ├── favicon.ico              # Multi-resolution ICO
│   │   ├── og-image.png             # Social card banner (1200x630)
│   │   └── profile.jpg              # Profile image
│   ├── 404.html                     # Custom 404 error page
│   ├── favicon.ico                  # Root favicon
│   ├── robots.txt                   # Crawler guidelines & sitemap link
│   └── sitemap.xml                  # XML sitemap
├── .env.example
├── .gitignore
├── index.html                       # Main portfolio entry point
├── package.json
├── README.md                        # Documentation
├── script.js                        # Client logic, theme toggle, GitHub fetch
├── style.css                        # Design system & responsive styles
├── tsconfig.json
├── vercel.json                      # Vercel deployment configuration
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your machine.

### 1. Clone the repository

```bash
git clone https://github.com/claudiovictors/portfolio.git
cd portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production

```bash
npm run build
```

The output will be placed in the `dist/` directory, ready to deploy.

---

## 🌐 Deploy to Vercel

The project includes a ready-to-use `vercel.json` file.

1. Push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: initial commit with SEO and Vercel optimization"
   git branch -M main
   git remote add origin https://github.com/claudiovictors/<REPO_NAME>.git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework Preset: **Vite** (detected automatically).
5. Click **"Deploy"**.

> 💡 **Live Production Domain**: Deployed at [`https://claudiovictor.vercel.app/`](https://claudiovictor.vercel.app/). All canonical SEO tags, Open Graph meta tags, Schema.org JSON-LD data, `robots.txt`, and `sitemap.xml` are aligned with this domain.

---

## 📬 Contact & Socials

- **Developer**: Cláudio Manuel Victor
- **Email**: [barrosclaudio147@gmail.com](mailto:barrosclaudio147@gmail.com)
- **LinkedIn**: [linkedin.com/in/claudiovictor](https://www.linkedin.com/in/claudiovictor/)
- **GitHub**: [github.com/claudiovictors](https://github.com/claudiovictors)
- **Phone**: +244 931 474 092
- **Location**: Luanda, Angola

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
