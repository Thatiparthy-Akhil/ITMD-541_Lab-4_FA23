// Adding dom event listners and getting references to the buttons from HTML.
document.addEventListener('DOMContentLoaded', function () {
  const getCurrentLocationBtn = document.getElementById('getCurrentLocation');
  const searchLocationBtn = document.getElementById('searchLocation');

   // Attaching the event listeners to the buttons
  getCurrentLocationBtn.addEventListener('click', getCurrentLocation);
  searchLocationBtn.addEventListener('click', searchLocation);
});

//getCurrentLocation function to get the current location.
function getCurrentLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          function (position) {
              const { latitude, longitude } = position.coords;
              getSunriseSunsetData(latitude, longitude);
          },
          function (error) {
              handleLocationError(error.message);
          }
      );
  } else {
      handleLocationError('Geolocation is not supported by your browser.');
  }
}

//searchLocation function to search any loaction using geocoding API.
// ...

async function searchLocation() {
  const locationInput = document.getElementById('locationInput').value;

  if (!locationInput) {
    // Display pop-up message if location input is empty.
    alert('Please enter the location');
    return;
  }

  // Use geocode API to get latitude and longitude.
  const geocodeUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(locationInput)}`;

  try {
    const response = await fetch(geocodeUrl);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    // Check if the response contains valid latitude and longitude
    if (data && data.length > 0 && data[0].lat && data[0].lon) {
      const lat = data[0].lat;
      const lon = data[0].lon;
      getSunriseSunsetData(lat, lon);

      // Clearing the search input after the user searched for any location.
      document.getElementById('locationInput').value = '';
    } else {
      // Display a message when the location is not found
      clearDashboard();
      alert('Location not found. Please enter a valid location.');
    }
  } catch (error) {
    // Clear the dashboard in case of an error
    clearDashboard();
  }
}

// Function to clear the dashboard content
function clearDashboard() {
  const dashboard = document.getElementById('dashboard');
  dashboard.innerHTML = '';
  dashboard.classList.add('hidden');
  document.getElementById('locationInput').value = '';
}


//getSunriseSunsetData function to get deatils of the sunrise and sunset times searched by the user.
function getSunriseSunsetData(latitude, longitude) {
  
   // Getting today's data
    const todayUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=today&formatted=0`;
  
    // Getting tomorrow's data
    const tomorrowUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=tomorrow&formatted=0`;
  
    // Fetching today's data
    fetch(todayUrl)
      .then(response => response.json())
      .then(dataToday => {
        // Fetching tomorrow's data
        fetch(tomorrowUrl)
          .then(response => response.json())
          .then(dataTomorrow => {
            updateDashboard(dataToday.results, dataTomorrow.results);
          })
          .catch(error => {
            handleApiError(error.message);
          });
      })
      .catch(error => {
        handleApiError(error.message);
      });
      
  }

// function for updating the dashboard 
function updateDashboard(dataToday, dataTomorrow) {
  
      console.log(dataToday, dataTomorrow); // Log the complete API responses for inspection
  
    const dashboard = document.getElementById('dashboard');
    const sunriseToday = dataToday.sunrise;
    const sunsetToday = dataToday.sunset;
    const dawnToday = dataToday.civil_twilight_begin || dataToday.dawn; // Adjust property names accordingly
    const duskToday = dataToday.civil_twilight_end || dataToday.dusk; // Adjust property names accordingly
    const dayLengthToday = dataToday.day_length;
    const solarNoonToday = dataToday.solar_noon;
    const timeZone = dataToday.timezone;
  
    const sunriseTomorrow = dataTomorrow.sunrise;
    const sunsetTomorrow = dataTomorrow.sunset;
    const dawnTomorrow = dataTomorrow.civil_twilight_begin || dataTomorrow.dawn; // Adjust property names accordingly
    const duskTomorrow = dataTomorrow.civil_twilight_end || dataTomorrow.dusk; // Adjust property names accordingly
    const dayLengthTomorrow = dataTomorrow.day_length;
    const solarNoonTomorrow = dataTomorrow.solar_noon;
  
    // Updating the dashboard content
    dashboard.innerHTML = `
    <div class="day-container today">
      <p><strong>Today:</strong></p>
      <p>Sunrise: ${sunriseToday}</p>
      <p>Sunset: ${sunsetToday}</p>
      <p>Dawn: ${dawnToday}</p>
      <p>Dusk: ${duskToday}</p>
      <p>Day Length: ${dayLengthToday}</p>
      <p>Solar Noon: ${solarNoonToday}</p>
      <p>Time Zone: ${timeZone}</p>
      </div>

      <div class="day-container tomorrow">
      <p><strong>Tomorrow:</strong></p>
      <p>Sunrise: ${sunriseTomorrow}</p>
      <p>Sunset: ${sunsetTomorrow}</p>
      <p>Dawn: ${dawnTomorrow}</p>
      <p>Dusk: ${duskTomorrow}</p>
      <p>Day Length: ${dayLengthTomorrow}</p>
      <p>Solar Noon: ${solarNoonTomorrow}</p>
      <p>Time Zone: ${timeZone}</p>
      </div>
    `;
  
    // Showing the dashboard
    dashboard.classList.remove('hidden');
  }

//function for handling errors.
function handleLocationError(errorMessage) {
  const errorSection = document.getElementById('errorSection');
  errorSection.innerHTML = `<p>${errorMessage}</p>`;
  errorSection.classList.remove('hidden');
  // Showing error message as a pop-up
  alert(errorMessage);
}

function handleApiError(errorMessage) {
  const errorSection = document.getElementById('errorSection');
  errorSection.innerHTML = `<p>${errorMessage}</p>`;
  errorSection.classList.remove('hidden');
  // Show error message as a pop-up
  alert(errorMessage);
}


