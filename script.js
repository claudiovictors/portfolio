/**
 * Cláudio Manuel Victor — Developer Portfolio
 * Vanilla JavaScript (ES6+)
 * Strictly no frameworks or external UI dependencies
 */

// 1. Projects Data Array (Easily configurable)
const projectsData = [
  {
    id: "slenix",
    name: "Slenix",
    badge: "Framework",
    category: "frameworks",
    icon: "bx-code-alt",
    description: "A PHP framework focused on application architecture, developer productivity and building modern backend applications.",
    technologies: ["PHP", "MySQL", "PostgreSQL", "CLI", "MVC", "REST"],
    github: "https://github.com/claudiovictors/slenix",
    demo: null
  },
  {
    id: "kite",
    name: "Kite",
    badge: "Framework",
    category: "frameworks",
    icon: "bx-terminal",
    description: "A web framework written in Go focused on building backend applications with clean architecture, routing, authentication and database integration.",
    technologies: ["Go", "HTTP", "REST", "Authentication", "Database"],
    github: "https://github.com/claudiovictors",
    demo: null
  },
  {
    id: "pos-systems",
    name: "POS Systems",
    badge: "Business System",
    category: "business",
    icon: "bx-receipt",
    description: "Business management and point-of-sale systems designed around real-world sales, products, customers and operational workflows.",
    technologies: ["PHP", "Laravel", "MySQL", "REST API"],
    github: "https://github.com/claudiovictors",
    demo: null
  },
  {
    id: "ecommerce",
    name: "E-Commerce Platform",
    badge: "Business System",
    category: "business",
    icon: "bx-cart",
    description: "E-commerce applications with product management, business logic, database relationships and backend APIs.",
    technologies: ["PHP", "Laravel", "MySQL", "REST API"],
    github: "https://github.com/claudiovictors",
    demo: null
  },
  {
    id: "vehicle-rental",
    name: "Vehicle Rental System",
    badge: "Production Backend",
    category: "business",
    icon: "bx-car",
    description: "Backend system for managing vehicle rental operations, business rules, databases and rental workflows.",
    technologies: ["PHP", "Backend", "SQL", "REST API"],
    github: "https://github.com/claudiovictors",
    demo: null
  },
  {
    id: "terminal-anime",
    name: "Terminal Anime Streaming",
    badge: "CLI Tool",
    category: "tools",
    icon: "bx-play-circle",
    description: "A terminal-based anime streaming project built as an experiment in Go and CLI application development.",
    technologies: ["Go", "CLI", "HTTP", "Terminal"],
    github: "https://github.com/claudiovictors",
    demo: null
  },
  {
    id: "mini-llm",
    name: "Mini Language Model",
    badge: "Research / AI",
    category: "ai",
    icon: "bx-brain",
    description: "An experimental small language model project created to explore artificial intelligence and language model concepts.",
    technologies: ["Python", "AI", "Machine Learning"],
    github: "https://github.com/claudiovictors",
    demo: null
  }
];

// Fallback Repositories if GitHub API is offline or rate-limited
const fallbackRepos = [
  {
    name: "slenix",
    description: "A PHP framework focused on application architecture, developer productivity and building modern backend applications.",
    language: "PHP",
    html_url: "https://github.com/claudiovictors/slenix",
    stargazers_count: 0,
    forks_count: 0
  },
  {
    name: "kite",
    description: "Web framework written in Go focused on building backend applications with clean architecture and routing.",
    language: "Go",
    html_url: "https://github.com/claudiovictors",
    stargazers_count: 0,
    forks_count: 0
  },
  {
    name: "terminal-anime",
    description: "Terminal-based anime streaming CLI application built with Go.",
    language: "Go",
    html_url: "https://github.com/claudiovictors",
    stargazers_count: 0,
    forks_count: 0
  }
];

// Document Ready Initialization
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavigation();
  initProjectsRender();
  initGitHubIntegration();
  initClipboardActions();
  initScrollObserver();
});

/**
 * Theme Management (Dark by default, toggles to Light)
 */
function initTheme() {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const storedTheme = localStorage.getItem("cv-portfolio-theme");
  
  // Default is dark
  const currentTheme = storedTheme || "dark";
  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const activeTheme = document.documentElement.getAttribute("data-theme") || "dark";
      const newTheme = activeTheme === "dark" ? "light" : "dark";
      applyTheme(newTheme);
      localStorage.setItem("cv-portfolio-theme", newTheme);
    });
  }
}

function applyTheme(theme) {
  const icon = document.getElementById("theme-icon");
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    if (icon) {
      icon.className = "bx bx-moon";
    }
  } else {
    document.documentElement.removeAttribute("data-theme");
    if (icon) {
      icon.className = "bx bx-sun";
    }
  }
}

/**
 * Navigation & Mobile Drawer
 */
function initNavigation() {
  const mobileToggleBtn = document.getElementById("mobile-toggle-btn");
  const mobileNavPanel = document.getElementById("mobile-nav-panel");
  const mobileNavOverlay = document.getElementById("mobile-nav-overlay");
  const mobileMenuIcon = document.getElementById("mobile-menu-icon");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  function closeMobileNav() {
    if (mobileNavPanel) mobileNavPanel.classList.remove("open");
    if (mobileNavOverlay) mobileNavOverlay.style.display = "none";
    if (mobileMenuIcon) mobileMenuIcon.className = "bx bx-menu";
    if (mobileToggleBtn) mobileToggleBtn.setAttribute("aria-expanded", "false");
  }

  function openMobileNav() {
    if (mobileNavPanel) mobileNavPanel.classList.add("open");
    if (mobileNavOverlay) mobileNavOverlay.style.display = "block";
    if (mobileMenuIcon) mobileMenuIcon.className = "bx bx-x";
    if (mobileToggleBtn) mobileToggleBtn.setAttribute("aria-expanded", "true");
  }

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener("click", () => {
      const isOpen = mobileNavPanel && mobileNavPanel.classList.contains("open");
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener("click", closeMobileNav);
  }

  mobileLinks.forEach(link => {
    link.addEventListener("click", closeMobileNav);
  });

  // Back to top button
  const backToTopBtn = document.getElementById("back-to-top-btn");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/**
 * Render Projects with dynamic category filtering
 */
function initProjectsRender() {
  const projectsContainer = document.getElementById("projects-grid");
  const filterButtons = document.querySelectorAll(".filter-btn");

  if (!projectsContainer) return;

  function renderProjects(filter = "all") {
    projectsContainer.innerHTML = "";
    const filtered = filter === "all" 
      ? projectsData 
      : projectsData.filter(p => p.category === filter);

    filtered.forEach(project => {
      const card = document.createElement("article");
      card.className = "project-card";
      card.id = `project-${project.id}`;

      const techBadges = project.technologies
        .map(tech => `<span class="tech-tag">${escapeHTML(tech)}</span>`)
        .join("");

      card.innerHTML = `
        <div>
          <header class="project-card-header">
            <div class="project-title-area">
              <span class="project-icon" aria-hidden="true">
                <i class="bx ${project.icon}"></i>
              </span>
              <h3 class="project-name">${escapeHTML(project.name)}</h3>
            </div>
            <span class="project-badge">${escapeHTML(project.badge)}</span>
          </header>
          <p class="project-description">${escapeHTML(project.description)}</p>
        </div>
        <div>
          <div class="project-technologies" aria-label="Technologies used">
            ${techBadges}
          </div>
          <footer class="project-footer">
            <a href="${escapeHTML(project.github)}" target="_blank" rel="noopener noreferrer" class="project-link" id="link-github-${project.id}">
              <i class="bx bxl-github"></i> Source Code
            </a>
            ${project.demo ? `
              <a href="${escapeHTML(project.demo)}" target="_blank" rel="noopener noreferrer" class="project-link" id="link-demo-${project.id}">
                <i class="bx bx-link-external"></i> Live Demo
              </a>
            ` : ""}
          </footer>
        </div>
      `;
      projectsContainer.appendChild(card);
    });
  }

  // Initial render
  renderProjects("all");

  // Filter click handlers
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.getAttribute("data-filter") || "all";
      renderProjects(category);
    });
  });
}

/**
 * GitHub API Public Repos Integration
 */
async function initGitHubIntegration() {
  const container = document.getElementById("repos-grid");
  if (!container) return;

  try {
    const response = await fetch("https://api.github.com/users/claudiovictors/repos?sort=updated&per_page=6");
    if (!response.ok) {
      throw new Error(`GitHub API returned status: ${response.status}`);
    }
    const repos = await response.json();
    if (Array.isArray(repos) && repos.length > 0) {
      renderRepositories(repos.slice(0, 6), container);
      return;
    }
  } catch (err) {
    // Graceful fallback to static verified repos
    console.info("Using local repository data fallback:", err.message);
  }

  renderRepositories(fallbackRepos, container);
}

function renderRepositories(repos, container) {
  container.innerHTML = "";
  repos.forEach((repo, idx) => {
    const card = document.createElement("a");
    card.href = repo.html_url || "https://github.com/claudiovictors";
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.className = "repo-card";
    card.id = `repo-card-${idx}`;
    card.setAttribute("aria-label", `View GitHub repository: ${repo.name}`);

    const lang = repo.language || "Backend";
    const langClass = getLangColorClass(lang);

    card.innerHTML = `
      <div>
        <div class="repo-header">
          <h3 class="repo-name">
            <i class="bx bx-book-bookmark" aria-hidden="true"></i>
            <span>${escapeHTML(repo.name)}</span>
          </h3>
          <span class="repo-visibility">Public</span>
        </div>
        <p class="repo-desc">${escapeHTML(repo.description || "Public software repository on GitHub.")}</p>
      </div>
      <div class="repo-meta">
        <span class="repo-lang">
          <span class="lang-bullet ${langClass}"></span>
          ${escapeHTML(lang)}
        </span>
        ${repo.stargazers_count !== undefined ? `
          <span><i class="bx bx-star"></i> ${repo.stargazers_count}</span>
        ` : ""}
        ${repo.forks_count !== undefined ? `
          <span><i class="bx bx-git-repo-forked"></i> ${repo.forks_count}</span>
        ` : ""}
      </div>
    `;
    container.appendChild(card);
  });
}

function getLangColorClass(lang) {
  if (!lang) return "lang-other";
  const lower = lang.toLowerCase();
  if (lower.includes("php")) return "lang-php";
  if (lower.includes("go")) return "lang-go";
  if (lower.includes("python")) return "lang-python";
  if (lower.includes("javascript")) return "lang-javascript";
  return "lang-other";
}

/**
 * Clipboard & Notification Toast
 */
function initClipboardActions() {
  const copyButtons = document.querySelectorAll(".copy-btn");
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-message");

  function showToast(message) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);
  }

  copyButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy");
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        btn.classList.add("copied");
        const originalText = btn.innerHTML;
        btn.innerHTML = `<i class="bx bx-check"></i> Copied`;
        showToast(`Copied "${text}" to clipboard`);
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove("copied");
        }, 2000);
      } catch (e) {
        // Fallback prompt if clipboard API blocked
        showToast(`Selected: ${text}`);
      }
    });
  });
}

/**
 * Scroll Observer for Active Nav Highlighting
 */
function initScrollObserver() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, {
    rootMargin: "-25% 0px -65% 0px"
  });

  sections.forEach(section => observer.observe(section));
}

// Utility: Escape HTML to avoid XSS
function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
