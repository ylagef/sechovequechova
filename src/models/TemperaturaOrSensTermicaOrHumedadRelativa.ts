import { DatoEntity } from "./DatoEntity";

export interface TemperaturaOrSensTermicaOrHumedadRelativa {
    maxima: number;
    minima: number;
    dato?: (DatoEntity | null)[] | null;
}

