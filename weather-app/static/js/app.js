//要素取得
let elementLocationName = this.document.querySelector("#location_name");
let elementWeatherIcon = this.document.querySelector("#weather_icon");
let elementNowTemperatureDegree = this.document.querySelector("#now_temperature_degree");
let elementMaxTemperatureDegree = this.document.querySelector("#max_temperature_degree");
let elementMinTemperatureDegree = this.document.querySelector("#min_temperature_degree");
let elementNowTemperatureUnit = document.querySelector("#now_temperature_unit");
let elementMaxTemperatureUnit = document.querySelector("#max_temperature_unit");
let elementMinTemperatureUnit = document.querySelector("#min_temperature_unit");
let elementWeatherDescription = this.document.querySelector("#weather_description");
let elementDataHumidity = this.document.querySelector("#data_humidity");
let elementDataPressure = this.document.querySelector("#data_pressure");
let elementDataRainfallSnowfall = this.document.querySelector("#data_rainfall_snowfall");
let elementDataWind = this.document.querySelector("#data_wind");
let elementDataCloudy = this.document.querySelector("#data_cloudy");
let elementDataSunriseSunset = this.document.querySelector("#data_sunrise_sunset");
let elementLabelRainfallSnowfall = this.document.querySelector("#label_rainfall_snowfall");
let elementReloadIcon = this.document.querySelector("#reload_icon");

window.addEventListener("load", () => {
    viewWeather();
});

elementReloadIcon.addEventListener("click", () =>{
    viewWeather();
})

elementNowTemperatureDegree.addEventListener("click", () =>{
    let nowTemperatureDegree = parseFloat(elementNowTemperatureDegree.textContent);
    let maxTemperatureDegree = parseFloat(elementMaxTemperatureDegree.textContent);
    let minTemperatureDegree = parseFloat(elementMinTemperatureDegree.textContent);
    let unit = elementNowTemperatureUnit.textContent;
    if(unit === "℃"){//セ氏　→　カ氏
        elementNowTemperatureDegree.textContent = convertCToF(nowTemperatureDegree);
        elementNowTemperatureUnit.textContent = "℉";
        elementMaxTemperatureDegree.textContent = convertCToF(maxTemperatureDegree);
        elementMaxTemperatureUnit.textContent = "℉";
        elementMinTemperatureDegree.textContent = convertCToF(minTemperatureDegree);
        elementMinTemperatureUnit.textContent = "℉";
    }else{//カ氏　→セ氏
        elementNowTemperatureDegree.textContent = convertFToC(nowTemperatureDegree);
        elementNowTemperatureUnit.textContent = "℃";
        elementMaxTemperatureDegree.textContent = convertFToC(maxTemperatureDegree);
        elementMaxTemperatureUnit.textContent = "℃";
        elementMinTemperatureDegree.textContent = convertFToC(minTemperatureDegree);
        elementMinTemperatureUnit.textContent = "℃";
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
    //国土地理院のAPIとmuni.jsによる逆ジオコーディング:https://memo.appri.me/programming/gsi-geocoding-api

    function viewWeather(){
        if (this.navigator.geolocation) {
            this.navigator.geolocation.getCurrentPosition(
                (position) => {//位置情報が取得できた場合
                    let lon = position.coords.longitude;//経度
                    let lat = position.coords.latitude;//緯度
                    // デバッグ用
                    // lon = 140.7498904;
                    // lat = 39.1411791;
    
                    const API_KEY = "360a9abe01d23bae800998614820c40b"
                    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ja`;
    
                    this.fetch(URL).then((response) => {
                        return response.json();//レスポンスをJSONに変換し次の処理に渡す
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
                        elementNowTemperatureDegree.textContent = temperature;
                        elementMinTemperatureDegree.textContent = minTemperature;
                        elementMaxTemperatureDegree.textContent = maxTemperature;
                        elementWeatherDescription.textContent = weatherDescription;
                        elementDataHumidity.textContent = humidity;
                        elementDataPressure.textContent = pressure;
                        elementLabelRainfallSnowfall.textContent = labelRainOrSnow;
                        elementDataRainfallSnowfall.textContent = rainOrSnow;
                        elementDataWind.textContent = convertWindToString(speed, windDegree);
                        elementDataCloudy.textContent = cloudsAll;
                        elementDataSunriseSunset.textContent = cnvertSunriseSunsetToString(sunrise, sunset, timezone)
                        setName(lon, lat, elementLocationName);
                        setIcons(weatherIcon, elementWeatherIcon, weatherId);

                        //カ氏の単位をセ氏に変換
                        if(elementNowTemperatureUnit.textContent === "℉"){
                            elementNowTemperatureUnit.textContent = "℃";
                            elementMaxTemperatureUnit.textContent = "℃";
                            elementMinTemperatureUnit.textContent = "℃";
                        }
                        
                    }).catch((fail) => {
                        this.alert("OpenWeatherMapに接続できませんでした");
                    })
                },
                (fail) => {//位置情報が取得できない場合
                    this.alert("位置情報が取得できませんでした")
                }
            );
        }
    }

    //天気のアイコンを設定する
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

    //unixTimeから時刻を求め文字列に変換する
    function convertUnixTimeToHourMinute(unixTime, timezone){
        let timestamp = (unixTime*1000 + timezone);
        let date = new Date(timestamp);
        let formatString = date.getHours() + ":" + date.getMinutes();

        return formatString;
    }

    //日の出、日の入りの時刻を求め文字列に変換する
    function cnvertSunriseSunsetToString(sunrise, sunset, timezone){
        let stringSunrise = convertUnixTimeToHourMinute(sunrise, timezone);
        let stringSunset = convertUnixTimeToHourMinute(sunset, timezone);
        let formatString = stringSunrise + " - " + stringSunset;

        return formatString;
    }

    //角度から方位を求め文字列に変換する
    function convertWindToString(speed, degree){
        const DIRECTION_LIST = ["北","北北東","北東", "東北東", "東", "東南東", "南東", "南南東", "南", "南南西", "南西", "西南西", "西", "西北西", "北西", "北北西", "北"];
        let index = Math.round(degree / 22.5);//360を16で割った値が22.5
        let formatString = DIRECTION_LIST[index] +" "+ speed ;
        
        return formatString;
    }

    //緯度、経度から地名を求めて設定する
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

    //セ氏をカ氏に変換
    function convertCToF(data){
        return Math.round((data*1.8+32)*100)/100;
    }

    //カ氏をセ氏に変換
    function convertFToC(data){
        return Math.round(((data-32)/1.8)*100)/100;
    }