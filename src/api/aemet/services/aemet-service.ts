import Weather from "../../../shared/models/Weather";
import AemetDaily from "../models/aemet-daily";
import AemetHourly from "../models/aemet-hourly";
import dailyMock from "../static/daily-mock";
import hourlyMock from "../static/hourly-mock";
import axios from 'axios';
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

const apiKey = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5bGFnZWZAZ21haWwuY29tIiwianRpIjoiZWFlZWNmODMtZDA2NS00MGQ5LWEwNTktZjIyMjg5MDJjNjMzIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE2MDE2Mjk3MzEsInVzZXJJZCI6ImVhZWVjZjgzLWQwNjUtNDBkOS1hMDU5LWYyMjI4OTAyYzYzMyIsInJvbGUiOiIifQ.izyvn53NgERnzvtGXdv9JR6S_6sbgDOf1D68S6S6Vm0";

async function getHourly(id: string): Promise<any> {
    const url = (await Storage.get({
        key: `hourly_${id}`,
    })).value;

    if (url) {
        console.log('url from cache', url);
        return getHourlyData(url);
    } else {
        return axios({
            url: `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/${id}?api_key=${apiKey}`,
            method: 'get'
        }).then(async response => {
            // console.log(response);
            console.log('save url on cache', response.data.datos);
            await Storage.set({
                key: `hourly_${id}`,
                value: response.data.datos
            });
            console.log('url!', response.data.datos);
            return getHourlyData(response.data.datos);
        });
    }
};

function getHourlyData(url: string) {
    return axios({
        url: `${url}`,
        method: 'get'
    }).then(response => {
        // console.log(response);
        return response.data[0] as AemetHourly;
    });
}

async function getDaily(id: string): Promise<any> {
    const url = (await Storage.get({
        key: `daily_${id}`,
    })).value;

    if (url) {
        console.log('url from cache', url);
        return getDailyData(url);
    } else {
        return axios({
            url: `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${id}?api_key=${apiKey}`,
            method: 'get'
        }).then(async response => {
            // console.log(response);
            console.log('save url on cache', response.data.datos);
            await Storage.set({
                key: `daily_${id}`,
                value: response.data.datos
            });
            console.log('url!', response.data.datos);
            return getDailyData(response.data.datos);
        });
    }
};

function getDailyData(url: string) {
    return axios({
        url: `${url}`,
        method: 'get'
    }).then(response => {
        // console.log(response);
        return response.data[0] as AemetDaily;
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
        .find((d: any) => d.fecha.includes(date))[param].map(
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
        .find((d: any) => d.fecha.includes(date))[param].map(
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
    day[param].map(
        (v: any, _: any) => {
            total += +v[param2];
            amount++;
        });

    return total / amount;
};

export async function getWeatherData(id: any, setWeatherData: any): Promise<any> {
    // const daily: AemetDaily = dailyMock[0];
    // const hourly: AemetHourly = hourlyMock[0];
    const daily: AemetDaily = await getDaily(id);
    const hourly: AemetHourly = await getHourly(id);

    console.log('d', daily);
    console.log('h', hourly);

    let weather: Weather = {};
    weather.city = daily.nombre;

    const date = new Date();
    const currentDate = date.getFullYear() + '-' + ((date.getMonth() + 1) <= 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + (date.getDate() <= 9 ? '0' + date.getDate() : date.getDate());
    const currentPeriod = (new Date().getHours() <= 9) ? '0' + new Date().getHours() : '' + new Date().getHours();
    weather.current = {
        temperature: +getDataByDate(hourly, currentDate, 'temperatura', currentPeriod).value,
        feelsLike: +getDataByDate(hourly, currentDate, 'sensTermica', currentPeriod).value,
        min: getMinValue(hourly, currentDate, 'temperatura'),
        max: getMaxValue(hourly, currentDate, 'temperatura'),
        rain: +getDataByDate(hourly, currentDate, 'precipitacion', currentPeriod).value,
        humidity: +getDataByDate(hourly, currentDate, 'humedadRelativa', currentPeriod).value,
        windSpeed: +getDataByDate(hourly, currentDate, 'vientoAndRachaMax', currentPeriod).velocidad[0],
        windDirection: getDataByDate(hourly, currentDate, 'vientoAndRachaMax', currentPeriod).direccion[0],
        sunrise: getDataByDate(hourly, currentDate, 'orto'),
        sunset: getDataByDate(hourly, currentDate, 'ocaso'),
    };

    weather.updated = new Date(daily.elaborado);

    weather.daily = [];
    daily.prediccion.dia.forEach((day) => {
        weather.daily?.push({
            min: day.temperatura.minima,
            max: day.temperatura.maxima,
            rain: getAvg(day, 'probPrecipitacion', 'value'),
            humidity: (day.humedadRelativa.minima + day.humedadRelativa.maxima) / 2,
            windSpeed: getAvg(day, 'viento', 'velocidad'),
        });
    });

    weather.hourly = [];
    hourly.prediccion.dia.forEach((day) => {
        // // console.log(day);
        // weather.daily?.push({
        //     min: day.temperatura.minima,
        //     max: day.temperatura.maxima,
        //     rain: getAvg(day, 'probPrecipitacion', 'value'),
        //     humidity: (day.humedadRelativa.minima + day.humedadRelativa.maxima) / 2,
        //     windSpeed: getAvg(day, 'viento', 'velocidad'),
        // });
    });

    // console.log(weather);
    return setWeatherData(weather);
}