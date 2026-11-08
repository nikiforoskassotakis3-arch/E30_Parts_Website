let jobs = loadJobs();

// id of the job being edited (0 means we are adding a new job)
let editingId = 0;

// Give a new job the next free id
function getNextId() {
  let nextId = 1;
  for (let i = 0; i < jobs.length; i++) {
    if (jobs[i].id >= nextId) {
      nextId = jobs[i].id + 1;
    }
  }
  return nextId;
}

// Return the jobs that match the search and filters, sorted
function getVisibleJobs() {
  let search = document.getElementById("searchInput").value.toLowerCase();
  let status = document.getElementById("statusFilter").value;
  let priority = document.getElementById("priorityFilter").value;
  let sortBy = document.getElementById("sortBy").value;
  let list = [];

  for (let i = 0; i < jobs.length; i++) {
    let job = jobs[i];

    // Live search in the name and the description
    let inName = job.name.toLowerCase().indexOf(search) !== -1;
    let inDescription = job.description.toLowerCase().indexOf(search) !== -1;
    let matchesSearch = inName || inDescription;

    // Status filter 
    let matchesStatus = true;
    if (status === "Pending") {
      matchesStatus = job.status !== "Completed";
    } else if (status === "Completed") {
      matchesStatus = job.status === "Completed";
    }

    // Priority filter
    let matchesPriority = priority === "All" || job.priority === priority;
    if (matchesSearch && matchesStatus && matchesPriority) {
      list.push(job);
    }
  }

  // Sort by due date or by job name
  list.sort(function (a, b) {
    let first = a.dueDate;
    let second = b.dueDate;
    if (sortBy === "name") {
      first = a.name.toLowerCase();
      second = b.name.toLowerCase();
    }
    if (first < second) {
      return -1;
    }
    if (first > second) {
      return 1;
    }
    return 0;
  });
  return list;
}

// Show the jobs in the table
function showJobs() {
  let tableBody = document.getElementById("taskTableBody");
  let list = getVisibleJobs();
  tableBody.innerHTML = "";
  if (jobs.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-secondary">No jobs yet. Add your first job above.</td></tr>';
  } else if (list.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-secondary">No jobs match your search or filters.</td></tr>';
  }

 
  for (let i = 0; i < list.length; i++) {
    let job = list[i];
    let row = tableBody.insertRow();

    let cell = row.insertCell(0);
    cell.textContent = job.name;

    cell = row.insertCell(1);
    cell.textContent = job.description;

    cell = row.insertCell(2);
    cell.textContent = job.dueDate;

    // Priority with its colour
    cell = row.insertCell(3);
    let badge = document.createElement("span");
    badge.className = "px-2 py-1 rounded-2 " + getPriorityClass(job.priority);
    badge.textContent = job.priority;
    cell.appendChild(badge);

    cell = row.insertCell(4);
    cell.textContent = job.status;

    // Action buttons
    cell = row.insertCell(5);
    let buttons = "";
    if (job.status !== "Completed") {
      buttons = buttons + '<button type="button" class="btn btn-success btn-sm me-1 mb-1" onclick="completeJob(' + job.id + ')">Complete</button>';
    }
    buttons = buttons + '<button type="button" class="btn btn-warning btn-sm me-1 mb-1" onclick="editJob(' + job.id + ')">Edit</button>';
    buttons = buttons + '<button type="button" class="btn btn-danger btn-sm mb-1" onclick="deleteJob(' + job.id + ')">Delete</button>';

    cell.innerHTML = buttons;
  }
  showSummary();
}

// Show the total, pending and completed numbers
function showSummary() {
  let completed = 0;

  for (let i = 0; i < jobs.length; i++) {
    if (jobs[i].status === "Completed") {
      completed++;
    }
  }
  document.getElementById("totalCount").textContent = jobs.length;
  document.getElementById("pendingCount").textContent = jobs.length - completed;
  document.getElementById("completedCount").textContent = completed;
}

// Empty the form and go back to "add" mode
function clearForm() {
  editingId = 0;
  document.getElementById("taskName").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskDueDate").value = "";
  document.getElementById("taskPriority").value = "Medium";
  document.getElementById("formMessage").textContent = "";
  document.getElementById("addButton").innerHTML = '<i class="bi bi-plus-circle"></i> Add job';
}

// Add a new job, or save the changes to the job being edited
function addJob() {
  let name = document.getElementById("taskName").value;
  let description = document.getElementById("taskDescription").value;
  let dueDate = document.getElementById("taskDueDate").value;
  let priority = document.getElementById("taskPriority").value;

  // Check that the required fields are filled in
  if (name === "" || dueDate === "") {
    document.getElementById("formMessage").textContent = "Please enter a job name and a due date.";
    return;
  }

  if (editingId === 0) {
    // Add a new job
    let job = {
      id: getNextId(),
      name: name,
      description: description,
      dueDate: dueDate,
      priority: priority,
      status: "To do"
    };

    jobs.push(job);
    addActivity("Job added: " + name);
  } else {
    // Save the changes to the job being edited
    let index = findJobIndex(jobs, editingId);

    jobs[index].name = name;
    jobs[index].description = description;
    jobs[index].dueDate = dueDate;
    jobs[index].priority = priority;
    addActivity("Job edited: " + name);
  }
  saveJobs(jobs);
  clearForm();
  showJobs();
}

// Put a job's details in the form so they can be changed
function editJob(id) {
  let index = findJobIndex(jobs, id);

  document.getElementById("taskName").value = jobs[index].name;
  document.getElementById("taskDescription").value = jobs[index].description;
  document.getElementById("taskDueDate").value = jobs[index].dueDate;
  document.getElementById("taskPriority").value = jobs[index].priority;
  document.getElementById("formMessage").textContent = "";
  document.getElementById("addButton").innerHTML = '<i class="bi bi-save"></i> Save changes';

  editingId = id;
}

// Mark a job as completed
function completeJob(id) {
  let index = findJobIndex(jobs, id);

  jobs[index].status = "Completed";
  addActivity("Job completed: " + jobs[index].name);
  saveJobs(jobs);
  showJobs();
}

// Delete a job
function deleteJob(id) {
  let index = findJobIndex(jobs, id);

  addActivity("Job deleted: " + jobs[index].name);
  jobs.splice(index, 1);

  // If this job was in the form, empty the form
  if (id === editingId) {
    clearForm();
  }

  saveJobs(jobs);
  showJobs();
}

// Update the table while the user types or changes a filter
document.getElementById("searchInput").addEventListener("input", showJobs);
document.getElementById("statusFilter").addEventListener("change", showJobs);
document.getElementById("priorityFilter").addEventListener("change", showJobs);
document.getElementById("sortBy").addEventListener("change", showJobs);

// Show the saved jobs as soon as the page opens
showJobs();