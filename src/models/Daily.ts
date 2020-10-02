import { Origen } from "./Origen";
import { Prediccion } from "./Prediccion";


export default interface Daily {
    origen?: Origen;
    elaborado?: string;
    nombre?: string;
    provincia?: string;
    prediccion?: Prediccion;
    id?: number;
    version?: number;
}
