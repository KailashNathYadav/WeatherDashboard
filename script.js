document.addEventListener("DOMContentLoaded", () => {
  const currentWeatherDataId = document.getElementById("currentWeatherDataId");
  const forecastWeatherDataId = document.getElementById(
    "forecastWeatherDataId"
  );
  const weatherDataButtonId = document.getElementById("weatherDataButtonId");
  const cityEnteredInputId = document.getElementById("cityEnteredInputId");
  
  const apiKey = "3554e71529253ba1dba0c57b6f512daf";
  const todayDate = new Date();

  function displayCurrentWeatherData(currentWeatherData) {
    // temperature,humidity,wind speed,icon
    currentWeatherDataId.innerHTML = `
    <div class="container bg-primary m-2 d-flex flex-row justify-content-evenly rounded-2">
        <div>
          <img src="https://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@4x.png" alt="weather-icon">
          <p>${currentWeatherData.weather[0].main}</p>
        </div>
        <div class="d-flex flex-column justify-content-evenly">
          <h5>Date: ${todayDate.toUTCString().substring(4,16)}</h5>
          <h5>Temp: ${currentWeatherData.main.temp}</h5>
          <h5>Humidity: ${currentWeatherData.main.humidity}</h5>
          <h5>Wind Speed: ${currentWeatherData.wind.speed}</h5>
        </div>
    </div>
    `;
  }

  function displayForecastWeatherData(forecastWeatherData) {
    // Temperature,humidity,wind speed,icon
    // Here we are getting data for every 3 hr so filter data for each day uniquely
    const forecastingDataDone = [];
    const fiveDayWeatherData = [];
    forecastingDataDone.push(forecastWeatherData.list[0].dt_txt.substring(0,10));
    forecastWeatherData.list.forEach((data)=>{
      if(!forecastingDataDone.includes(data.dt_txt.substring(0,10))){
        fiveDayWeatherData.push(data);
        forecastingDataDone.push(data.dt_txt.substring(0,10));
      }
    });
    
    // Now proceding to display data
    forecastWeatherDataId.innerHTML = ``;
    fiveDayWeatherData.forEach((data)=>{
      forecastWeatherDataId.innerHTML += `
      <div class="bg-primary m-1 p-1 rounded-2">
        <div>
          <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="weather-icon">
          <p>${data.weather[0].main}</p>
        </div>
        <div>
          <h6>Date: ${data.dt_txt.substring(0,10)}</h6>
          <h6>Temp: ${data.main.temp}</h6>
          <h6>Humidity: ${data.main.humidity}</h6>
          <h6>Wind Speed: ${data.wind.speed}</h6>
        </div>
    </div>
      `
    })
  }

  async function fetchCurrentWeatherData(city){
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      if(!response.ok)  throw new Error("Unable to fetch current weather data");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching current weather data: 👎", error);
    }
  };

  async function fetchForecastWeatherData(city){
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      if(!response.ok)  throw new Error("Unable to fetch 5 days forecast weather data");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching 5-days forecast weather data: 👎", error);
    }
  };

  weatherDataButtonId.addEventListener("click", async (event) => {
    const cityEntered = cityEnteredInputId.value.trim();
    const currentWeatherData = await fetchCurrentWeatherData(cityEntered);
    const forecastWeatherData = await fetchForecastWeatherData(cityEntered);
    if (currentWeatherData && forecastWeatherData) {
      displayCurrentWeatherData(currentWeatherData);
      displayForecastWeatherData(forecastWeatherData);
      // add the functionality of local storage
      localStorage.setItem('lastCity', cityEntered);
    }
  });

  // Check if there's a last searched city in local storage and display its info.
  const lastCity = localStorage.getItem('lastCity');
  if(lastCity){
    cityEnteredInputId.value = lastCity;
    button.dispatchEvent(new Event('click'));
  }
  
});
