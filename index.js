const app_id = `d820d00d91c2d3bc587286e7162950a9`;

const searchInput = document.querySelector('#search_input');
const city_name = document.querySelector('.weather_city');
const weather_state = document.querySelector('.weather_state');
const weather_icon = document.querySelector('.weather_icon');
const temperature = document.querySelector('.temperature');
const default_value = '--';

const sunrise = document.querySelector('.sunrise');
const sunset = document.querySelector('.sunset');
const humidity = document.querySelector('.humidity');
const wind_speed = document.querySelector('.wind_speed');

searchInput.addEventListener('change', (e) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=${app_id}& units=metric&lang=vi`)
    .then( async res => {
        const data = await res.json();
        console.log('[search]', data);
        city_name.innerHTML = data.name || default_value;
        weather_state.innerHTML = data.weather[0].description || default_value;
        weather_icon.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`) || default_value ;
        temperature.innerHTML = Math.round(data.main.temp) || default_value;

        sunrise.innerHTML = moment.unix(data.sys.sunrise).format('H:mm') || default_value;
        sunset.innerHTML = moment.unix(data.sys.sunset).format('H:mm') || default_value;
        humidity.innerHTML = data.main.humidity || default_value;
        wind_speed.innerHTML = (data.wind.speed).toFixed(2) || default_value;
    });
  });

///Microphone

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

const recognition = new SpeechRecognition();
const synth = window.speechSynthesis;

recognition.lang = 'vi-VI';
recognition.continuous = false;

const speak = (text) => {
  if (synth.speaking) {
      console.error('Busy. Speaking...');
      return;
  }

  const utter = new SpeechSynthesisUtterance(text);

  utter.onend = () => {
      console.log('SpeechSynthesisUtterance.onend');
  }
  utter.onerror = (err) => {
      console.error('SpeechSynthesisUtterance.onerror', err);
  }

  synth.speak(utter);
};

const handleVoice = (text) => {
  console.log('text:' , text);
  const handleText = text.toLowerCase();

  //Xem thời tiết
  if(handleText.includes('thời tiết tại') ) {
    let location = handleText.split('tại')[1].trim() ;
    console.log('location :', location);

    searchInput.value = location ;
    const changeEvent = new Event('change');
    searchInput.dispatchEvent(changeEvent);
    return;
  }
  if(handleText.includes('thời tiết') ) {
    let location1 = handleText.split('tiết')[1].trim() ;
    console.log('location :', location1);

    searchInput.value = location1 ;
    const changeEvent = new Event('change');
    searchInput.dispatchEvent(changeEvent);
    return;
  }

  //Thay đổi màu nền
  const container = document.querySelector('.container');
  if (handleText.includes('thay đổi màu nền')) {
    let color = handleText.split('màu nền')[1].trim();
    container.style.background = color;
  }

  if(handleText.includes('màu nền mặc định')) {
    container.style.background = '';
    return;
  }
  //Xem thời gian
  if (handleText.includes('mấy giờ')) {
    const textToSpeech = `${moment().hours()} hours ${moment().minutes()} minutes`;
    speak(textToSpeech);
    return;
  
  }

  if(handleText.includes("bao giờ mới đi học")) {
    const textToSpeech = "You are so funny"
    speak(textToSpeech);
    return;
  }

  speak('Try again')
}

const microphone = document.querySelector('.microPhone');
microphone.addEventListener('click', (e) => {
  e.preventDefault();

  recognition.start()
  microphone.classList.add('recording');
});

recognition.onspeechend = () => {
  recognition.stop();

  microphone.classList.remove('recording')
  searchInput.value = '';
}

recognition.onerror = (error) => {
  console.log(error);

  microphone.classList.remove('recording')
}

recognition.onresult = (e) => {
  console.log('onresult :', e );
  const text = e.results[0][0].transcript;
  handleVoice(text);
}
// ----------------------

