import Weather from "../../../shared/models/Weather";
import AemetDaily from "../models/aemet-daily";
import AemetHourly from "../models/aemet-hourly";
import dailyMock from "../static/daily-mock";
import hourlyMock from "../static/hourly-mock";

const headers = {
    accept: "application/json",
    api_key:
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5bGFnZWZAZ21haWwuY29tIiwianRpIjoiZWFlZWNmODMtZDA2NS00MGQ5LWEwNTktZjIyMjg5MDJjNjMzIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE2MDE2Mjk3MzEsInVzZXJJZCI6ImVhZWVjZjgzLWQwNjUtNDBkOS1hMDU5LWYyMjI4OTAyYzYzMyIsInJvbGUiOiIifQ.izyvn53NgERnzvtGXdv9JR6S_6sbgDOf1D68S6S6Vm0",
};

function getHourlyData(id: string): Promise<any> {
    return fetch(
        `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/${id}`,
        {
            headers,
        }
    )
        .then((res) => res.json())
        .then(
            (result) => {
                if (result.estado === 200) {
                    return fetch(result.datos, {
                        headers,
                    })
                        .then((res) => res.json())
                        .then(
                            (data: AemetHourly[]) => {
                                console.log("hourly", data[0]);
                                return data[0] as AemetHourly;
                            },
                            (error) => {
                                console.error(error);
                            }
                        );
                } else {
                    console.error(result.descripcion);
                }
            },
            (error) => {
                console.error("err!", error);
            }
        );
};

function getDailyData(id: string): Promise<any> {
    return fetch(
        `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${id}`,
        {
            headers,
        }
    )
        .then((res) => res.json())
        .then(
            (result) => {
                if (result.estado === 200) {
                    return fetch(result.datos, {
                        headers,
                    })
                        .then((res) => res.json())
                        .then(
                            (data: AemetDaily[]) => {
                                console.log("daily", data[0]);
                                return data[0] as AemetDaily;
                            },
                            (error) => {
                                console.error(error);
                            }
                        );
                } else {
                    console.error(result.descripcion);
                }
            },
            (error) => {
                console.error("err!", error);
            }
        );
};

function getDataByDate(data: any, date: string, param: string, periodo?: string): any {
    console.log(data, date, param, periodo);
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
    const daily: AemetDaily = await getDailyData(id);
    const hourly: AemetHourly = await getHourlyData(id);

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
        // console.log(day);
        // weather.daily?.push({
        //     min: day.temperatura.minima,
        //     max: day.temperatura.maxima,
        //     rain: getAvg(day, 'probPrecipitacion', 'value'),
        //     humidity: (day.humedadRelativa.minima + day.humedadRelativa.maxima) / 2,
        //     windSpeed: getAvg(day, 'viento', 'velocidad'),
        // });
    });

    console.log(weather);
    return setWeatherData(weather);
}