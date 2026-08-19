const repositoryList = document.querySelector("#repository-list");
const repositoryCount = document.querySelector("#repository-count");

function formatStars(stars) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(stars);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(`${date}T00:00:00`));
}

function renderRepositories(repositories) {
  repositoryCount.textContent = `${repositories.length} repositories`;
  repositoryList.replaceChildren();

  repositories.forEach((repository) => {
    const article = document.createElement("article");
    article.className = "repository";

    const heading = document.createElement("h3");
    const link = document.createElement("a");
    link.href = repository.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = `${repository.owner} / ${repository.name}`;
    heading.append(link);

    const date = document.createElement("time");
    date.className = "repository-date";
    date.dateTime = repository.starred_at;
    date.textContent = `Starred ${formatDate(repository.starred_at)}`;

    const description = document.createElement("p");
    description.textContent = repository.description;

    const metadata = document.createElement("div");
    metadata.className = "repository-meta";
    metadata.innerHTML = `<span>${repository.language}</span><span>${formatStars(repository.stars)} stars</span>`;

    article.append(heading, date, description, metadata);
    repositoryList.append(article);
  });
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    renderRepositories(await response.json());
  } catch (error) {
    repositoryCount.textContent = "Unavailable";
    repositoryList.innerHTML = "<p class=\"status\">Could not load the repository list.</p>";
    console.error(error);
  }
}

loadRepositories();