import Weather from "../../../shared/models/Weather";
import axios from 'axios';
import { Plugins } from "@capacitor/core";
import City from "../../../shared/models/City";
import { OwmData } from "../models/owm-data";
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

function getDataByDate(data: any, date: string, param: string, periodo?: string): any {
    // console.log(data, date, param, periodo);
    return periodo ? data.prediccion.dia
        .find((d: any) => d.fecha.includes(date))[param].find(
            (p: any) => +p.periodo === +periodo
        ) : (data.prediccion.dia
            .find((d: any) => d.fecha.includes(date))[param]);
};

function getMinValue(data: any, date: string, param: string): any {
    let min = 1000;
    data.prediccion.dia
        .find((d: any) => d.fecha.includes(date))[param].forEach(
            (v: any, _: any) => {
                if (+v.value < min) {
                    min = +v.value;
                }
            });

    return min;
};

function getMaxValue(data: any, date: string, param: string): any {
    let max = 0;
    data.prediccion.dia
        .find((d: any) => d.fecha.includes(date))[param].forEach(
            (v: any, _: any) => {
                if (+v.value > max) {
                    max = +v.value;
                }
            });

    return max;
};

function getAvg(day: any, param: string, param2: string): any {
    let total = 0;
    let amount = 0;
    day[param].forEach(
        (v: any, _: any) => {
            total += +v[param2];
            amount++;
        });

    return total / amount;
};

function parseSky(sky: string): string {
    console.warn(sky);
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
    return (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) + ':' + (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes());
}

export async function owmGetWeatherData(city: any, setWeatherData: any, handleError: any): Promise<any> {
    const data = await getData(city);

    console.log('d', data);
    if (data) {
        //     console.log('dp', daily.prediccion);
        //     console.log('hp', hourly.prediccion);

        let weather: Weather = {};
        //     weather.id = id;
        weather.city = city;

        //     const date = new Date();
        //     const currentDate = date.getFullYear() + '-' + ((date.getMonth() + 1) <= 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + (date.getDate() <= 9 ? '0' + date.getDate() : date.getDate());
        //     const currentPeriod = (new Date().getHours() <= 9) ? '0' + new Date().getHours() : '' + new Date().getHours();
        weather.current = {
            temperature: data.current.temp,
            feelsLike: data.current.feels_like,
            min: (data.daily || [])[0].temp.min,
            max: (data.daily || [])[0].temp.max,
            sky: { icon: parseSky((data.current.weather || [])[0].description), text: (data.current.weather || [])[0].main },
            rain: data.current.rain['1h'],
            humidity: data.current.humidity,
            windSpeed: data.current.wind_speed,
            windDirection: data.current.wind_deg,
            sunrise: getFormattedTime((data.daily || [])[0].sunrise),
            sunset: getFormattedTime((data.daily || [])[0].sunset)
        };

        //     weather.updated = new Date(daily.elaborado);

        let dailyAux: { [key: string]: any } = {};
        //     [0, 1, 2, 3, 4, 5, 6].forEach(i => {
        //         const formatedDay = daily.prediccion.dia[i].fecha.split('-')[2].split('T')[0] + '/' + daily.prediccion.dia[i].fecha.split('-')[1];

        //         [
        //             ['temperatura', 'max', 'maxima', 'value'],
        //             ['temperatura', 'min', 'minima', 'value'],
        //             ['probPrecipitacion', 'precipitationProb', 'value', 'avg']
        //         ].forEach((param: string[]) => {
        //             if (!dailyAux[formatedDay]) { dailyAux[formatedDay] = {} }
        //             dailyAux[formatedDay][param[1]] = (param[3] && param[3] === 'value') ? +daily.prediccion.dia[i][param[0]][param[2]] : Math.round(getAvg(daily.prediccion.dia[i], param[0], param[2]));
        //         });
        //     })
        weather.daily = dailyAux;

        let hourlyAux: { [key: string]: any } = {};
        //     const indexToday = hourly.prediccion.dia.findIndex((d: any) => new Date(d.fecha).getDate() === new Date().getDate());
        //     console.warn('today', indexToday);
        //     [indexToday, indexToday + 1].forEach(i => {
        //         [
        //             ['temperatura', 'temperature', 'value'],
        //             ['precipitacion', 'precipitation', 'value'],
        //             ['probPrecipitacion', 'precipitationProb', 'value']
        //         ].forEach((param: string[]) => {
        //             hourly.prediccion.dia[i][param[0]].forEach((item: any) => {
        //                 if ((i === indexToday && +item.periodo >= new Date().getHours())
        //                     || (i === (indexToday + 1) && +item.periodo < new Date().getHours())) {
        //                     if (!hourlyAux[item.periodo]) { hourlyAux[item.periodo] = {} }
        //                     hourlyAux[item.periodo][param[1]] = +item[param[2]];
        //                 }
        //             });
        //         });
        //     })
        weather.hourly = hourlyAux;

        console.log(weather);
        return setWeatherData(weather);
    } else {
        return handleError('Error en la consulta');
    }
}