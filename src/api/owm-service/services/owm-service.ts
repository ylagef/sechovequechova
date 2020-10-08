import Weather from "../../../shared/models/Weather";
import axios from 'axios';
import City from "../../../shared/models/City";
import { OwmData } from "../models/owm-data";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

const apiKey = "dde3b622ba086b84425094d1d5ba3f85";

function getData(city: City) {
    return axios({
        url: `https://api.openweathermap.org/data/2.5/onecall?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric&exclude=minutely`,
        method: 'get'
    }).then(async response => {
        return response.data as OwmData;
    }).catch(e => {
        console.error('getHourlyData - ' + e);
        return Promise.resolve(null);
    });
}

function parseSky(sky: string): string {
    if (sky.toLowerCase().includes('lluvia')) {
        return 'rain';
    } else if (sky.toLowerCase().includes('nuboso') || sky.toLowerCase().includes('cubierto')) {
        return 'cloud';
    } else {
        return 'clear';
    }
}

function getFormattedTime(time: number) {
    const date = new Date(time * 1000);
    return (date.getHours() > 9 ? date.getHours() : '0' + date.getHours())
        + ':' + (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes());
}

function getFormattedDate(time: number) {
    const date = new Date(time * 1000);
    return (date.getDate() > 9 ? date.getDate() : '0' + date.getDate())
        + '/' + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1));
}

export async function owmGetWeatherData(city: any, setWeatherData: any, handleError: any): Promise<any> {
    if (city.lat === 0 && city.lat === 0) {
        return handleError('Error en la consulta');
    } else {
        const data = await getData(city);

        if (data) {
            let weather: Weather = {};
            weather.city = city;
            weather.updated = new Date();

            weather.current = {
                temp: Math.round(data.current.temp),
                feelsLike: Math.round(data.current.feels_like),
                min: Math.round((data.daily || [])[0].temp.min),
                max: Math.round((data.daily || [])[0].temp.max),
                sky: { icon: parseSky((data.current.weather || [])[0].description), text: (data.current.weather || [])[0].main },
                rain: data.current.rain ? data.current.rain['1h'] : 0,
                humidity: data.current.humidity,
                windSpeed: data.current.wind_speed,
                windDirection: data.current.wind_deg,
                sunrise: getFormattedTime((data.daily || [])[0].sunrise),
                sunset: getFormattedTime((data.daily || [])[0].sunset)
            };


            let dailyAux: { [key: string]: any } = {};
            data.daily?.forEach((i: any) => {
                [
                    ['min', 'temp', 'min'],
                    ['max', 'temp', 'max'],
                    ['pop', 'pop']
                ].forEach((param: string[]) => {
                    if (!dailyAux[getFormattedDate(i.dt)]) { dailyAux[getFormattedDate(i.dt)] = {} }
                    dailyAux[getFormattedDate(i.dt)][param[0]] = Math.round((param[2])
                        ? +i[param[1]][param[2]] : +i[param[1]] * 100);
                });
            })
            weather.daily = dailyAux;

            let hourlyAux: { [key: string]: any } = {};

            data.hourly?.forEach((h: any, index: number) => {
                const day = getFormattedTime(h.dt).split(':')[0];
                hourlyAux[day] = {};
                hourlyAux[day].temp = Math.round(+h.temp);
                hourlyAux[day].pop = Math.round(+h.pop * 100);
            });
            weather.hourly = hourlyAux;

            console.log(weather);
            await Storage.set({
                key: "data",
                value: JSON.stringify(weather),
            });
            return setWeatherData(weather);
        } else {
            return handleError('Error en la consulta');
        }
    }
}