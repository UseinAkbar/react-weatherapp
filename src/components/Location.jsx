import React, {useState} from 'react';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWind, faRoad, faMapMarkerAlt, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';
import Lottie from 'react-lottie';
import animationData from '../watermelon-animation.json';
library.add(faWind, faRoad, faInstagram, faGithub, faMapMarkerAlt, faMapMarkedAlt);

function Location({date}) {
	const [location, setLocation] = useState({county: '', city: '', road: '', postcode: '', lat: '', lng: ''});
	const [locWeather, setLocWeather] = useState({temp: '', country: '', main: '', icon:'', speed:''});
	const [isAgree, setAgree] = useState(false);
	const [background, setBackground] = useState('');
	const [imgData, setImgData] = useState('');
	const imgUrl = 'http://openweathermap.org/img/wn/' + locWeather.icon + '@2x.png';
	const api = {
		key: '5a73875b9b94f32104a4fa9ba576eaa2',
		token: '005b5f421ee408',
		baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
	}
	const mapUrl = 'https://maps.locationiq.com/v2/staticmap';


	const {key, token, baseUrl} = api;

	const defaultOptions = {
    loop: true,
    renderer: 'svg',
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

	const backgroundWeather = (icon) => {

    if (icon === '01d' || icon === '01n') {
      setBackground('clear');

    } else if (icon === '02d' || icon === '02n' || icon === '03d' || icon === '03n' || icon === '04d' || icon === '04n') {
      setBackground('clouds');

    } else if (icon === '09d' || icon === '09n' || icon === '10d' || icon === '10n') {
    	setBackground('rain');

    } else if (icon === '11d' || icon === '11n') {
    	setBackground('storm');

    } else if (icon === '13d' || icon === '13n') {
    	setBackground('snow');

    } else if (icon === '50d' || icon === '50n') {
    	setBackground('mist');
    }
  }

	const viewMap = () => {
		axios(mapUrl, {
      params: {
        key: token,
				size: '500x500',
				zoom: '14',
				markers: `${location.lat},${location.lng}|icon:small-red-cutout;`,
				format: 'png'
      }
    }).then(response => {
			var data = response.data;
			setImgData(data);


		}).catch(err => {
			console.log(err);
		})
	}

	const fetchData = (locData) => {
		var [county, city, road, postcode, lat, lng] = locData;
		setLocation(prevValue => {
			return {
				...prevValue,
				county,
				city,
				road,
				postcode,
				lat,
				lng
			}
		})

    axios(baseUrl, {
      params: {
        q: county,
        units: 'metric',
        appid: key
      }
    }).then(response => {
      const {name, main: {temp}, sys: {country}, weather, wind: {speed}} = response.data;
      const [currentWeather] = weather;
      const {main, icon} = currentWeather;
      setLocWeather(prevValue => {
        return {
          ...prevValue,
          temp: temp,
          country: country,
          main: main,
          icon: icon,
          speed: speed
        }
      })
			backgroundWeather(icon);
    }).catch(err => {
      console.log(err);
    })
  }

	//Get user coordinates
	const getCoordintes = () => {
		var options = {
			enableHighAccuracy: true,
			maximumAge: 0
		};

		function success(position) {
			var crd = position.coords;
			var lat = crd.latitude.toString();
			var lng = crd.longitude.toString();

			axios('https://us1.locationiq.com/v1/reverse.php', {
		      params: {
		        format: 'json',
						key: token,
						lat: lat,
						lon: lng
		      }
		    })
			.then(response => {
				var {address: {county, city, road, postcode}} = response.data;
				var locData = [county, city, road, postcode, lat, lng];
				console.log(response.data);
				fetchData(locData);
			}).catch(err => {
        console.log(err);
        });
		}

		function error(err) {
			console.warn(`ERROR(${err.code}): ${err.message}`);
		}


		navigator.geolocation.getCurrentPosition(success, error, options);
	}


	const handleClick = () => {
		getCoordintes();
		setAgree(true);
	}

	return (<div className="container">
		<div className="illustration-box-top">
			<h3 className="askHeading-1"><span>Curious about the current weather ?</span></h3>
			<Lottie options={defaultOptions}
				height={500}
				width={500}
			/>
		</div>
		{
			isAgree ?
				<div className= {`section-weather ${background}`} id="sectionWeather">
					<div className="nav-map" onClick={viewMap}><FontAwesomeIcon icon='map-marked-alt' className="icon-map-1" /></div>
					{/* <img src= {`data:../images/png;base64,${imgData}`} alt="map"></img> */}
					<div className="locationWeather">
						<div className="location locationWeather-region">
							<FontAwesomeIcon icon='map-marker-alt' className="icon-map-2" /> {`${location.county}, ${locWeather.country}`}
						</div>
						<div className="date locationWeather-date">{date(new Date())}</div>
					</div>
					<div className="weatherBox">
						<div className="temp weatherTemp">
							{Math.round(locWeather.temp)}°C
						</div>
						<div className="locDesc">
							<div className="loc-icon">{locWeather.main}<img src={imgUrl} alt="weatherIcon" /></div>
							<div className="loc-wind"><FontAwesomeIcon icon='wind' className="icon-wind" /> {locWeather.speed}km/h</div>
						</div>
					</div>
					<span className="address">
						<FontAwesomeIcon icon='road' className="icon-road" /> {location.road} - <img src='../images/mailbox.svg' alt='Mailbox' className="icon-mail"></img>{location.postcode}
					</span>
				</div>
			:
			<div className="section-ask">
				<img src='../images/human-illustration-1.svg' alt="People illustration" className="imgIllustration-1"></img>
				<div className="boxButton">
					<div className="askButton">
						<h3 className="askHeading-2"><span>Wanna know the weather on your place ?</span></h3>
						<button type="submit" onClick={handleClick} className="button askButton-1">Sure !</button>
						<a href="#mainSearch" className="button askButton-2">Maybe later</a>
					</div>
				</div>
			</div>
		}
		<div className="illustration-box-bottom">
			<img src='../images/human-illustration-2.svg' alt="People illustration" className="imgIllustration-2"></img>
		</div>
		<div className="copyRight">
			<div className="icon-social">
				<a href="https://github.com/UseinAkbar"><FontAwesomeIcon icon={['fab', 'github']} className="icon icon-github" /></a>
				<a href="https://instagram.com/useinakbarr"><FontAwesomeIcon icon={['fab', 'instagram']} className="icon icon-instagram" /></a>
			</div>
			<p>Made with ❤️ in Jakarta</p>
			<p><em>Copyright &copy;useinakbar {new Date().getFullYear()}</em></p>
		</div>
					</div>)


}

export default Location;