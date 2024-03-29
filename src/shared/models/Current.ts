export default interface Current {
    temp?: number;
    feelsLike?: number;
    min?: number;
    max?: number;

    sky?: { icon: string; text: string; };

    rain?: number;

    humidity?: number;

    pressure?: number;

    windSpeed?: number;
    windDirection?: number;

    sunrise?: string;
    sunset?: string;
}