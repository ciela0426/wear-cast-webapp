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

    // 국가명,지역명 HTML에 출력
    const locationElement = document.getElementById('location');
    locationElement.innerHTML = `${regionName}, ${country}`;

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
        /*
        1번째 기능 : 현재 시간의 날씨 데이터 출력
        한계 : 받아온 api정보는 3시간 단위이기 때문에 정확한 날씨가 아닌 가장 최근 기록된 날씨이다.
        활용 : api정보의 3번째 데이터(list[2])를 활용
        */
        const weatherDescription = weatherData.list[2].weather[0].description;  // 상태(ex:맑음)
        const temperature = weatherData.list[2].main.temp.toFixed(1);  //온도
        const humidity = weatherData.list[2].main.humidity; //습도
        const windSpeed = weatherData.list[2].wind.speed;   //풍속
        const maxTemperature = weatherData.list[2].main.temp_max;    //3시간 동안 최고온도
        const minTemperature = weatherData.list[2].main.temp_min;   //3시간 동안 최저온도
        const date = weatherData.list[2].dt_txt;    //측정시각(ex:2024-03-19 09:00:00)
        const sunriseTime = new Date(weatherData.city.sunrise * 1000).toLocaleTimeString(); //일출시간
        const sunsetTime = new Date(weatherData.city.sunset * 1000).toLocaleTimeString();   //일몰시간
        const currentDate = new Date(); //현재 날짜 얻어옴
        const weatherIconCode = weatherData.list[2].weather[0].icon;

        //현재 시각을 원하는 포맷으로 출력하기 위한 처리
        const month = currentDate.toLocaleString('default', { month: 'long' });
        const day = currentDate.getDate();
        const year = currentDate.getFullYear();
        let hour = currentDate.getHours();
        const minute = currentDate.getMinutes();

        const formattedDate = `${month} ${day}일, ${year} ${hour}:${minute < 10 ? '0' : ''}${minute}`;

        //현재 시각, 현재 날씨상태, 현재 온도 HTML로 출력
        const timeElement = document.getElementById('current-time');
        const todayWeatherDescElement = document.getElementById('todayWeatherDesc');
        const todayWeatherTempElement = document.getElementById('todayWeatherTemp');
        const todayHumidElement = document.getElementById('todayHumid');
        const currentWindElement = document.getElementById('windspeed');
        const weatherIconElement = document.getElementById('todayIcon')
        const iconUrl = `./public/images/${weatherIconCode}.png`; // 이미지 파일의 경로

        timeElement.innerHTML = formattedDate;
        todayWeatherDescElement.innerHTML = `${weatherDescription}`;
        todayWeatherTempElement.innerHTML = `${temperature}` + "<span>°</span>";
        todayHumidElement.innerHTML = `${humidity}`+"<span>%</span>";
        currentWindElement.innerHTML = `${windSpeed}`;
        weatherIconElement.src = iconUrl;

        /*
        2번째 기능: 24시간 날씨 출력
        API 정보의 0~7번 인덱스의 정보 출력: 최근 6시간 전/최근 3시간 전/최근 기록/3시간 후/.../15시간 후
        HTML에서의 반복이 아닌 js에서의 반복으로 처리
        현재 최고,최저 온도 기능은 구현만 하고 사용하진 않음(무시)
        */
        // 24시간 정보 HTML에 출력
        // const forecastElement = document.getElementById('forecast'); // HTML의 id:forecast와 연결
        // let max = weatherData.list[0].main.temp_max; // 최고 온도 초기화
        // let min = weatherData.list[0].main.temp_min; // 최저 온도 초기화

        // 날씨 정보 배열 초기화
        const weatherDataArray = [];

        // 받아온 날씨 데이터를 배열에 입력
        for (let i = 0; i <= 7; i++) {
          const time = weatherData.list[i].dt_txt;
          const temperature = weatherData.list[i].main.temp.toFixed(1);
          const weatherIconCode = weatherData.list[i].weather[0].icon;
          // 날씨 정보 객체 생성 및 배열에 추가
          const weatherInfo = {
            day: time.substr(5, 2) + "." + time.substr(8, 2),
            hour: time.substr(11, 5),
            temperature: temperature,
            weatherIconCode: weatherIconCode,

          };
          weatherDataArray.push(weatherInfo);
        }
        // 날씨 정보를 표시할 요소를 가져옴
        const weatherListElement = document.querySelector('.weather-list');

        // 날씨 정보 배열을 반복하여 요소 생성
        weatherDataArray.forEach(data => {
          // 날씨 요소 생성
          const weatherElement = document.createElement('div');
          weatherElement.classList.add('weather-element');
          
          // 요소 내용 설정
          weatherElement.innerHTML = `
    <div class="element-date">
      <p class="text-element-day">${data.day}</p>
      <p class="text-element-time">${data.hour}</p>
    </div>
    <img class="img-element-weather" src="./public/images/${data.weatherIconCode}.png" alt="Weather Icon">
    <p class="element-temp">${data.temperature}<span>°</span></p>
  `;

          // 생성한 요소를 weatherListElement에 추가
          weatherListElement.appendChild(weatherElement);
        });


        // const ulElement = document.querySelector('.weather-list ul');
        // for (let i = 0; i <= 7; i++) {
        //   const weatherDescription = weatherData.list[i].weather[0].description;
        //   const temperature = weatherData.list[i].main.temp.toFixed(1);
        //   const time = weatherData.list[i].dt_txt;
        //   // const maxT = weatherData.list[i].main.temp_max;
        //   // const minT = weatherData.list[i].main.temp_min;

        //   // 24시간 내의 최고, 최저 온도 갱신
        //   // if (weatherData.list[i].main.temp_max > max) {
        //   //   max = weatherData.list[i].main.temp_max;
        //   // }
        //   // if (weatherData.list[i].main.temp_min < min) {
        //   //   min = weatherData.list[i].main.temp_min;
        //   // }

        //   // forecastElement.innerHTML += `날씨: ${weatherDescription}, 온도: ${temperature}, 시간: ${time}, 최고 온도: ${maxT}, 최저 온도: ${minT}<br>`;

        //   // li 요소 생성
        //   const liElement = document.createElement('li');

        //   // li 요소 내부에 날씨 정보 추가
        //   liElement.innerHTML = `
        //      <div class="weather-element last">
        //          <div class="element-date">
        //              <p class="text-element-day">${time.substr(5, 2)}.${time.substr(8, 2)}</p>
        //         <p class="text-element-time">${time.substr(11, 5)}</p>
        //          </div>
        //          <div class="img-element-weather">
        //              <img src="./public/images/small_sun.png" alt="">
        //          </div>
        //          <p class="element-temp">${temperature}°</p>
        //      </div>
        //  `;

        //   // ul에 li 요소 추가
        //   ulElement.appendChild(liElement);
        // }

        // forecastElement.innerHTML += `최고 온도: ${max}, 최저 온도: ${min}<br>`;



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

        // 함수 호출
        displayWeatherInfo();



        // 4번째 기능 : 24시간 내에 비가 오는 지 확인
        // 한번이라도 비가 왔다면 변수에 저장
        // 추후에 우산 챙기는 기능에 사용가능
   
        let isRaining = false;
        for (let i = 0; i < 8; i++) {
          if (weatherData.list[i].weather[0].main === 'Rain') {
            isRaining = true;
            break;
          }
        }
        // 비 내용 HTML에 출력
        const rainElement = document.getElementById('rain');    //HTML의 id:rain과 연결
        rainElement.innerHTML = `${isRaining ? 'YES' : 'NO'}`

        /*
        5번째 기능: 현재 온도 기반 옷차림 추천
        맨 아래에 suggestedOutfit 함수 구현 후 호출
        */
        // const outfitElement = document.getElementById('outfit');    //HTML의 id:outfit와 연결
        const suggestedOutfit = suggestOutfit(temperature); //함수 호출
        // outfitElement.innerHTML = `추천 옷차림: ${suggestedOutfit}`;    //HTML에 출력

        /*
        6번째 기능: 내일의 정보 출력
        구현 : 내일의 정보를 얻어오기 위해 현재 날짜를 가져오고 +1 정보 추출(필터링)
        추가적으로 내일 모래도 가능함
        */

        // 내일 계산
        const tomorrow = new Date(currentDate);
        tomorrow.setDate(currentDate.getDate() + 1);

        // 내일 데이터 추출
        // filter메서드를 사용해 내일에 해당하는 정보만 필터링
        const tomorrowWeatherData = weatherData.list.filter(item => {
          const date = new Date(item.dt_txt);
          return date.getDate() === tomorrow.getDate();
        });

        // 내일 데이터 출력
        for (const item of tomorrowWeatherData) {
          const weatherDescription = item.weather[0].description; //추출된 정보의 날씨 상태(ex:맑음)
          const temperature = item.main.temp;
          const time = item.dt_txt;
          // const forecast2Element = document.getElementById('forecast2');  //HTML의 id:forecast2와 연결
          // forecast2Element.innerHTML += `날씨: ${weatherDescription}, 온도: ${temperature} 시간: ${time}<br>`;    //HTML에 출력
        }

        /*
        7번째 기능: 온도별 권장 습도에 따라 습도 상태 출력
        구현 : 온도별 권장 습도 +-5% 내에 있을 시 'GOOD' 출력, 권장습도 범위를 벗어날 시 'BAD' 출력
        */
        function checkCondition(temperature, humidity) {

          // 온도와 습도의 범위 정의
          const conditions = [
            { tempRange: [19, 23], humidityRange: [47.5, 52.5] },  // 온도가 19~23이고 습도가 47.5~52.5인 경우
            { tempRange: [24, 27], humidityRange: [57.5, 62.5] },  // 온도가 24~27이고 습도가 57.5~62.5인 경우
            { tempRange: [18, 21], humidityRange: [37.5, 42.5] }   // 온도가 18~21이고 습도가 37.5~42.5인 경우

            // 추가적인 조건을 필요에 따라 여기에 추가할 수 있습니다.
          ];

          // 조건에 맞는지 확인
          for (const condition of conditions) {
            const tempRange = condition.tempRange;
            const humidityRange = condition.humidityRange;
            if (temperature >= tempRange[0] && temperature <= tempRange[1] &&
              humidity >= humidityRange[0] && humidity <= humidityRange[1]) {
              return "GOOD";
            }
          }

          // 모든 조건에 해당하지 않으면 "BAD" 반환
          return "BAD";
        }

        
        // 온도와 습도에 따라서 조건 확인 후 결과 표시
        const conditionElement = document.getElementById('HumidityStatus');
        const conditionResult = checkCondition(temperature, humidity);
        conditionElement.innerHTML = `${conditionResult}`; // HTML 요소에 결과 표시


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



/*
9번째 기능: 온도별 옷차림 추천
구현: 온도 데이터를 받아와서 각 온도별 옷차림을 추천해줌
*/
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