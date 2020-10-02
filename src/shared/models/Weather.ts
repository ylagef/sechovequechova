import Current from "./Current";
import Daily from "./Daily";
import Hourly from "./Hourly";

export default interface Weather {
    city?: string;

    daily?: Daily[];

    hourly?: Hourly[];

    current?: Current;

    updated?: Date;
}