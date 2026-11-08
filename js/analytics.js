let jobs = loadJobs();

// Fill one progress bar: the number, the bar width and the % text
function setBar(barId, numberId, count, total) {
  let percent = 0;

  if (total > 0) {
    percent = Math.round((count / total) * 100);
  }
  document.getElementById(numberId).textContent = count;
  document.getElementById(barId).style.width = percent + "%";
  document.getElementById(barId).textContent = percent + "%";
}

// Count the jobs and fill all the progress bars
function showProgress() {
  let completed = 0;
  let high = 0;
  let medium = 0;
  let low = 0;

  for (let i = 0; i < jobs.length; i++) {
    if (jobs[i].status === "Completed") {
      completed++;
    }
    if (jobs[i].priority === "High") {
      high++;
    } else if (jobs[i].priority === "Medium") {
      medium++;
    } else {
      low++;
    }
  }

  let total = jobs.length;

  setBar("completedBar", "completedNumber", completed, total);
  setBar("pendingBar", "pendingNumber", total - completed, total);
  setBar("highBar", "highNumber", high, total);
  setBar("mediumBar", "mediumNumber", medium, total);
  setBar("lowBar", "lowNumber", low, total);
}

// Make one job card for the board
function makeCard(job) {
  let card = document.createElement("div");
  card.className = "border rounded-2 p-3 mb-3";

  let title = document.createElement("p");
  title.className = "fw-bold mb-1";
  title.textContent = job.name;
  card.appendChild(title);

  let info = document.createElement("p");
  info.className = "mb-2";
  info.textContent = "Due: " + job.dueDate + " ";

  let badge = document.createElement("span");
  badge.className = "px-2 py-1 rounded-2 " + getPriorityClass(job.priority);
  badge.textContent = job.priority;
  info.appendChild(badge);
  card.appendChild(info);

  // Move buttons depend on the column the job is in
  let buttons = document.createElement("div");

  if (job.status === "To do") {
    buttons.innerHTML = '<button type="button" class="btn btn-warning btn-sm" onclick="moveJob(' + job.id + ', \'In progress\')">Start</button>';
  } else if (job.status === "In progress") {
    buttons.innerHTML = '<button type="button" class="btn btn-secondary btn-sm me-1" onclick="moveJob(' + job.id + ', \'To do\')">Back</button>' +
      '<button type="button" class="btn btn-success btn-sm" onclick="moveJob(' + job.id + ', \'Completed\')">Done</button>';
  } else {
    buttons.innerHTML = '<button type="button" class="btn btn-secondary btn-sm" onclick="moveJob(' + job.id + ', \'In progress\')">Reopen</button>';
  }

  card.appendChild(buttons);
  return card;
}

// Put every job card in the right column
function showBoard() {
  let todoColumn = document.getElementById("todoColumn");
  let progressColumn = document.getElementById("progressColumn");
  let completedColumn = document.getElementById("completedColumn");

  todoColumn.innerHTML = "";
  progressColumn.innerHTML = "";
  completedColumn.innerHTML = "";

  for (let i = 0; i < jobs.length; i++) {
    let card = makeCard(jobs[i]);

    if (jobs[i].status === "To do") {
      todoColumn.appendChild(card);
    } else if (jobs[i].status === "In progress") {
      progressColumn.appendChild(card);
    } else {
      completedColumn.appendChild(card);
    }
  }

  // Empty columns get the "No jobs here yet." text back
  let columns = [todoColumn, progressColumn, completedColumn];

  for (let i = 0; i < columns.length; i++) {
    if (columns[i].innerHTML === "") {
      columns[i].innerHTML = '<p class="text-secondary mb-0">No jobs here yet.</p>';
    }
  }
}

// Move a job to another column: this changes its status
function moveJob(id, newStatus) {
  let index = findJobIndex(jobs, id);

  jobs[index].status = newStatus;
  addActivity("Job moved to " + newStatus + ": " + jobs[index].name);
  saveJobs(jobs);
  showProgress();
  showBoard();
}

showProgress();
showBoard();