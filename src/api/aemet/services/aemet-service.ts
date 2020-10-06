import Weather from "../../../shared/models/Weather";
import AemetDaily from "../models/aemet-daily";
import AemetHourly from "../models/aemet-hourly";
import axios from 'axios';
import { Plugins } from "@capacitor/core";
import Hourly from "../../../shared/models/Hourly";
import City from "../../../shared/models/City";
const { Storage } = Plugins;

const apiKey = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5bGFnZWZAZ21haWwuY29tIiwianRpIjoiZWFlZWNmODMtZDA2NS00MGQ5LWEwNTktZjIyMjg5MDJjNjMzIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE2MDE2Mjk3MzEsInVzZXJJZCI6ImVhZWVjZjgzLWQwNjUtNDBkOS1hMDU5LWYyMjI4OTAyYzYzMyIsInJvbGUiOiIifQ.izyvn53NgERnzvtGXdv9JR6S_6sbgDOf1D68S6S6Vm0";

async function getHourly(id: string): Promise<any> {
    const url = (await Storage.get({
        key: `hourly_${id}`,
    })).value;

    if (url) {
        console.log('url from cache', url);
        return getHourlyData(url, id);
    } else {
        return axios({
            url: `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/${id}?api_key=${apiKey}`,
            method: 'get'
        }).then(async response => {
            if (response.data.estado === 200) {
                console.log('save url on cache', response.data.datos);
                await Storage.set({
                    key: `hourly_${id}`,
                    value: response.data.datos
                });
                return getHourlyData(response.data.datos, id);
            } else {
                await Storage.remove({
                    key: `hourly_${id}`
                });
                return Promise.resolve(null);
            }
        }).catch(e => {
            console.error('getHourlyData - ' + e);
            return Promise.resolve(null);
        });
    }
};

function getHourlyData(url: string, id: string) {
    return axios({
        url: `${url}`,
        method: 'get'
    }).then(async response => {
        if (response.data.estado === 404) {
            // Error on query
            await Storage.remove({
                key: `hourly_${id}`,
            });

            return getHourly(id);
        } else {
            return response.data[0] as AemetHourly;
        }
    }).catch(e => {
        console.error('getHourlyData - ' + e);
        return Promise.resolve(null);
    });
}

async function getDaily(id: string): Promise<any> {
    const url = (await Storage.get({
        key: `daily_${id}`,
    })).value;

    if (url) {
        console.log('url from cache', url);
        return getDailyData(url, id);
    } else {
        return axios({
            url: `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${id}?api_key=${apiKey}`,
            method: 'get'
        }).then(async response => {
            if (response.data.estado === 200) {
                console.log('save url on cache', response.data.datos);
                await Storage.set({
                    key: `daily_${id}`,
                    value: response.data.datos
                });
                return getDailyData(response.data.datos, id);
            } else {
                await Storage.remove({
                    key: `daily_${id}`,
                });
                return Promise.resolve(null);
            }
        }).catch(e => {
            console.error('getDaily - ' + e);
            return Promise.resolve(null);
        });
    }
};

function getDailyData(url: string, id: string) {
    return axios({
        url: `${url}`,
        method: 'get'
    }).then(async response => {
        if (response.data.estado === 404) {
            // Error on query
            await Storage.remove({
                key: `daily_${id}`,
            });

            return getDaily(id);
        } else {
            return response.data[0] as AemetDaily;
        }
    }).catch(e => {
        console.error('getDailyData - ' + e);
        return Promise.resolve(null);
    });
}

function getDataByDate(data: any, date: string, param: string, periodo?: string): any {
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
    if (sky.toLowerCase().includes('lluvia')) {
        return 'rain';
    } else if (sky.toLowerCase().includes('nuboso') || sky.toLowerCase().includes('cubierto')) {
        return 'cloud';
    } else {
        return 'clear';
    }
}

export async function aemetGetWeatherData(city: any, setWeatherData: any, handleError: any): Promise<any> {
    const [daily, hourly] = await Promise.all([getDaily(city.id), getHourly(city.id)]);

    if (daily && hourly) {
        let weather: Weather = {};
        weather.city = city;

        const date = new Date();
        const currentDate = date.getFullYear() + '-' + ((date.getMonth() + 1) <= 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + (date.getDate() <= 9 ? '0' + date.getDate() : date.getDate());
        const currentPeriod = (new Date().getHours() <= 9) ? '0' + new Date().getHours() : '' + new Date().getHours();
        weather.current = {
            temp: +getDataByDate(hourly, currentDate, 'temperatura', currentPeriod).value,
            feelsLike: +getDataByDate(hourly, currentDate, 'sensTermica', currentPeriod).value,
            min: getMinValue(hourly, currentDate, 'temperatura'),
            max: getMaxValue(hourly, currentDate, 'temperatura'),
            sky: { icon: parseSky(getDataByDate(hourly, currentDate, 'estadoCielo', currentPeriod).descripcion), text: getDataByDate(hourly, currentDate, 'estadoCielo', currentPeriod).descripcion },
            rain: +getDataByDate(hourly, currentDate, 'precipitacion', currentPeriod).value,
            humidity: +getDataByDate(hourly, currentDate, 'humedadRelativa', currentPeriod).value,
            windSpeed: +getDataByDate(hourly, currentDate, 'vientoAndRachaMax', currentPeriod).velocidad[0],
            windDirection: getDataByDate(hourly, currentDate, 'vientoAndRachaMax', currentPeriod).direccion[0],
            sunrise: getDataByDate(hourly, currentDate, 'orto'),
            sunset: getDataByDate(hourly, currentDate, 'ocaso'),
        };

        weather.updated = new Date(daily.elaborado);

        let dailyAux: { [key: string]: any } = {};
        [0, 1, 2, 3, 4, 5, 6].forEach(i => {
            const formatedDay = daily.prediccion.dia[i].fecha.split('-')[2].split('T')[0] + '/' + daily.prediccion.dia[i].fecha.split('-')[1];

            [
                ['temperatura', 'max', 'maxima', 'value'],
                ['temperatura', 'min', 'minima', 'value'],
                ['probPrecipitacion', 'pop', 'value', 'avg']
            ].forEach((param: string[]) => {
                if (!dailyAux[formatedDay]) { dailyAux[formatedDay] = {} }
                dailyAux[formatedDay][param[1]] = (param[3] && param[3] === 'value') ? +daily.prediccion.dia[i][param[0]][param[2]] : Math.round(getAvg(daily.prediccion.dia[i], param[0], param[2]));
            });
        })
        weather.daily = dailyAux;

        let hourlyAux: { [key: string]: any } = {};
        const indexToday = hourly.prediccion.dia.findIndex((d: any) => new Date(d.fecha).getDate() === new Date().getDate());
        [indexToday, indexToday + 1].forEach(i => {
            [
                ['temperatura', 'temp', 'value'],
                ['precipitacion', 'rain', 'value'],
                ['probPrecipitacion', 'pop', 'value']
            ].forEach((param: string[]) => {
                hourly.prediccion.dia[i][param[0]].forEach((item: any) => {
                    if ((item.periodo.length === 2) && Object.keys(hourlyAux).length < 10
                        && ((i === indexToday && +item.periodo >= new Date().getHours())
                            || (i === (indexToday + 1) && +item.periodo < new Date().getHours()))) {
                        if (!hourlyAux[item.periodo]) { hourlyAux[item.periodo] = {} }
                        hourlyAux[item.periodo][param[1]] = +item[param[2]];
                    }
                });
            });
        })
        weather.hourly = hourlyAux;

        console.log(weather);
        return setWeatherData(weather);
    } else {
        return handleError('Error en la consulta');
    }
}