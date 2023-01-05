const wrapper = document.querySelector(".wrapper"),
    inputPart = document.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-txt"),
    inputField = inputPart.querySelector("input"),
    locationBtn = inputPart.querySelector("button"),
    weatherPart = wrapper.querySelector(".weather-part"),
    wIcon = weatherPart.querySelector("img"),
    arrowBack = wrapper.querySelector("header i");

    let api

inputField.addEventListener("keyup", e =>{
    if(e.key === "Enter" && inputField.value !== ""){
        requestApi(inputField.value);
        console.log(inputField.value)
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Votre navigateur ne supporte pas la foncion de géolocatisation")
    }
});

function requestApi(city){
    api = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&lang=fr&appid=744d80de2dd2a962101ef84a4174031f"
    fetchData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api ="https://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&lang=fr&units=metric&appid=744d80de2dd2a962101ef84a4174031f"
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData(){
    infoTxt.innerText ="Chargement des details de la météo"
    infoTxt.classList.add("pending")
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{ //promesse///asincrhone
        infoTxt.innerText = "Quelque chose c'est mal passe";
        infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info){
    if (info.cod ==="404"){
        infoTxt.innerText = inputField.value + " n'est pas une ville"
        infoTxt.classList.replace("pending","error")
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;

        if(id === 800){
            wIcon.src = "Weather_Icons/clear.svg"
        }else if(id >= 200 && id <= 232){
            wIcon.src = "Weather_Icons/storm.svg";
        }else if(id >= 600 && id <= 622){
            wIcon.src = "Weather_Icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "Weather_Icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "Weather_Icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "Weather_Icons/rain.svg";
        }
        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp)
        wrapper.querySelector(".weather").innerText = description
        wrapper.querySelector(".location span").innerText = city+", "+country
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like)
        wrapper.querySelector(".humidity span").innerText = humidity+'%'
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});