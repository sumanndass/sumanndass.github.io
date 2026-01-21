const username = "sumanndass";
const projectsContainer = document.getElementById("projects");
const filtersContainer = document.querySelector(".filters");
const modal = document.getElementById("projectModal");
const modalClose = document.getElementById("modalClose");

const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalLanguage = document.getElementById("modalLanguage");
const modalStars = document.getElementById("modalStars");
const modalUpdated = document.getElementById("modalUpdated");
const modalLink = document.getElementById("modalLink");

let allProjects = [];

/* -----------------------------
   Dark Mode Toggle
----------------------------- */
const darkToggle = document.getElementById("darkToggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  darkToggle.textContent = "☀️";
}

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  darkToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

/* -----------------------------
   Fetch GitHub Projects
----------------------------- */
fetch(`https://api.github.com/users/${username}/repos?sort=updated`)
  .then(response => response.json())
  .then(repos => {
    allProjects = repos.filter(repo => !repo.fork);
    renderFilters(allProjects);
    renderProjects(allProjects);
  })
  .catch(error => {
    projectsContainer.innerHTML = "<p>Unable to load projects at this time.</p>";
    console.error(error);
  });

/* -----------------------------
   Render Filters
----------------------------- */
function renderFilters(projects) {
  const languages = [...new Set(projects.map(p => p.language).filter(Boolean))].sort();

  languages.forEach(lang => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.lang = lang;
    btn.textContent = lang;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filtered = allProjects.filter(p => p.language === lang);
      renderProjects(filtered);
    });
    filtersContainer.appendChild(btn);
  });

  const allBtn = filtersContainer.querySelector('[data-lang="all"]');
  allBtn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    allBtn.classList.add("active");
    renderProjects(allProjects);
  });
}

/* -----------------------------
   Render Projects
----------------------------- */
function renderProjects(projects) {
  projectsContainer.innerHTML = "";

  projects.forEach(repo => {
    const card = document.createElement("div");
    card.className = "project-card";

    card.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || "No description provided."}</p>
      <div class="meta">
        <span>${repo.language || "Multiple"}</span>
        <span>⭐ ${repo.stargazers_count}</span>
      </div>
    `;

    card.addEventListener("click", () => openModal(repo));
    projectsContainer.appendChild(card);
  });
}

/* -----------------------------
   Modal Logic
----------------------------- */
function openModal(repo) {
  modalTitle.textContent = repo.name;
  modalDescription.textContent = repo.description || "No description provided.";
  modalLanguage.textContent = repo.language || "Multiple";
  modalStars.textContent = repo.stargazers_count;
  modalUpdated.textContent = new Date(repo.updated_at).toLocaleDateString();
  modalLink.href = repo.html_url;

  modal.classList.remove("hidden");
}

modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});
