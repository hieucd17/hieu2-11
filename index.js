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

  //Xem th???i ti???t
  if(handleText.includes('th???i ti???t t???i') ) {
    let location = handleText.split('t???i')[1].trim() ;
    console.log('location :', location);

    searchInput.value = location ;
    const changeEvent = new Event('change');
    searchInput.dispatchEvent(changeEvent);
    return;
  }
  if(handleText.includes('th???i ti???t') ) {
    let location1 = handleText.split('ti???t')[1].trim() ;
    console.log('location :', location1);

    searchInput.value = location1 ;
    const changeEvent = new Event('change');
    searchInput.dispatchEvent(changeEvent);
    return;
  }

  //Thay ?????i m??u n???n
  const container = document.querySelector('.container');
  if (handleText.includes('thay ?????i m??u n???n')) {
    let color = handleText.split('m??u n???n')[1].trim();
    container.style.background = color;
  }

  if(handleText.includes('m??u n???n m???c ?????nh')) {
    container.style.background = '';
    return;
  }
  //Xem th???i gian
  if (handleText.includes('m???y gi???')) {
    const textToSpeech = `${moment().hours()} hours ${moment().minutes()} minutes`;
    speak(textToSpeech);
    return;
  
  }

  if(handleText.includes("bao gi??? m???i ??i h???c")) {
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

