

//header
const header = document.querySelector("header");
const colorPalette = header.querySelector("input");
const arrow = document.getElementById("arrow");
//clock
const clock = document.querySelector(".clock");
const weather = clock.querySelector(".weather");
const watch = clock.querySelector(".watch");
const ampm = clock.querySelector(".ampm");
const second = clock.querySelector(".seconds");
const dateToday = clock.querySelector(".dateToday");
//nav
const timetableNav = document.querySelector(".timetableNav"); // 네비게이션
const select = document.querySelectorAll(".select");

const breakfastButton = document.getElementById("morning");
const lunchButton = document.getElementById("afternoon");
const dinnerButton = document.getElementById("evening");

//timetable
let selectedDate = document.getElementById("selectedDate");

const timetableBreakfast = document.querySelector(".timetableBreakfast");
const timetableLunch = document.querySelector(".timetableLunch");
const timetableDinner = document.querySelector(".timetableDinner");






// ---------------- 시계

let year,month,date,weekday,hour,minutes,seconds,judgeAmpm,week;

function getTime(){
  currentTime(true);
  watch.innerHTML = `${hour}:${minutes}`;
  ampm.innerHTML = judgeAmpm;
  second.innerHTML = seconds;
  dateToday.innerHTML = `${year}년 ${month}월 ${date}일 ${week[weekday]}요일`;
}

function currentTime(clockSet) {
  time = new Date();
  year = time.getFullYear();
  month = time.getMonth() + 1;
  date = time.getDate();
  weekday = time.getDay();
  hour = time.getHours();
  minutes = time.getMinutes();
  seconds = time.getSeconds();
  week = ['일', '월', '화', '수', '목', '금', '토'];

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  if(clockSet) {
    if(hour > 12){
      hour = hour - 12;
      judgeAmpm = "오후";
    } else judgeAmpm = "오전";
  }
}

function setSelectedDate(a) {
  const yearr = time.getFullYear();
  const monthh = month < 10 ? "0" + month : month;
  const datee = date < 10 ? "0" + date : date;
  console.log(yearr + "-" + monthh + "-" + datee);
  return yearr + "-" + monthh + "-" + datee;
}

// ---------------- Local Storage에서의 초기 세팅

// 기본 색상 정리 : 'headerColor'

if(window.localStorage.getItem('headerColor')) {
  document.documentElement.style.setProperty('--main-color', window.localStorage.getItem('headerColor'));
  setFontColor(window.localStorage.getItem('headerColor'));
  colorPalette.value = window.localStorage.getItem('headerColor');
}

// ---------------- 메인 색깔 변경

colorPalette.addEventListener('change', () => {
    window.localStorage.setItem('headerColor', colorPalette.value);
    document.documentElement.style.setProperty('--main-color', window.localStorage.getItem('headerColor'));
    setFontColor(window.localStorage.getItem('headerColor'));
});
// 색깔 명도에 따른 글씨 색깔 설정
function setFontColor(hex) {
  // hex 명도 추출(로컬 스토리지에서 저장하고 받아오는 색깔은 hex코드로 반환되기 때문)
  let rgb = [];
  if (hex.length === 7) { // #은 제외시키고 계산
    rgb.push(parseInt(hex.slice(1, 3), 16)); // parseInt를 통해 16진수를 10진수로 변환한다.
    rgb.push(parseInt(hex.slice(3, 5), 16));
    rgb.push(parseInt(hex.slice(5, 7), 16));
  }
  const judgeFontColor = Math.min(rgb[0], rgb[1], rgb[2],);
  if(judgeFontColor <= 128) { // 테마가 어두우면
    header.style.color = "#ffffff";
    arrow.src="image/arrow-white.png";
    watch.classList.remove("bordering");
    selectedDate.style.setProperty('border-color', 'var(--main-color)');
  } else { // 테마가 밝으면
    header.style.color = "#000000";
    arrow.src="image/arrow-black.png";
    if(judgeFontColor > 230 ) watch.classList.add("bordering");
    else watch.classList.remove("bordering");
    selectedDate.style.borderColor = "#777777";
  }
}
//  rgb 명도 추출(객체.style 형식으로 색깔을 추출할 때는 rgb(r, g, b) 형식으로 출력됨)
// let rgb = hex.match(/\d+/g).map(Number);
// 안에 있는 것들 중 숫자만 추출해고 map(Number)라는 코드로 숫자를 이어서 nums에다가 넣는다.



let apiTemp, apiWeather;
// 날씨 API
function getWeather() {
  navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
  function onGeoOk(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const WEATHER_API_KEY = window.localStorage.getItem("WEATHER_API_KEY");
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
        apiWeather = data.weather[0].main; // 날씨 추출
        apiTemp = ((data.main.temp) - 273.15).toFixed(1);// 온도 추출(화씨를 섭씨로)
        weather.innerHTML = `| ${apiTemp}℃ / ${apiWeather}`;
    }); 
  }
  function onGeoError() {
    weather.innerHTML = "| Loading failed...";
  }
}



// ---------------- timetableSlot(버튼) 설정

breakfastButton.addEventListener('click', () => {

  afternoon.classList.remove("select");
  evening.classList.remove("select");
  morning.classList.add("select");

  timetableLunch.classList.remove("view");
  timetableDinner.classList.remove("view");
  timetableBreakfast.classList.add("view");


});
lunchButton.addEventListener('click', () => {
  morning.classList.remove("select");
  evening.classList.remove("select");
  afternoon.classList.add("select");

  timetableBreakfast.classList.remove("view");
  timetableDinner.classList.remove("view");
  timetableLunch.classList.add("view");

});
dinnerButton.addEventListener('click', () => {
  morning.classList.remove("select");
  afternoon.classList.remove("select");
  evening.classList.add("select");

  timetableBreakfast.classList.remove("view");
  timetableLunch.classList.remove("view");
  timetableDinner.classList.add("view");
});
// 함수로 묶어서 쓸려했는데 제대로 안 누르면 아무것도 안 눌리는 상태가 되는 버그생김 ^^7
// 원인은 e.target인 듯(반응이 바로바로 안 되어 일일이 코드를 부여할 수밖에 없다. )ㄴ
// timetableSlot.forEach(function(slot) {
//   slot.classList.remove('select');
// });
// e.target.classList.add('select');


// ---------------- 급식 API

selectedDate.addEventListener('change', () => { // 업데이트
  setMeal(selectedDate.value);
});


function setMeal(input) {
  const Date1 = input.replace(/[-/s]/g, ""); // API 날짜를 불러오기 위한 컨버팅
  getMealApi(Date1);
}      
  

const office = window.localStorage.getItem("office");
const school = window.localStorage.getItem("school");
const MP_API_KEY = window.localStorage.getItem("MP_API_KEY");
let getBreakfast, getLunch, getDinner;
function getMealApi(day) {
  fetch(`https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${MP_API_KEY}&Type=json&pIndex=1&pSize=20&ATPT_OFCDC_SC_CODE=${office}&SD_SCHUL_CODE=${school}&MLSV_YMD=${day}`)
    .then((response) => response.json())
    .then(data => {
      console.log(data);
      if(data.mealServiceDietInfo) {
        getBreakfast = data.mealServiceDietInfo[1].row[0] === (null || undefined) ? null : foodFilter(data.mealServiceDietInfo[1].row[0].DDISH_NM);  
        getLunch = data.mealServiceDietInfo[1].row[1] === (null || undefined) ? null : foodFilter(data.mealServiceDietInfo[1].row[1].DDISH_NM);  
        getDinner = data.mealServiceDietInfo[1].row[2] === (null || undefined) ? null : foodFilter(data.mealServiceDietInfo[1].row[2].DDISH_NM); 
      } else {
        getBreakfast = null;
        getLunch = null;
        getDinner = null;
      }
        
        

        timetableBreakfast.querySelectorAll('p').forEach(p => p.remove());
        timetableLunch.querySelectorAll('p').forEach(p => p.remove());
        timetableDinner.querySelectorAll('p').forEach(p => p.remove());

        let timetable = {timetableBreakfast, timetableLunch, timetableDinner};

        if(getBreakfast) {
          getBreakfast.forEach(tag => {
            const pElement = document.createElement('p');
            pElement.textContent = tag;
            timetableBreakfast.appendChild(pElement);
          })
        } else gettingError(timetableBreakfast);

        if(getLunch) {
          getLunch.forEach(tag => {
            const pElement = document.createElement('p');
            pElement.textContent = tag;
            timetableLunch.appendChild(pElement);
        })
        } else gettingError(timetableLunch);

        if(getDinner) {
          getDinner.forEach(tag => {
            const pElement = document.createElement('p');
            pElement.textContent = tag;
            timetableDinner.appendChild(pElement);
          })
        } else gettingError(timetableDinner);

        function gettingError(a) {
          const pElement = document.createElement('p');
          pElement.textContent = "급식 없다 굶어라";
          a.appendChild(pElement);
          
        }


      })
    .catch(error => {
      console.error('Error:', error);
    });
}

function foodFilter (food) { // 급식 API에서 받은 정보를 컨버팅해서 배열로 반환
  console.log(food);
  food = food.replace(/\(([\uAC00-\uD7AF.*]+)\)/g, ""); // \uAC00-\uD7AF -> 유니코드 상의 한글 범위
  food = food.replace(/[0-9 \. \* \( \)]/g, "");
  a = food.split('<br/>').filter((value) => {
      return value !== '';
  });
  return a;
}


// ---------------- 초기 세팅(TDZ 땨문에 맨 아래에다가 넣어둠)

let start = true;
if(start) {
  getWeather();
  getTime();
  selectedDate.value = setSelectedDate(false);
  setMeal(selectedDate.value);
  start = false;

}
// ---------------- 반복되는 코드

function updateTime(){
  setInterval(getTime, 500);
}
updateTime();
