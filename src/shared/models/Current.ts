export default interface Current {
    temperature?: number;
    feelsLike?: number;
    min?: number;
    max?: number;

    sky?: string;

    rain?: number;

    humidity?: number;

    pressure?: number;

    windSpeed?: number;
    windDirection?: number;

    sunrise?: string;
    sunset?: string;
}