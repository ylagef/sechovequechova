import Current from "./Current";
import Daily from "./Daily";
import Hourly from "./Hourly";

export default interface Weather {
    id?: string;

    city?: string;

    daily?: { [key: string]: Daily };

    hourly?: { [key: string]: Hourly };

    current?: Current;

    updated?: Date;
}