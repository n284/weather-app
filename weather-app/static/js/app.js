//要素取得
let elementLocationName = this.document.querySelector("#location_name");
let elementWeatherIcon = this.document.querySelector("#weather_icon");
let elementWeatherDescription = this.document.querySelector("#weather_description");
let elementTemperatureDegree = this.document.querySelector("#temperature_degree");
let elementMinTemperature = this.document.querySelector("#min_temperature");
let elementMaxTemperature = this.document.querySelector("#max_temperature");
let elementDataHumidity = this.document.querySelector("#data_humidity");
let elementDataPressure = this.document.querySelector("#data_pressure");
let elementDataRainfallSnowfall = this.document.querySelector("#data_rainfall_snowfall");
let elementDataWind = this.document.querySelector("#data_wind");
let elementDataCloudy = this.document.querySelector("#data_cloudy");
let elementDataSunriseSunset = this.document.querySelector("#data_sunrise_sunset");
let elementLabelRainfallSnowfall = this.document.querySelector("#label_rainfall_snowfall");



window.addEventListener("load", () => {
    let lon;//経度
    let lat;//緯度

    if (this.navigator.geolocation) {
        this.navigator.geolocation.getCurrentPosition(
            (position) => {//位置情報が取得できた場合
                lon = position.coords.longitude;
                lat = position.coords.latitude;
                // デバッグ用
                // lon = 140.7498904;
                // lat = 39.1411791;

                const API_KEY = "360a9abe01d23bae800998614820c40b"
                const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ja`;

                this.fetch(URL).then((response) => {
                    return response.json();
                }).then((data) => {
                    // console.log(data);
                    //データ取り出し
                    let weatherId = data.weather[0].id;
                    let weatherIcon = data.weather[0].icon;
                    let weatherDescription = data.weather[0].description;
                    let temperature = data.main.temp;
                    let pressure = data.main.pressure;
                    let humidity = data.main.humidity;
                    let minTemperature = data.main.temp_min;
                    let maxTemperature = data.main.temp_max;
                    let speed = data.wind.speed;
                    let windDegree = data.wind.deg;
                    let cloudsAll = data.clouds.all;
                    let rainOrSnow = "rain" in data ? data.rain["1h"] : "snow" in data ? data.snow["1h"] : 0;
                    let labelRainOrSnow = "rain" in data ? "降水量" : "snow" in data ? "降雪量" : "降水量";
                    let sunrise = data.sys.sunrise;
                    let sunset = data.sys.sunset;
                    let timezone = data.timezone;

                    //書き換え
                    elementTemperatureDegree.textContent = temperature;
                    elementMinTemperature.textContent = "最低気温 : " + minTemperature + " ℃";
                    elementMaxTemperature.textContent = "最高気温 : " + maxTemperature + " ℃";
                    elementWeatherDescription.textContent = weatherDescription;
                    elementDataHumidity.textContent = humidity + " %";
                    elementDataPressure.textContent = pressure + " hPa";
                    elementLabelRainfallSnowfall.textContent = labelRainOrSnow;
                    elementDataRainfallSnowfall.textContent = rainOrSnow + " mm";
                    elementDataWind.textContent = convertWindToString(speed, windDegree);
                    elementDataCloudy.textContent = cloudsAll + " %";
                    elementDataSunriseSunset.textContent = cnvertSunriseSunsetToString(sunrise, sunset, timezone)
                    setName(lon, lat, elementLocationName);
                    setIcons(weatherIcon, elementWeatherIcon, weatherId);
                    
                }).catch((fail) => {
                    this.alert("サーバーに接続できませんでした。");
                })
            },
            (fail) => {//位置情報が取得できない場合
            }
        );
    }
});

elementTemperatureDegree.addEventListener("click", () =>{
    let temperature = parseFloat(elementTemperatureDegree.textContent);
    let elementTemperatureUnit = document.querySelector("#temperature_unit");
    let unit = elementTemperatureUnit.textContent;
    if(unit === "℃"){//セ氏　→　カ氏
        
        elementTemperatureDegree.textContent = convertCToF(temperature);
        elementMaxTemperature.textContent = "℉";
        elementTemperatureDegree.textContent = convertCToF(temperature);
        elementTemperatureUnit.textContent = "℉";
        elementTemperatureDegree.textContent = convertCToF(temperature);
        elementTemperatureUnit.textContent = "℉";
    }else{//カ氏　→セ氏
        elementTemperatureDegree.textContent = convertFToC(temperature);
        elementTemperatureUnit.textContent = "℃";
    }
})


    //参考
    //OpenWeatherMapのアイコンの種類:https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
    //Skyconsのアイコンの種類:https://maxdow.github.io/skycons/
    //気象庁による曇りの定義など:https://www.jma.go.jp/jma/kishou/know/yougo_hp/tenki.html

    //getCurrentPosition:https://developer.mozilla.org/ja/docs/Web/API/Geolocation/getCurrentPosition
    //fetch:https://breezegroup.co.jp/202004/javascript-fetch/
    //Promiseオブジェクトによる動作フロー:https://jpdebug.com/p/3308764
    //時計回りの角度で16方位を取得する:https://qiita.com/m-suizu@github/items/a3d69c211f8f3a5cb624

    function setIcons(icon, element, weatherID) {
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
                    currentIcon = "PARTLY_CLOUDY_DAY";
                    break;

                case "03n"://晴れ
                    currentIcon = "PARTLY_CLOUDY_DAY";
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
        skycons.set(element, Skycons[currentIcon]);
    }

    function convertUnixTimeToHourMinute(unixTime, timezone){
        let timestamp = (unixTime*1000 + timezone);
        let date = new Date(timestamp);
        let formatString = date.getHours() + ":" + date.getMinutes();

        return formatString;
    }

    function cnvertSunriseSunsetToString(sunrise, sunset, timezone){
        let stringSunrise = convertUnixTimeToHourMinute(sunrise, timezone);
        let stringSunset = convertUnixTimeToHourMinute(sunset, timezone);
        let formatString = stringSunrise + "-" + stringSunset;

        return formatString;
    }

    function convertWindToString(speed, degree){
        const DIRECTION_LIST = ["北","北北東","北東", "東北東", "東", "東南東", "南東", "南南東", "南", "南南西", "南西", "西南西", "西", "西北西", "北西", "北北西", "北"];
        let index = Math.round(degree / 22.5);//360を16で割った値が22.5
        let formatString = DIRECTION_LIST[index] +" "+ speed + " " + "m/s";
        
        return formatString;
    }

    function setName(lon, lat, nameId){
        const URL = `https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=${lat}&lon=${lon}`;

        this.fetch(URL).then((response) =>{
            return response.json();
        }).then((data) => {
            console.log(data);
            let muniCd = parseInt(data.results.muniCd);
            console.log(GSI.MUNI_ARRAY[muniCd]);
            let detailArray = GSI.MUNI_ARRAY[muniCd].split(",");
            let prefecture = detailArray[1];
            let municipalities = detailArray[3];
            let formatString = `${prefecture} ${municipalities}`;
            nameId.textContent = formatString;
        })
    }

    function convertCToF(data){
        return Math.round((data*1.8+32)*100)/100;
    }

    function convertFToC(data){
        return Math.round(((data-32)/1.8)*100)/100;
    }