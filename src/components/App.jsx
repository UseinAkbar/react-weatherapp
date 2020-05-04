import React, {useState} from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({temp: '', name: '', country: '', main: '', icon:'', speed:''});
  const [time, setTime] = useState('');
  const [isDone, setDone] = useState(false);
  const imgUrl = 'http://openweathermap.org/img/wn/' + weather.icon + '@2x.png'

  setInterval(currentTime, 1000);

  function currentTime() {
    const newTime = new Date().toLocaleTimeString();
    setTime(newTime);
  }

  const customDate = (d) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    var year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
  }

  const api = {
    key: 'dbd7471b028ab6754cce2294feb5b022',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
  }
  const {key, baseUrl} = api;

  function handleChange(event) {
    const cityName = event.target.value;
    setQuery(cityName);
  }

  function fetchData() {
    axios(baseUrl, {
      params: {
        q: query,
        units: 'metric',
        appid: key
      }
    }).then(response => {
      const {name, main: {temp}, sys: {country}, weather, wind: {speed}} = response.data;
      const [currentWeather] = weather;
      const {main, icon} = currentWeather;
      setWeather(prevValue => {
        return {
          ...prevValue,
          name: name,
          temp: temp,
          country: country,
          main: main,
          icon: icon,
          speed: speed
        }
      })
      console.log(`${name} ${country} ${temp} ${main}`);

    }).catch(err => {
      console.log(err);
    })
  }

  function handleClick() {
    fetchData();
    setDone(true);
    setQuery('');
  }

  return <div className={(
  weather.temp > 16)
    ? "app warm"
    : "app"}>
    <main className={!isDone && "main"}>
      <div className="search-box">
        <input type="text" name='city' placeholder="Search a city" onChange={handleChange} className="search-bar" value={query} autoComplete="off"/>
        <button type="submit" onClick={handleClick} className='search-button'>Search</button>
      </div>
      {
        isDone
          ? <div>
            <div className="location-box">
              <div className="location">{`${weather.name}, ${weather.country}`}</div>
              <div className="date">{customDate(new Date())}</div>

            </div>
            <div className="weather-box">
              <div className="temp">
                {Math.round(weather.temp)}°C
              </div>
              <div className="weather">
                <div className="weather__desc">{weather.main}<img src={imgUrl} /></div>
                <div className="weather__wind">Wind: {weather.speed}km/h</div>
              </div>
            </div>
          </div>
          : <div className="section-title"><div className="title">
            <h1 className="main-title">Weather App</h1>
            <h2 className="sub-title">Check the current weather</h2>
          </div>
            <div className="realTime">{time}</div>
            <div className="copyRight"><p><em>Copyright &copy; 2020</em></p></div>
          </div>
      }

    </main>
  </div>
}

export default App;
