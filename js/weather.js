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

    // 국가명,지역명,도시명 HTML에 출력
    // const locationElement = document.getElementById('location');
    // locationElement.innerHTML = `나라: ${country}<br>지역명: ${regionName}<br>도시: ${city}<br>
    // 위도: ${lat}<br>경도: ${lon}`;

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

        // const weatherElement = document.getElementById('weather');  //HTML의 id:weather와 연결
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
        const sunriseTime = new Date(weatherData.city.sunrise * 1000).toLocaleTimeString(); //일출시간
        const sunsetTime = new Date(weatherData.city.sunset * 1000).toLocaleTimeString();   //일몰시간
        const currentTime = new Date().toLocaleTimeString();    //현재시각
        const date = weatherData.list[2].dt_txt;    //측정시각(ex:2024-03-19 09:00:00)

        const timeElement = document.getElementById('current-time');
        timeElement.innerHTML = `${currentTime}`;

        const todayWeatherDescElement = document.getElementById('todayWeatherDesc');
        todayWeatherDescElement.innerHTML = `${weatherDescription}`;

        const todayWeatherTempElement = document.getElementById('todayWeatherTemp');
        todayWeatherTempElement.innerHTML = `${temperature}°c`;



        // const timeElement = document.getElementById('current-time');    //현재 시각 HTML에 출력 id:current-time과 연결
        // timeElement.innerHTML = `현재 시간: ${currentTime}`;

        // // 현재 시각 날씨 정보 HTML에 출력
        // weatherElement.innerHTML = `나라: ${country}, 도시: ${regionName}<br>
        //       날씨: ${weatherDescription}, 온도: ${temperature}도<br>
        //       습도: ${humidity}%, 풍속: ${windSpeed}m/s<br>
        //       일출 시간: ${sunriseTime}, 일몰 시간: ${sunsetTime}<br>
        //       최고 온도: ${maxTemperature}, 최저 온도: ${minTemperature}<br>
        //       측정 시각: ${date}`;


        /*
        2번째 기능: 24시간 날씨 출력
        API 정보의 0~7번 인덱스의 정보 출력: 최근 6시간 전/최근 3시간 전/최근 기록/3시간 후/.../15시간 후
        */
        // 24시간 정보 HTML에 출력
        // const forecastElement = document.getElementById('forecast'); // HTML의 id:forecast와 연결
        // let max = weatherData.list[0].main.temp_max; // 최고 온도 초기화
        // let min = weatherData.list[0].main.temp_min; // 최저 온도 초기화

        const ulElement = document.querySelector('.weather-list ul');
        for (let i = 0; i <= 7; i++) {
          const weatherDescription = weatherData.list[i].weather[0].description;
          const temperature = weatherData.list[i].main.temp.toFixed(1);
          const time = weatherData.list[i].dt_txt;
          // const maxT = weatherData.list[i].main.temp_max;
          // const minT = weatherData.list[i].main.temp_min;

          // 24시간 내의 최고, 최저 온도 갱신
          // if (weatherData.list[i].main.temp_max > max) {
          //   max = weatherData.list[i].main.temp_max;
          // }
          // if (weatherData.list[i].main.temp_min < min) {
          //   min = weatherData.list[i].main.temp_min;
          // }

          // forecastElement.innerHTML += `날씨: ${weatherDescription}, 온도: ${temperature}, 시간: ${time}, 최고 온도: ${maxT}, 최저 온도: ${minT}<br>`;
         // li 요소 생성
         const liElement = document.createElement('li');
            
         // li 요소 내부에 날씨 정보 추가
         liElement.innerHTML = `
             <div class="weather-element last">
                 <div class="element-date">
                     <p class="text-element-day">${time.substr(5, 2)}.${time.substr(8, 2)}</p>
                <p class="text-element-time">${time.substr(11, 5)}</p>
                 </div>
                 <div class="img-element-weather">
                     <img src="./public/images/small_sun.png" alt="">
                 </div>
                 <p class="element-temp">${temperature}°c</p>
             </div>
         `;
         
         // ul에 li 요소 추가
         ulElement.appendChild(liElement);
        }

        // forecastElement.innerHTML += `최고 온도: ${max}, 최저 온도: ${min}<br>`;



        /*
        3번째 기능 : 24시간 내에 비가 오는 지 확인
        한번이라도 비가 왔다면 변수에 저장
        추후에 우산 챙기는 기능에 사용가능
        */
        let isRaining = false;
        for (let i = 0; i < 8; i++) {
          if (weatherData.list[i].weather[0].main === 'Rain') {
            isRaining = true;
            break;
          }
        }
        // // 비 내용 HTML에 출력
        // const rainElement = document.getElementById('rain');    //HTML의 id:rain과 연결
        // rainElement.innerHTML = `24시간 내에 비가 오는지: ${isRaining ? '비가 옴' : '비가 오지 않음'}`


        /*
        4번째 기능: 현재 온도 기반 옷차림 추천
        맨 아래에 suggestedOutfit 함수 구현 후 호출
        */
        // const outfitElement = document.getElementById('outfit');    //HTML의 id:outfit와 연결
        const suggestedOutfit = suggestOutfit(temperature); //함수 호출
        // outfitElement.innerHTML = `추천 옷차림: ${suggestedOutfit}`;    //HTML에 출력

        /*
        5번째 기능: 내일의 정보 출력
        구현 : 내일의 정보를 얻어오기 위해 현재 날짜를 가져오고 +1 정보 추출(필터링)
        추가적으로 내일 모래도 가능함
        */

        // 현재 날짜 정보를 얻기 위해 Date객체 사용
        const currentDate = new Date();

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


      })
      .catch(error => {
        console.error('Error fetching weather info:', error);
      });
  })
  .catch(error => {
    console.error('Error fetching IP info:', error);
  });



/*
1번째 함수: 현재 온도로 옷차림 추천
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
