const apiKey = "df003a169969596fef3f0a8c14c23060";
const input = document.getElementById("input");
const btnEl = document.getElementById("btn");
const imgbox = document.getElementById("img-box");
const staringDisplayLeft = document.getElementById("starting");
const leftMain = document.getElementById("left-main");
const staringDisplayRight = document.getElementById("starting-right");
const rightBox = document.getElementById("rightbox");
const errorBox = document.getElementById("errorbox");

btnEl.addEventListener("click", () => {
  if (input.value.trim() === "") {
    alert("please enter city name");
  } else {
    fetchData();
    fourDaysWeather();
    staringDisplayRight.style.display = "none";
    staringDisplayLeft.style.display = "none";
    input.value = "";
  }
});
input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    fetchData();
    fourDaysWeather();
    staringDisplayRight.style.display = "none";
    staringDisplayLeft.style.display = "none";
    input.value = "";
  } else if (input.value.trim() === "") {
    input.value = "";
  }
});

async function fetchData() {
  //fetching Api

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  //error
  function error() {
    if (data.cod === 200) {
      rightBox.style.display = "block";
      staringDisplayLeft.style.display = "none";
      errorBox.style.display = "none";
      leftMain.style.display = "block";
    } else {
      staringDisplayLeft.style.display = "block";
      errorBox.style.display = "block";
      rightBox.style.display = "none";
      leftMain.style.display = "none";
    }
  }
  error();

  //time
  //left-box
  function date() {
    // Extract timestamp and convert to date
    const timestamp = data.dt; // 'dt' contains the timestamp
    const date = new Date(timestamp * 1000); // Convert to milliseconds

    // Format the date to "3 November 2024"
    const day = date.getDate();
    const monthOptions = { month: "long" }; // Full month name
    const month = new Intl.DateTimeFormat("en-US", monthOptions).format(date);
    const year = date.getFullYear();
    const formattedDate = `${day} ${month} ${year}`;

    // Get the day of the week
    const dayOptions = {
      weekday: "long",
    };
    const formattedDay = new Intl.DateTimeFormat("en-US", dayOptions).format(
      date
    );

    document.getElementById(
      "day"
    ).textContent = `${formattedDay.toUpperCase()}`;
    document.getElementById("date").textContent = `${formattedDate}`;
  }
  date();

  // update weather

  if (data.weather[0].icon) {
    imgbox.innerHTML = "";
    let img = document.createElement("img");
    img.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    img.className = "imgmain";
    imgbox.appendChild(img);
  }

  document.getElementById("tempmain").textContent = `${Math.round(
    data.main.temp
  )}°C`;
  document.getElementById(
    "condition"
  ).textContent = `${data.weather[0].description.toUpperCase()}`;

  //right-box
  document.getElementById(
    "flag"
  ).src = `https://flagsapi.com/${data.sys.country}/flat/64.png`;
  document.getElementById("countrycode").textContent = `(${data.sys.country})`;

  document.getElementById("name").textContent = `${data.name}`;
  document.getElementById("temp").textContent = `${Math.round(
    data.main.temp
  )}°C`;
  document.getElementById("humidity").textContent = `${data.main.humidity}%`;
  document.getElementById("windspeed").textContent = `${data.wind.speed} Km/h`;
}

async function fourDaysWeather() {
  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${input.value}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error("Failed to fetch weather data");
      return;
    }

    const data = await response.json();

    // Ensure the list has enough items
    const requiredIndices = [8, 16, 24, 32];
    if (!data.list || data.list.length < Math.max(...requiredIndices)) {
      console.error("Insufficient forecast data.");
      return;
    }

    // Reusable function to update forecast boxes
    const updateForecastBox = (boxNumber, dataIndex) => {
      const dataList = data.list[dataIndex];

      // Update image
      const imgBox = document.getElementById(`img-box${boxNumber}`);
      if (imgBox) {
        imgBox.innerHTML = ""; // Clear existing content
        const img = document.createElement("img");
        img.src = `https://openweathermap.org/img/wn/${dataList.weather[0].icon}@2x.png`;
        img.className = "img-last-box";
        imgBox.appendChild(img);
      }

      // Update day
      const dayElement = document.getElementById(`first-box-day${boxNumber}`);
      if (dayElement) {
        const timestamp = dataList.dt;
        const date = new Date(timestamp * 1000);
        const formattedDay = new Intl.DateTimeFormat("en-US", {
          weekday: "short",
        }).format(date);
        dayElement.textContent = formattedDay;
      }

      // Update temperature
      const tempElement = document.getElementById(`first-box-temp${boxNumber}`);
      if (tempElement) {
        tempElement.textContent = `${Math.round(dataList.main.temp)}°C`;
      }

      // Update description
      const descriptionElement = document.getElementById(
        `first-box-des${boxNumber}`
      );
      if (descriptionElement) {
        descriptionElement.textContent = dataList.weather[0].description;
      }
    };

    // Update all forecast boxes
    requiredIndices.forEach((dataIndex, index) => {
      updateForecastBox(index + 1, dataIndex); // Box numbers are 1-based
    });
  } catch (error) {
    console.error("Error fetching forecast data:", error);
  }
}
