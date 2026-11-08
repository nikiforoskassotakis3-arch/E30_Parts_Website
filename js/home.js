// Latest activity list
function showActivity() {
  let activityList = document.getElementById("activityList");
  let activity = loadActivity();

  // IF thers nothing yet, keep the "No activity yet" item from the HTML
  if (activity.length === 0) {
    return;
  }
  activityList.innerHTML = "";

  for (let i = 0; i < activity.length; i++) {
    let item = document.createElement("li");
    item.className = "list-group-item";
    item.textContent = activity[i].text;

    let date = document.createElement("span");
    date.className = "text-secondary ms-2";
    date.textContent = "(" + activity[i].date + ")";

    item.appendChild(date);
    activityList.appendChild(item);
  }
}

// Get  weather in Athens from the Open-Meteo API
function showWeather() {
  let weatherText = document.getElementById("weatherText");
  let url = "https://api.open-meteo.com/v1/forecast?latitude=37.98&longitude=23.73&current=temperature_2m,wind_speed_10m";

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      weatherText.textContent = "Temperature: " + data.current.temperature_2m + " °C, wind: " + data.current.wind_speed_10m + " km/h";
    })
    .catch(function () {
      weatherText.textContent = "Weather is not available right now.";
    });
}
showActivity();
showWeather();