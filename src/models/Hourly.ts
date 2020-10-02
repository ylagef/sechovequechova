import { Origen } from "./Origen";
import { Prediccion } from "./Prediccion";

export default interface Hourly {
    origen?: Origen;
    elaborado?: string;
    nombre?: string;
    provincia?: string;
    prediccion?: Prediccion;
    id?: string;
    version?: string;
}
