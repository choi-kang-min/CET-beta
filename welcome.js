
const header = document.querySelector("header");
const colorPalette = header.querySelector("input");
const arrow = document.getElementById("arrow");



if(window.localStorage.getItem('headerColor')) {
    document.documentElement.style.setProperty('--main-color', window.localStorage.getItem('headerColor'));
    setFontColor(window.localStorage.getItem('headerColor'));
    colorPalette.value = window.localStorage.getItem('headerColor');
  }
  colorPalette.addEventListener('change', () => {
      window.localStorage.setItem('headerColor', colorPalette.value);
      document.documentElement.style.setProperty('--main-color', window.localStorage.getItem('headerColor'));
      setFontColor(window.localStorage.getItem('headerColor'));
  });
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
    } else { // 테마가 밝으면
      header.style.color = "#000000";
      arrow.src="image/arrow-black.png";
    }
  }