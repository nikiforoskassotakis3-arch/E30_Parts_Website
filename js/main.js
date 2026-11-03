
function toggleDarkMode() {
  let page = document.querySelector("html");

  if (page.getAttribute("data-bs-theme") === "dark") {
    page.setAttribute("data-bs-theme", "light");
    localStorage.setItem("theme", "light");
  } else {
    page.setAttribute("data-bs-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
}

// When a page opens, use the theme that was saved last time
function loadSavedTheme() {
  let savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.querySelector("html").setAttribute("data-bs-theme", "dark");
  }
}

loadSavedTheme();