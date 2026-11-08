//  Bootstrap's  light and dark mode switch and choice save 
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

// Jobs used by the Tasks and Analytics pages

// Read the saved jobs array, or give an empty array if there are none
function loadJobs() {
  let savedJobs = localStorage.getItem("jobs");

  if (savedJobs === null) {
    return [];
  }
  return JSON.parse(savedJobs);
}

// Save the jobs array
function saveJobs(jobs) {
  localStorage.setItem("jobs", JSON.stringify(jobs));
}

// Find the position of a job in the array by its id (-1 if not found)
function findJobIndex(jobs, id) {
  for (let i = 0; i < jobs.length; i++) {
    if (jobs[i].id === id) {
      return i;
    }
  }
  return -1;
}

// Bootstrap colour classes for each priority
function getPriorityClass(priority) {
  if (priority === "High") {
    return "bg-danger text-white";
  } else if (priority === "Medium") {
    return "bg-warning text-dark";
  } else {
    return "bg-success text-white";
  }
}

// Latest activity for Home page

// Read the saved activity list, or give an empty array
function loadActivity() {
  let savedActivity = localStorage.getItem("activity");
  if (savedActivity === null) {
    return [];
  }
  return JSON.parse(savedActivity);
}

// Add a message to the top of the activity list 
function addActivity(text) {
  let activity = loadActivity();

  activity.unshift({
    text: text,
    date: new Date().toLocaleString()
  });

  if (activity.length > 5) {
    activity.pop();
  }

  localStorage.setItem("activity", JSON.stringify(activity));
}

loadSavedTheme();