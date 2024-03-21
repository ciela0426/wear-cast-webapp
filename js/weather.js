/*
1번째 API : 위치 데이터 받아오기
목적 : 접속한 기기의 위치데이터(위도,경도)를 얻어서 그 지역의 날씨를 알기 위함
프로그램을 실행한 기기의 ip주소를 입력하면(key) api정보로 받아온 것을 활용
*/
fetch('http://ip-api.com/json/')    // default는 접속한 기기의 ip
  .then(response => response.json())
  .then(data => {
    const lat = data.lat;   //위도
    const lon = data.lon;   //경도
    const country = data.country;   //접속 국가
    const regionName = data.regionName; //접속한 시(ex:서울)
    const city = data.city; //접속 도시(ex:강남)

    // 국가명,지역명,도시명 HTML에 출력
    const locationElement = document.getElementById('location');
    locationElement.innerHTML = `나라: ${country}<br>지역명: ${regionName}<br>도시: ${city}<br>
    위도: ${lat}<br>경도: ${lon}`;

    /*
    2번째 API : 날씨 데이터 받아오기
    위에서 구한 위도,경도를 사용해 해당 지역의 날씨 정보를 얻어온다.
    사용한 api는 현재시각 기준 6시간전부터 데이터를 제공한다.
    */
    const apiKey = 'a2bef9ef4e8c7cb401ffa5e9cf298192'; // 김융의 key
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;

    fetch(weatherApiUrl)
      .then(response => response.json())
      .then(weatherData => {
        // 날씨 정보 처리
        console.log(weatherData); // 날씨 정보 콘솔에 출력 또는 원하는 대로 처리

        const weatherElement = document.getElementById('weather');  //HTML의 id:weather와 연결
        /*
        1번째 기능 : 현재 시간의 날씨 데이터 출력
        한계 : 받아온 api정보는 3시간 단위이기 때문에 정확한 날씨가 아닌 가장 최근 기록된 날씨이다.
        활용 : api정보의 3번째 데이터(list[2])를 활용
        */
        const weatherDescription = weatherData.list[2].weather[0].description;  // 상태(ex:맑음)
        const temperature = weatherData.list[2].main.temp;  //온도
        const humidity = weatherData.list[2].main.humidity; //습도
        const windSpeed = weatherData.list[2].wind.speed;   //풍속
        /*
        제공되는 최고,최저 온도가 우리가 원하는 값이 아닌 것 같아 보임
        3시간내의 최고,최저가 아닌 그 지역에서(넓은지역) 온도인 거 같아서 확인 필요
        */
        const sunriseTime = new Date(weatherData.city.sunrise * 1000).toLocaleTimeString(); //일출시간
        const sunsetTime = new Date(weatherData.city.sunset * 1000).toLocaleTimeString();   //일몰시간
        const currentTime = new Date().toLocaleTimeString();    //현재시각
        const date = weatherData.list[2].dt_txt;    //측정시각(ex:2024-03-19 09:00:00)
        const timeElement = document.getElementById('current-time');    //현재 시각 HTML에 출력
        timeElement.innerHTML = `현재 시간: ${currentTime}`;

        weatherElement.innerHTML = `나라: ${country}, 도시: ${regionName}<br>
              날씨: ${weatherDescription}, 온도: ${temperature}도<br>
              습도: ${humidity}%, 풍속: ${windSpeed}m/s<br>
              일출 시간: ${sunriseTime}, 일몰 시간: ${sunsetTime}<br>
              측정 시각: ${date}`;



<<<<<<< Updated upstream
        for (let i = 0; i <= 7; i++) {
          const weatherDescription = weatherData.list[i].weather[0].description;
          const temperature = weatherData.list[i].main.temp;
          const time = weatherData.list[i].dt_txt;
=======
        /*
       3번째 기능: 현재 강수량 정보 출력
       현재 날씨에서 비가 올 시 API내에서 강수량 정보를 얻을 수 있는데 비가 안 올 시 제공해주지 않음
       비가 올 시 강수량 정보를 얻어와서 출력하고 비가 안 올 시 '0'을 출력한다.
       */
        function displayWeatherInfo() {
          // 'Rain'인 경우 'weatherData.list[2].rain.1h'의 정보 출력, 그렇지 않은 경우 '0' 출력
          if (weatherData.list[2].weather[0].main === 'Rain') {
            document.getElementById('WeatherInfo').textContent = weatherData.list[2].rain['1h'] + "mm";
          } else {
            document.getElementById('WeatherInfo').textContent = "0mm";
          }
        }
>>>>>>> Stashed changes

          const forecastElement = document.getElementById('forecast');
          forecastElement.innerHTML += `날씨: ${weatherDescription}, 온도: ${temperature} 시간: ${time}<br>`;

        }

        let minTemperature = Infinity;
        let maxTemperature = -Infinity;

        for (let i = 0; i <= 7; i++) {
          const currentMinTemperature = weatherData.list[i].main.temp_min;
          const currentMaxTemperature = weatherData.list[i].main.temp_max;

          // 현재 최저 기온이 minTemperature보다 작으면 업데이트
          if (currentMinTemperature < minTemperature) {
            minTemperature = currentMinTemperature;
          }

          // 현재 최고 기온이 maxTemperature보다 크면 업데이트
          if (currentMaxTemperature > maxTemperature) {
            maxTemperature = currentMaxTemperature;
          }
        }

        const forecastElement = document.getElementById('lowesthighest-temperature');
        forecastElement.innerHTML = `최고 기온: ${maxTemperature}, 최저 기온: ${minTemperature}<br>`;



        // 24시간 내에 비가 오는지 여부 판단
        let isRaining = false;
        for (let i = 0; i <= 7; i++) {
          if (weatherData.list[i].weather[0].main === 'Rain') {
            isRaining = true;
            break;
          }
        }

        // 비 내용 출력
        const rainElement = document.getElementById('rain');
        rainElement.innerHTML = `24시간 내에 비가 오는지: ${isRaining ? '비가 옴' : '비가 오지 않음'}`

        // 추천 옷차림 출력
        const outfitElement = document.getElementById('outfit');
        const suggestedOutfit = suggestOutfit(temperature);
        outfitElement.innerHTML = `추천 옷차림: ${suggestedOutfit}`;

        /*
        내일의 정보를 얻어오기 위해 현재 날짜를 가져오고 +1 정보 추출
        */
        // 현재 날짜 정보를 얻어옵니다.
        const currentDate = new Date();

        // 다음 날짜를 계산합니다.
        const tomorrow = new Date(currentDate);
        tomorrow.setDate(currentDate.getDate() + 1);

        // 다음 날짜의 데이터를 추출합니다.
        const tomorrowWeatherData = weatherData.list.filter(item => {
          const date = new Date(item.dt_txt);
          return date.getDate() === tomorrow.getDate();
        });

        // 추출된 데이터를 출력합니다.
        for (const item of tomorrowWeatherData) {
          const weatherDescription = item.weather[0].description;
          const temperature = item.main.temp;
          const time = item.dt_txt;
          const forecast2Element = document.getElementById('forecast2');
          forecast2Element.innerHTML += `날씨: ${weatherDescription}, 온도: ${temperature} 시간: ${time}<br>`;
        }


<<<<<<< Updated upstream
      })
      .catch(error => {
        console.error('Error fetching weather info:', error);
      });
  })
  .catch(error => {
    console.error('Error fetching IP info:', error);
  });
=======
      })

    /*
    8번째 기능: 대기질 현황을 받아와 대기질 상태를 출력
    구현 : 대기질을 받아올 수 있는 API에서 실시간 대기질 현황을 받아와 각 단계별 대기질 상태 대입 후 출력
    */

    // 대기질 상태 받아오는 API
    const AirPollutionApiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=a2bef9ef4e8c7cb401ffa5e9cf298192&units=metric&lang=kr`;

    fetch(AirPollutionApiUrl)
      .then(response => response.json())
      .then(AirPollutionData => {
        const airquality = AirPollutionData.list[0].main.aqi;
        let airqualityText = '';

        // 대기질 심각 수준에 따른 텍스트 정의
        switch (airquality) {
          case 1:
            airqualityText = '좋음';
            break;
          case 2:
            airqualityText = '보통';
            break;
          case 3:
            airqualityText = '보통';
            break;
          case 4:
            airqualityText = '나쁨';
            break;
          case 5:
            airqualityText = '매우 나쁨';
            break;
          default:
            airqualityText = '알 수 없음';
            break;
        }

        const AirPollutionElement = document.getElementById('Air-Pollution');
        AirPollutionElement.innerHTML = `${airqualityText}`;
      })

      .catch(error => {
        console.error('Error fetching weather info:', error);
      });
  })
  .catch(error => {
    console.error('Error fetching IP info:', error);
  });
>>>>>>> Stashed changes



// 현재 날씨의 온도를 기반으로 추천 옷차림을 반환하는 함수
function suggestOutfit(temperature) {
  let outfit = '';

  if (temperature >= 28) {
    outfit = '민소매, 반팔, 반바지, 원피스, 짧은 치마, 린넨';
  } else if (temperature >= 23) {
    outfit = '반팔, 얇은 셔츠, 반바지, 면바지';
  } else if (temperature >= 20) {
    outfit = '얇은 가디건, 긴팔, 면바지, 청바지';
  } else if (temperature >= 17) {
    outfit = '얇은 가디건&니트, 맨투맨, 후드, 가디건, 청바지';
  } else if (temperature >= 12) {
    outfit = '자켓, 가디건, 야상, 스타킹, 청바지, 면바지';
  } else if (temperature >= 9) {
    outfit = '자켓, 트렌치코트, 야상, 니트, 청바지, 기모바지';
  } else if (temperature >= 5) {
    outfit = '울 코트, 가죽자켓, 히트텍, 니트, 레깅스';
  } else {
    outfit = '패딩, 두꺼운 코트, 목도리, 기모제품';
  }

  return outfit;
}

