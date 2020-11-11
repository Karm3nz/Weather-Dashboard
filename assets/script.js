//This is the Javascript for Weather Dashboard

// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
$(document).ready(function () { 
    var appID= "c34ed4f93110fb4830dbbf24ac66f65d";
    var weather = "";
    var city = "";
    var current_date = moment().format("L");
    var search_history = JSON.parse(localStorage.getItem("cities")) === null ? [] : JSON.parse(localStorage.getItem("cities"));

        // console.log(search_history);
        // console.log(current_date);

    displaySearchHistory();
    // CURRENT WEATHER
    function currentWeather() {


        if ($(this).attr("id") === "submit-city") {
            city = $("#city").val();
        } 
        else {
            city = $(this).text();
        }

        weather = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + appID;
        
            //console.log(search_history.indexOf(city));
        if (search_history.indexOf(city) === -1) {

            search_history.push(city);
        }
            //console.log(search_history);
        localStorage.setItem("cities", JSON.stringify(search_history));

        $.getJSON(weather, function (json) {
            var temp = (json.main.temp - 273.15);
            var windspeed = json.wind.speed * 2.237;

            $("#current-city").text(json.name + " " + current_date);
            $("#weather-img").attr("src", "https://openweathermap.org/img/w/" + json.weather[0].icon + ".png");
            $("#temperature").text(temp.toFixed(2) + "°C");
            $("#humidity").text(json.main.humidity + "%");
            $("#windspeed").text(windspeed.toFixed(2) + " " + "mph");
        });
        //Tried getting the UV Index to work
        //==========================================================================
        // $.ajax({
        //     url: weather,
        //     method: "GET"
        // })
        // .then(function (response){
        //     var lat= response.coord.lat;
        //     var lon= response.coord.lon;
        //     uvIndex= "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + appID;
            
        //     $.ajax({
        //         url: uvIndex,
        //         method: "GET"
        //     })
        //     .then(function (response){
        //         $("#uvIndex")= response.value;
        //     })
        // })
    }
    // FIVE DAY FORECAST
    function fiveDayForecast() {
        var five_day_forecast = 
        "https://api.openweathermap.org/data/2.5/forecast?q=" + 
        city + 
        ",us&APPID=" + 
        appID;
       
        var day_counter = 1;

        $.ajax({
            url: five_day_forecast,
            method: "GET"
        })
        .then(function(response) {

            for (var i = 0; i < response.list.length; i++) {
                //Going through the list of response, inserting the data to the corresponding ids and class
                var date_and_time = response.list[i].dt_txt;
                var date = date_and_time.split(" ")[0];
                var time = date_and_time.split(" ")[1];

                if (time === "06:00:00") {
                    var year = date.split("-")[0];
                    var month = date.split("-")[1];
                    var day = date.split("-")[2];
                    $("#day-" + day_counter).children(".card-date").text(month + "/" + day + "/" + year);
                    $("#day-" + day_counter).children(".weather-icon").attr("src", "https://api.openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                    $("#day-" + day_counter).children(".weather-temp").text("Temp: " + ((response.list[i].main.temp - 273.15)).toFixed(2) + "°C");
                    $("#day-" + day_counter).children(".weather-humidity").text("Humidity: " + response.list[i].main.humidity + "%");
                    day_counter++;
                }
          
            }
            UVIndex(response.city.coord.lon,response.city.coord.lat);
        })    
    }
    // UV INDEX
    function UVIndex(ln,lt){
        //lets build the url for uvindex.
        var uvIndexURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ appID+"&lat="+lt+"&lon="+ln;
        $.ajax({
            url:uvIndexURL,
            method:"GET"
        })
        .then(function(response){
            $("#uvIndex").html(response.value);
        });
    }

    //SEARCH HISTORY
    function displaySearchHistory() {

        $("#search-history").empty();
        search_history.forEach(function (city) {

            //Checking for duplicates in search history
                //console.log(search_history);
            var history_item = $("<li>");

            history_item.addClass("list-group-item btn btn-light");
            history_item.text(city);

            $("#search-history").prepend(history_item);
        });
        $(".btn").click(currentWeather);
        $(".btn").click(fiveDayForecast);

    }
    //CLEAR HISTORY
    function clearHistory() {
        $("#search-history").empty();
        search_history = [];
        localStorage.setItem("cities", JSON.stringify(search_history));
    }
    // Event Listener for buttons
    $("#clear-history").click(clearHistory);
    $("#submit-city").click(displaySearchHistory);

});

//ASIDE
//====================================================================
// var lat= json.coord.lat;
// var lon= json.coord.lon;

        // $.getJSON(uvIndex, function (json) { 
        //     if (time === "12:00:00") {
        //         $("#uvIndex").text(json.value);    
        //     }
        // });


// var searchInput=$(".search-input");
// var searchBtn=$(".search-btn")
    
// // Current Weather Variables
// var tempEl = $(".temp");
// var humidityEl = $(".humidity");
// var windSpeedEl = $(".windSpeed");
// var uvIndexEl = $(".uvIndex");

// // 5-day Forecast Variables
// var cityNameEl = $(".cityName");
// var currentDateEl = $(".currentDate");
// var weatherIconEl = $(".weatherIcon");


 //if (time === "12:00:00") {}
//  latitude= response.list[i].city.coord.lat;
//  longitude= response.list[i].city.coord.lat;

//  console.log(response.list[i].city.coord.lat);
 
//  var uvIndex= "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=c34ed4f93110fb4830dbbf24ac66f65d&q=" +
//  "&lat=" +
//  latitude +
//  "&lon=" +
//  longitude;

//  $.ajax({
//      url: uvIndex,
//      method: 'GET'
//  })
//  .then( function (uvData) {
//      $("#uvIndex").text("UV Index:" + uvData.value);
//      console.log(uvData);
//  })