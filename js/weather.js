// 페이지가 로드될 때 자동으로 실행되는 부분
document.addEventListener("DOMContentLoaded", function() {
  runProgram(); // 프로그램 실행
});

// 새로고침 버튼을 클릭할 때 실행되는 부분
document.getElementById("refreshButton").addEventListener("click", function() {
  runProgram(); // 프로그램 다시 실행
});

// 프로그램 실행 함수
function runProgram() {
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
      1번째 기능 : 현재 시각의 날씨 데이터 출력
      출력 : 위치, 현재 시각, 현재 날씨 아이콘, 현재 날씨 상태(ex:맑음), 현재 온도, 현재 습도, 현재 풍속
            일출 시각,일몰 시각
      한계 : 받아온 api정보는 3시간 단위이기 때문에 정확한 날씨가 아닌 가장 최근 기록된 날씨이다.
      활용 : api정보의 3번째 데이터(list[2])를 활용
      */
      const weatherDescription = weatherData.list[2].weather[0].description;  // 상태(ex:맑음)
      const temperature = weatherData.list[2].main.temp.toFixed(0);  //온도
      const humidity = weatherData.list[2].main.humidity; //습도
      const windSpeed = weatherData.list[2].wind.speed;   //풍속
      // const maxTemperature = weatherData.list[2].main.temp_max;    //3시간 동안 최고온도
      // const minTemperature = weatherData.list[2].main.temp_min;   //3시간 동안 최저온도
      const sunriseTimeUTC = new Date(weatherData.city.sunrise * 1000); // UTC 시간으로 일몰 시간을 가져옴
      const sunriseTimeKST = new Date(sunriseTimeUTC.getTime() - (9 * 60 * 60 * 1000) + (9 * 60 * 60 * 1000)); // UTC 시간에서 9시간을 빼고 다시 9시간을 더하여 한국 시간으로 변환
      const sunriseHour = sunriseTimeKST.getHours().toString().padStart(2, '0'); // getHours()를 사용하여 한국 시간의 시간을 가져옴
      const sunriseMinute = sunriseTimeKST.getMinutes().toString().padStart(2, '0'); // getMinutes()를 사용하여 한국 시간의 분을 가져옴
      const formattedSunriseTime = `${sunriseHour}:${sunriseMinute}`; // 형식화된 일몰 시간을 생성 
      const sunsetTimeUTC = new Date(weatherData.city.sunset * 1000); // UTC 시간으로 일몰 시간을 가져옴
      const sunsetTimeKST = new Date(sunsetTimeUTC.getTime() - (9 * 60 * 60 * 1000) + (9 * 60 * 60 * 1000)); // UTC 시간에서 9시간을 빼고 다시 9시간을 더하여 한국 시간으로 변환
      const sunsetHour = sunsetTimeKST.getHours().toString().padStart(2, '0'); // getHours()를 사용하여 한국 시간의 시간을 가져옴
      const sunsetMinute = sunsetTimeKST.getMinutes().toString().padStart(2, '0'); // getMinutes()를 사용하여 한국 시간의 분을 가져옴
      const formattedSunsetTime = `${sunsetHour}:${sunsetMinute}`; // 형식화된 일몰 시간을 생성
      const currentDate = new Date(); //현재 날짜 얻어옴
      const weatherIconCode = weatherData.list[2].weather[0].icon;

      //현재 시각을 원하는 포맷으로 출력하기 위한 처리
      const month = currentDate.toLocaleString('default', { month: 'long' });
      const day = currentDate.getDate();
      const year = currentDate.getFullYear();
      let hour = currentDate.getHours();
      const minute = currentDate.getMinutes();

      const formattedDate = `${month} ${day}일, ${year} ${hour}:${minute < 10 ? '0' : ''}${minute}`;

      //정보들을 HTML로 출력하기 위해 ID 설정
      const timeElement = document.getElementById('current-time');
      const todayWeatherDescElement = document.getElementById('todayWeatherDesc');
      const todayWeatherTempElement = document.getElementById('todayWeatherTemp');
      const todayHumidElement = document.getElementById('todayHumid');
      const todaysunriseTimeElement = document.getElementById('sunriseTime');
      const todaysunsetTimeElement = document.getElementById('sunsetTime');
      const currentWindElement = document.getElementById('windspeed');
      const weatherIconElement = document.getElementById('todayIcon')
      const iconUrl = `./public/images/${weatherIconCode}.png`; // 이미지 파일의 경로

      timeElement.innerHTML = formattedDate;
      todayWeatherDescElement.innerHTML = `${weatherDescription}`;
      todayWeatherTempElement.innerHTML = `${temperature}` + "<span>°</span>";
      todayHumidElement.innerHTML = `${humidity}` + "<span>%</span>";
      todaysunriseTimeElement.innerHTML = `${formattedSunriseTime}`;
      todaysunsetTimeElement.innerHTML = formattedSunsetTime;
      currentWindElement.innerHTML = `${windSpeed}` + "<span>m/s</span>";
      weatherIconElement.src = iconUrl;

      /*
      2번째 기능 : 현재강수량 출력 함수 호출
      */
      displayWeatherInfo(weatherData);

      /*
      3번째 기능 : 24시간 비 여부 출력 함수 호출
      */
      checkRain(weatherData);

      /*
      4번째 기능: 온도별 권장 습도에 따라 습도 상태 호출
      */
      const conditionElement = document.getElementById('HumidityStatus');
      const conditionResult = checkCondition(temperature, humidity);
      conditionElement.innerHTML = `${conditionResult}`; // HTML 요소에 결과 표시

      /*
      5번째 기능: 현재 온도 기반 옷차림 추천 함수 호출
      */
      const outfitElement = document.getElementById('outfit');    //HTML의 id:outfit와 연결
      const suggestedOutfit = suggestOutfit(temperature); //함수 호출
      outfitElement.innerHTML = `추천 옷차림: ${suggestedOutfit}`;    //HTML에 출력

      /*
      6번째 기능: 하루 진행도 함수 호출
      */
      setSunsetBarWidth();

      /*
      7번째 기능: 페이지 하단 8칸 대입
      0: 오늘24시간날씨, 1: 내일 날씨, 2: 내일 모레날씨
      현재 반복되도록 구현
      */
      let currentDataIndex = 0; // 현재 표시 중인 데이터 인덱스 (0: 24시간 데이터, 1: 내일 데이터, 2: 내일 모레 데이터)
      displayData();

      // 좌측 화살표 클릭 시 이벤트 처리
      document.getElementById('arrowLeft').addEventListener('click', function () {
        showPreviousData();
      });

      // 우측 화살표 클릭 시 이벤트 처리
      document.getElementById('arrowRight').addEventListener('click', function () {
        showNextData();
      });

      function showPreviousData() {
        currentDataIndex--;
        if (currentDataIndex < 0) {
          currentDataIndex = 2; // 최초로 넘어갔을 때는 내일 모레 데이터로 설정
        }
        displayData();
      }

      function showNextData() {
        currentDataIndex++;
        if (currentDataIndex > 2) {
          currentDataIndex = 0; // 마지막 데이터에서 넘어갔을 때는 다시 24시간 데이터로 설정
        }
        displayData();
      }

      // 데이터 표시 함수
      function displayData() {
        const weatherListElement = document.querySelector('.weather-list');

        // 이전에 표시된 데이터를 지우기
        weatherListElement.innerHTML = '';

        if (currentDataIndex === 0) {
          // 24시간 데이터 표시
          display24WeatherData(weatherData);
        } else if (currentDataIndex === 1) {
          // 내일 데이터 표시
          displayTomorrowWeather(weatherData);
        } else if (currentDataIndex === 2) {
          // 내일 모레 데이터 표시
          display3Weather(weatherData);
        }
      }


    })

  /*
  8번째 기능: 3번째 API 사용, 대기질 현황을 받아와 대기질 상태를 출력
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
      if (airquality >= 1 && airquality <= 3) {
        airqualityText = 'NO';
      } else if (airquality >= 4 && airquality <= 5) {
        airqualityText = 'YES';
      } else {
        airqualityText = 'Unknown';
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

}




/*
1번째 함수: 온도별 옷차림 추천
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

/*
1번째 함수: 현재 강수량 정보 출력
현재 날씨에서 비가 올 시 API내에서 강수량 정보를 얻을 수 있는데 비가 안 올 시 제공해주지 않음
비가 올 시 강수량 정보를 얻어와서 출력하고 비가 안 올 시 '0'을 출력한다.
*/

function displayWeatherInfo(weatherData) {
  let rainAmount = 0; // 비가 내린 양을 저장할 변수를 초기화

  // 'Rain'인 경우 'weatherData.list[2].rain.1h'의 정보를 가져와 rainAmount 변수에 할당
  if (weatherData.list[2].weather[0].main === 'Rain') {
    rainAmount = weatherData.list[2].rain ? weatherData.list[2].rain['1h'] : 0;
  }

  // 비가 내린 경우에만 비가 내린 양을 출력
  if (rainAmount > 0) {
    document.getElementById('WeatherInfo').innerHTML = `${rainAmount}<span>mm</span>`;
  } else {
    document.getElementById('WeatherInfo').innerHTML = "0<span>mm</span>";
  }
}

/*
2번째 함수 : 24시간 비 여부 출력 함수 
한번이라도 비가 왔다면 변수에 저장
*/
function checkRain(weatherData) {
  let isRaining = false;
  for (let i = 0; i < 8; i++) {
    if (weatherData.list[i].weather[0].main === 'Rain') {
      isRaining = true;
      break;
    }
  }
  // 비 내용 HTML에 출력
  const rainElement = document.getElementById('rain');    //HTML의 id:rain과 연결
  rainElement.innerHTML = `${isRaining ? 'YES' : 'NO'}`;
}

/*
3번째 함수: 온도별 권장 습도에 따라 습도 상태 출력
구현 : 온도별 권장 습도 +-5% 내에 있을 시 'GOOD' 출력, 권장습도 범위를 벗어날 시 'BAD' 출력
온도와 습도에 따라서 조건 확인 후 결과 표시
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

/*
4번째 함수 : 하루 진행도 표현
구현 : 백분율을 리턴받아 bar형태로 가시화
*/
function setSunsetBarWidth() {
  // sunset-bar-now 요소 선택
  const sunsetBarNow = document.getElementById('sunset-bar-now');

  // 현재 시간을 얻기
  var now = new Date();

  // 현재 시간을 시간, 분, 초 단위로 변환
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();

  // 하루의 총 초 수
  var totalSecondsInDay = 24 * 60 * 60;

  // 현재까지의 총 초 수 계산
  var totalSecondsPassed = (hours * 60 * 60) + (minutes * 60) + seconds;

  // 백분율 계산
  var percentagePassed = (totalSecondsPassed / totalSecondsInDay) * 100;

  // sunset-bar-now 요소의 너비 설정
  sunsetBarNow.style.width = percentagePassed + '%';
}

/*
5~7번째함수 : 24시간,내일,모레 정보 입력 함수
5번째 함수: 24시간 날씨 정보 입력
구현 : 새로운 배열을 만들어 배열에 시간,온도,코드 반복문으로 저장하고 출력
*/
function display24WeatherData(weatherData) {
  // 날씨 정보 배열 초기화
  const weatherDataArray = [];

  // 받아온 날씨 데이터를 배열에 입력
  for (let i = 0; i <= 7; i++) {
    const time = weatherData.list[i].dt_txt;
    const temperature = weatherData.list[i].main.temp.toFixed(0); //정수로 반올림
    const weatherIconCode = weatherData.list[i].weather[0].icon;
    // 날씨 정보 객체 생성 및 배열에 추가
    const weatherInfo = {
      day: time.substr(5, 2) + "." + time.substr(8, 2), // 날짜만 표시 (ex: 03.15)
      hour: time.substr(11, 5), // 시간만 표시 (ex: 18:00)
      temperature: temperature,
      weatherIconCode: weatherIconCode, // 날씨 코드
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
}

/*
6번째 함수 : 내일 날씨 데이터 8개 출력
구현 : 필터링
*/
function displayTomorrowWeather(weatherData) {
  const currentDate = new Date();

  // 내일 계산
  const tomorrow = new Date(currentDate);
  tomorrow.setDate(currentDate.getDate() + 1);  //내일까지 필터링

  // 내일 데이터 추출
  const tomorrowWeatherData = weatherData.list.filter(item => {
    const date = new Date(item.dt_txt);
    return date.getDate() === tomorrow.getDate();
  });

  // 날씨 정보를 표시할 요소를 가져옴 (출력할 위치에 맞게 수정해야 함)
  const weatherListElement = document.querySelector('.weather-list');

  // 날씨 정보 배열을 반복하여 요소 생성
  tomorrowWeatherData.forEach(data => {
    // 날씨 요소 생성
    const weatherElement = document.createElement('div');
    weatherElement.classList.add('weather-element');

    // 요소 내용 설정
    const time = data.dt_txt;
    const temperature = data.main.temp.toFixed(0);
    const weatherIconCode = data.weather[0].icon;
    const day = time.substr(5, 2) + "." + time.substr(8, 2); // 날짜만 표시 (ex: 03.15)
    const hour = time.substr(11, 5); // 시간만 표시 (ex: 18:00)

    weatherElement.innerHTML = `
      <div class="element-date">
        <p class="text-element-day">${day}</p>
        <p class="text-element-time">${hour}</p>
      </div>
      <img class="img-element-weather" src="./public/images/${weatherIconCode}.png" alt="Weather Icon">
      <p class="element-temp">${temperature}<span>°</span></p>
    `;

    // 생성한 요소를 weatherListElement에 추가
    weatherListElement.appendChild(weatherElement);
  });
}

/*
7번째 함수 : 내일 모레 날씨 데이터 8개 출력
구현 : 필터링
*/
function display3Weather(weatherData) {
  const currentDate = new Date();

  // 내일 계산
  const tomorrow = new Date(currentDate);
  tomorrow.setDate(currentDate.getDate() + 2);  //모레까지 필터링

  // 내일 데이터 추출
  const tomorrowWeatherData = weatherData.list.filter(item => {
    const date = new Date(item.dt_txt);
    return date.getDate() === tomorrow.getDate();
  });

  // 날씨 정보를 표시할 요소를 가져옴 (출력할 위치에 맞게 수정해야 함)
  const weatherListElement = document.querySelector('.weather-list');

  // 날씨 정보 배열을 반복하여 요소 생성
  tomorrowWeatherData.forEach(data => {
    // 날씨 요소 생성
    const weatherElement = document.createElement('div');
    weatherElement.classList.add('weather-element');

    // 요소 내용 설정
    const time = data.dt_txt;
    const temperature = data.main.temp.toFixed(0);
    const weatherIconCode = data.weather[0].icon;
    const day = time.substr(5, 2) + "." + time.substr(8, 2); // 날짜만 표시 (ex: 03.15)
    const hour = time.substr(11, 5); // 시간만 표시 (ex: 18:00)

    weatherElement.innerHTML = `
      <div class="element-date">
        <p class="text-element-day">${day}</p>
        <p class="text-element-time">${hour}</p>
      </div>
      <img class="img-element-weather" src="./public/images/${weatherIconCode}.png" alt="Weather Icon">
      <p class="element-temp">${temperature}<span>°</span></p>
    `;

    // 생성한 요소를 weatherListElement에 추가
    weatherListElement.appendChild(weatherElement);
  });
}


