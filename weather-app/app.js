window.addEventListener("load", () => {
    let lon;
    let lat;
    let temperatureDescription = this.document.querySelector(".temperature-description");
    let temperatureDegree = this.document.querySelector(".temperature-degree");
    let locationTimezone = this.document.querySelector(".location-timezone");
    let wetherIcon = this.document.querySelector(".weather-icon");

    if(this.navigator.geolocation){
        this.navigator.geolocation.getCurrentPosition(position => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;

            const API_KEY = "360a9abe01d23bae800998614820c40b"
            const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ja`;

            

            this.fetch(URL).then(response => {
                return response.json();
            }).then(data => {
                console.log(data);

                temperature = data.main.temp;
                summary = data.weather[0].description;
                timezone = data.sys.timezone;
                icon = data.weather[0].icon;
                //Set DOM Elements from the API
                temperatureDegree.textContent = temperature;
                temperatureDescription.textContent = summary;
                locationTimezone.textContent = data.timezone;

                //setIcon
                setIcons(icon, wetherIcon);
            });
        });
    }

    function setIcons(icon, iconID){
        const skycons = new skycons({color:"white"});
        const currentIcon = icon.replace(/-/g, "_").tuUpperCase();
        skycons.play();
        return skycons.set(iconID, skycons[currentIcon]);
    }
});