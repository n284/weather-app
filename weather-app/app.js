window.addEventListener("load", () => {
    let lon;
    let lat;
    let temperatureDescription = this.document.querySelector(".temperature-description");
    let temperatureDegree = this.document.querySelector(".temperature-degree");
    let locationTimezone = this.document.querySelector(".location-timezone");
    let wetherIcon = this.document.querySelector(".weather-icon");

    if (this.navigator.geolocation) {
        this.navigator.geolocation.getCurrentPosition(position => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;
            lon = 139.688;
            lat = 35.6213;

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
                weatherID = data.weather.id;

                //Set DOM Elements from the API
                temperatureDegree.textContent = temperature;
                temperatureDescription.textContent = summary;
                locationTimezone.textContent = data.timezone;

                //setIcon
                setIcons(icon, wetherIcon, weatherID);
            });
        });
    }

    //参考
    //OpenWeatherMapのアイコンの種類:https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
    //Skyconsのアイコンの種類:https://maxdow.github.io/skycons/
    //気象庁による曇りの定義など:https://www.jma.go.jp/jma/kishou/know/yougo_hp/tenki.html

    function setIcons(icon, iconID, weatherID) {
        let currentIcon;

        if (icon.substr(-1) === "d") {//午前
            switch (icon) {
                case "01d"://晴れ
                    currentIcon = "CLEAR_DAY";
                    break;

                case "02d"://晴れ
                    currentIcon = "PARTLY_CLOUDY_DAY";
                    break;
                
                case "03d"://晴れ
                    currentIcon = "PARTLY_CLOUDY_DAY";
                    break;

                case "04d"://曇り
                    if (weatherID === 804) {
                        currentIcon = "CLOUDY";
                    } else {
                        currentIcon = "PARTLY_CLOUDY_DAY";
                    }
                    break;

                case "09d"://雨
                    if ([520, 521, 522, 531].includes(weatherID)) {
                        currentIcon = "SHOWERS_DAY";
                    } else {
                        currentIcon = "SLEET";
                    }
                    break;

                case "10d"://雨
                    currentIcon = "RAIN";
                    break;

                case "13d"://雪
                    if ([620, 621, 622].includes(weatherID)) {
                        currentIcon = "SNOW_SHOWERS_DAY"
                    } else if ([615, 616].includes(weatherID)) {
                        currentIcon = "RAIN_SNOW_SHOWERS_DAY";
                    } else if ([611, 612, 613].includes(weatherID)) {
                        currentIcon = "RAIN_SNOW";
                    } else {
                        currentIcon = "SNOW";
                    }
                    break;

                case "11d"://雷
                    if ([200, 230].includes(weatherID)) {
                        currentIcon = "THUNDER_SHOWERS_DAY";
                    } else if ([210, 211, 212, 221].includes(weatherID)) {
                        currentIcon = "THUNDER";
                    } else {
                        currentIcon = "THUNDER_RAIN";
                    }
                    break;

                case "50d"://その他（霧、竜巻など）
                    currentIcon = "FOG";
                    break;
            }
        } else {//午後
            switch (icon) {
                case "01n"://晴れ
                    currentIcon = "CLEAR_NIGHT";
                    break;

                case "02n"://晴れ
                    currentIcon = "PARTLY_CLOUDY_NIGHT";
                    break;
                case "03n"://晴れ
                    currentIcon = "PARTLY_CLOUDY_NIGHT";
                    break;

                case "04n"://曇り
                    if (weatherID === 804) {
                        currentIcon = "CLOUDY";
                    } else {
                        currentIcon = "PARTLY_CLOUDY_NIGHT";
                    }
                    break;

                case "09n"://雨
                    if ([520, 521, 522, 531].includes(weatherID)) {
                        currentIcon = "SHOWERS_NIGHT";
                    } else {
                        currentIcon = "SLEET";
                    }
                    break;

                case "10n"://雨
                    currentIcon = "RAIN";
                    break;

                case "13n"://雪
                    if ([620, 621, 622].includes(weatherID)) {
                        currentIcon = "SNOW_SHOWERS_NIGHT"
                    } else if ([615, 616].includes(weatherID)) {
                        currentIcon = "RAIN_SNOW_SHOWERS_NIGHT";
                    } else if ([611, 612, 613].includes(weatherID)) {
                        currentIcon = "RAIN_SNOW";
                    } else {
                        currentIcon = "SNOW";
                    }
                    break;

                case "11n"://雷
                    if ([200, 230].includes(weatherID)) {
                        currentIcon = "THUNDER_SHOWERS_NIGHT";
                    } else if ([210, 211, 212, 221].includes(weatherID)) {
                        currentIcon = "THUNDER";
                    } else {
                        currentIcon = "THUNDER_RAIN";
                    }
                    break;

                case "50n"://その他（霧、竜巻など）
                    currentIcon = "FOG";
                    break;
            }
        }

        const skycons = new Skycons({ color: "white" });
        skycons.play();
        skycons.set(iconID, Skycons[currentIcon]);
    }
});