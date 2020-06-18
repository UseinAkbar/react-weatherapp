import React, {useState} from 'react';
import Load from './Load';
import axios from 'axios';
import Location from './Location';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faWind, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
// import ReactLoading from 'react-loading';
library.add(faSearch, faWind, faMapMarkerAlt);

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({tempC: '', tempF: '', name: '', country: '', main: '', icon:'', speed:''});
  const [time, setTime] = useState('');
  const [isDone, setDone] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [background, setBackground] = useState('');
  const [isLoad, setLoad] = useState(false);
  const imgUrl = 'http://openweathermap.org/img/wn/' + weather.icon + '@2x.png';

  //Set the title on loading page
  const currentTime = () => {
    const newTime = new Date().toLocaleTimeString();
    setTime(newTime);
  }

  setInterval(currentTime, 1000);

  const greet = () => {
    const date = new Date();
    const currentHour = date.getHours();

    if (currentHour < 12) {
      setGreeting('Good Morning');
      setBackground('morning');
    } else if (currentHour > 15 && currentHour <= 18 ) {
      setGreeting('Good Evening');
      setBackground('evening');
    } else if (currentHour <= 15) {
      setGreeting('Good Afternoon');
      setBackground('afternoon');
    } else {
      setGreeting('Good Night');
      setBackground('night');
    }
  }

  setTimeout(greet, 100);

  //Set the main content of the web apps
  const customDate = (d) => {

    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];

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

  const handleChange = (event) => {
    const cityName = event.target.value;
    setQuery(cityName);
  }

  //Fetch the fahrenheit degrees
  const convertToFahrenheit = (temp) => {
		const tempF = temp * 9/5 + 32;
		setWeather(prevValue => {
			return {
				...prevValue,
				tempF
			}
		})
	}
  //React loading animation while fetching the data
  const loadAnime = (data) => {
    ( !data ? setLoad(true) : setLoad(false) );
	};

  const fetchData = () => {
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
          name,
          tempC: temp,
          country,
          main,
          icon,
          speed
        }
      })
      convertToFahrenheit(temp);
      loadAnime(temp);
    }).catch(err => {
      setLoad(false);
      alert('Please check the city name!');
      console.log(err);
    })
  }

  const handleClick = () => {
    loadAnime('');
    fetchData();
    setDone(true);
    setQuery('');
  }

  return <div className={(
  weather.temp > 16)
    ? "app warm"
    : "app"}>

    {
			isLoad && <Load />
		}

    <main className={!isDone ? `main ${background}` : undefined} id="mainSearch">
      <div className="search-box" data-aos="fade-down" data-aos-duration="800">
        <input type="text" name='city' id="searchCity" placeholder="Search a city" onChange={handleChange} className="search-bar" value={query} autoComplete="off"/>
        <label for="searchCity" className="search-label">Search a city</label>
        <button type="submit" onClick={handleClick} className='search-button'><FontAwesomeIcon icon='search' className="icon" /></button>
      </div>
      {
        isDone
          ? <div className="setWeather">
            <div className="location-box">
              <div className="location"><FontAwesomeIcon icon='map-marker-alt' className="icon-map" /> {`${weather.name}, ${weather.country}`}</div>
              <div className="date">{customDate(new Date())}</div>
            </div>
            <div className="weather-box">
              <div className="temp">
                {Math.round(weather.tempC)}°C
                <div className="tempFahrenheit"><span>{Math.round(weather.tempF)}°F</span></div>
              </div>
              <div className="weather">
                <div className="weather__desc">{weather.main}<img src={imgUrl} alt="weatherIcon" /></div>
                <div className="weather__wind"><FontAwesomeIcon icon='wind' className="icon-wind" /> {weather.speed}km/h</div>
              </div>
            </div>
          </div>
          : <div className="section-title">
            <div className="title">
              <h1 className="greet-title" data-aos="fade-up" data-aos-duration="800">{greeting}</h1>
              <h2 className="sub-title" data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">Check the current weather</h2>
            </div>
            <div className="realTime" data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">{time}</div>
          </div>
      }
    </main>
    {
      !isDone && <Location
        date={customDate}
                 />
    }
  </div>
}

export default App
