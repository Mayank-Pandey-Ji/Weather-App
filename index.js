// console.log("heelo jee");

// const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

// async function showWeather()
// {

//     try{
//     let city = "goa";
//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

//     const data = await response.json();
//     let newPara = document.createElement('p');
//     // newPara.textContent = `${data?.main?.temp.toFixed(2)} °C `;
//     // document.body.appendChild(newPara);

//     // console.log(data);
//     }

//     catch(err){

//     }
// }

// // https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}



// async function get_custom_weather()
// {
//     try{
//         let latitude = 20.55555;
//         let longitude = 30.3333;

//         const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
//         let custom_data = await res.json();
//         console.log(custom_data);

//         let element = document.createElement('p');
//         element.textContent = `${custom_data.main.temp}`;
//         document.body.appendChild(element);
//     }

//     catch(err)
//     {
//         console.log("error found" , err);
//     }
// }

// // get_custom_weather();


// function getLocation()
// {
//     if(navigator.geolocation)
//     {
//         navigator.geolocation.getCurrentPosition(show_position);
//     }

//     else{
//         console.log("No geoloaction support");
//     }
// }

// function show_position(position){
//     let lat = position.coords.latitude;
//     let long = position.coords.longitude;

//     console.log(lat);
//     console.log(long);
// }

// getLocation();

































const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grant_access_container = document.querySelector(".grant-location-container");
const search_form = document.querySelector('.form-container');
const loading_screen_container = document.querySelector(".loading-container");
const user_info_container = document.querySelector('.user-info-container');
const error_container = document.querySelector('.error-container');

let old_tab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
old_tab.classList.add("current-tab");
get_from_session_storage();

function switchTab(new_tab)
{
    if(old_tab != new_tab)
    {
        old_tab.classList.remove("current-tab");
        old_tab = new_tab;
        old_tab.classList.add("current-tab");

        if(!search_form.classList.contains('active'))
        {
            user_info_container.classList.remove("active");
            grant_access_container.classList.remove("active");
            search_form.classList.add("active");
        }
        else {
            // main pehele search wale tab par tha ab your weather tab visisble  karna hai
            search_form.classList.remove("active");
            user_info_container.classList.remove("active"); 
            // ab mai your weather tab me aaya hu , toh weather bhi display karna padega , so let's check the local storage first 
            // for coordinates we have to save them there 
            get_from_session_storage();
        }

    }
}

userTab.addEventListener("click" , ()=> {
    // pass clickedTab as the input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click" ,()=> {
    switchTab(searchTab);
});

// check if coordinates are already present in the session storage 
function get_from_session_storage()
{
    const local_coordinates = sessionStorage.getItem("user-coordinates");
    if(!local_coordinates)
    {
        // agar coordinates nahi mile , toh loading waal page chala do
        grant_access_container.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(local_coordinates);
        fetch_user_weather_info(coordinates);
    }
}

async function fetch_user_weather_info(coordinates)
{
    const {lat , lon} = coordinates;
    // make grant container invisible 
    grant_access_container.classList.remove("active");
    // make loader visible 
    loading_screen_container.classList.add("active");

    // api call
    try{
       const res =  await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
       const data = await res.json();
       loading_screen_container.classList.remove("active");
       if(error_container.classList.contains("active"))
        {
            error_container.classList.remove("active");
        }
       user_info_container.classList.add("active");
       render_weather_info(data); // iska kaam hai me se temp aur baaki saari information user-weather-container me daale
    }

    catch(err)
    {
        loading_screen_container.classList.remove("active");
        Err = new Error("please turn on the loaction");

    }
}

function render_weather_info(weather_info)
{
    // firstly we have to fetch the elements

    
     const city_name =document.querySelector("[data-cityName]");
    const country_icon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weather_icon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const wind_speed = document.querySelector("[data-windsped]");
    const humidity = document.querySelector("[data-hummidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    // fetch the values from weather_info object and put it in UI elements

    city_name.innerText = weather_info?.name;
    country_icon.src = `https://flagcdn.com/144x108/${weather_info?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weather_info?.weather?.[0]?.description;
    weather_icon.src = `https://openweathermap.org/img/w/${weather_info?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weather_info?.main?.temp} °C`;
    wind_speed.innerText = `${weather_info?.wind?.speed} m/s`;
    humidity.innerText = `${weather_info?.main?.humidity}%`;
    cloudiness.innerText = `${weather_info?.clouds?.all}%`;
    


}

function get_location()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        Error("Geolocation is not supported in this device");
    }
}

function showPosition(position)
{
    const userCoordinates = {
        lat: position.coords.latitude ,
        lon: position.coords.longitude 
    }
    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
    fetch_user_weather_info(userCoordinates);
}

const grant_access_button  = document.querySelector("[data-grantAccess]");
grant_access_button.addEventListener("click" ,get_location() );

const searchInput = document.querySelector("[data-searchInput]");

search_form.addEventListener("submit" , (e) => {
    e.preventDefault();
    let city_name = searchInput.value;

    if(city_name === "")
    {
        return;
    }
    else {
        fetch_search_weather_info(city_name);
    }
})

async function fetch_search_weather_info(city)
{
    loading_screen_container.classList.add("active");
    user_info_container.classList.remove("active");
    grant_access_container.classList.remove("active");

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    if(data.message === "city not found")
    {
        console.log("nahi mila");
        loading_screen_container.classList.remove("active");
        error_container.classList.add("active");
    }
    
    else {
        loading_screen_container.classList.remove("active");
        if(error_container.classList.contains("active"))
        {
            error_container.classList.remove("active");
        }
    user_info_container.classList.add("active");
    render_weather_info(data);
    }
}

