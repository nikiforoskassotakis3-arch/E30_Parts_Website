// Check the contact form and show a confirmation pop-up
function sendMessage() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let subject = document.getElementById("subject").value;
  let text = document.getElementById("message").value;
  let message = document.getElementById("contactMessage");

  // All fields are required
  if (name === "" || email === "" || subject === "" || text === "") {
    message.textContent = "Please fill in all the fields.";
    return;
  }

  // Simple email check
  if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
    message.textContent = "Please enter a valid email address.";
    return;
  }

  message.textContent = "";

  alert("Thank you, " + name + "! Your message has been sent.\n\n" +
    "Email: " + email + "\n" +
    "Subject: " + subject + "\n" +
    "Message: " + text);

  // Empty the form
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("subject").value = "";
  document.getElementById("message").value = "";
}