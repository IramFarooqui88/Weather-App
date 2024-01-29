/*
console.log("hello here Iram.");
const API_KEY = "d3b78a54713b50c22ee5df7566eb23c1";

function renderWeatherInfo(data){
     // html me para create kiya
     let newPara = document.createElement('p');
     const temperatureCelsius = (data?.main?.temp - 273.15).toFixed(2);
     newPara.textContent =`${temperatureCelsius} °C`
 
     // document ki body me append kiya
     document.body.appendChild(newPara);   
}

async function fetchWeatherDetail(){

    try{
    let city = "goa";

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
    //pehle call ajay fr  json me convert krege api ko

    const data = await response.json();
    // pehel json me convert ho jay fr print krege

    console.log('weather data : ->', data);

    renderWeatherInfo(data);
}

   catch(err)
   {
    //catch the error
   }  
}

async function getCustomWeatherDetails()
{
    try{
       
    let latitude = 15.6333;
    let longitude = 18.3333;

    let results = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
    let data = await results.json();

    console.log(data);
    }
    catch(err)
    {
        console.log("Error", err);
    }
}

function getLocation()
{
    if(navigator.geolocation) // you are checking whether geolocation feature is supported in your laptop or not 
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
        console.log("No Geolocation Support");
    }
}

function showPosition(position)
{
    let lat = position.coords.latitude;
    let longi = position.coords.longitude;
    
    console.log(lat);
    console.log(longi);
}*/ 

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//current tab need .. ki kaun se tag me hain currently
let currentTab = userTab;
//we need API key
const API_KEY = "d3b78a54713b50c22ee5df7566eb23c1";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab)
{
    // agr hum jis tab pe hain usi pe click kr diya to kuchh krne ki need hi nh hai
    if(clickedTab != currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active"))
        {  //kya search form wala container is invisible then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //mai pehle search wale tab pr thi , ab your weather wale tab ko visible krna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            //weather display krni hai so lets check local storage first for cordinates, if we have saved them there
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});


// check if cordinates are already present in session storage 
function  getfromSessionStorage(){
  
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agr local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const{lat, lon} = coordinates;
    //make grantContainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);  //UI me show bhi to karana hai
    }
    catch(err){
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo){
  //first we have to fetch the elements from html
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  //fetch values from weatherInfo object and put it UI elements
  //weatherInfo ke andr se city ka nam nikalo
  cityName.innerText = weatherInfo?.name;

  //countryicon nikal
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${(weatherInfo?.main?.temp - 273.15).toFixed(2)} °C`;



  windSpeed.innerText =`${weatherInfo?.wind?.speed}m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText =`${weatherInfo?.clouds?.all}%`;
}

function getLocation()
{
    if(navigator.geolocation) // you are checking whether geolocation feature is supported in your laptop or not 
    {  //agr supported hai
        navigator.geolocation.getCurrentPosition(showPosition); //then find out kro location
    }
    else
    {
        console.log("No Geolocation Support");
    }
}

function showPosition(position)
{
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName==="") return;
    else 
    fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
          const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
          const data = await response.json();
          loadingScreen.classList.remove("active");
          userInfoContainer.classList.add("active");
          renderWeatherInfo(data);
    }
    catch(err){

    }
}