
import { CotaNieveProvEntityOrRachaMaxEntity } from "./CotaNieveProvEntityOrRachaMaxEntity";
import { EstadoCieloEntity } from "./EstadoCieloEntity";
import { PrecipitacionEntityOrProbPrecipitacionEntityOrProbTormentaEntityOrNieveEntityOrProbNieveEntityOrTemperaturaEntityOrSensTermicaEntityOrHumedadRelativaEntity } from "./PrecipitacionEntityOrProbPrecipitacionEntityOrProbTormentaEntityOrNieveEntityOrProbNieveEntityOrTemperaturaEntityOrSensTermicaEntityOrHumedadRelativaEntity";
import { ProbPrecipitacionEntity } from "./ProbPrecipitacionEntity";
import { TemperaturaOrSensTermicaOrHumedadRelativa } from "./TemperaturaOrSensTermicaOrHumedadRelativa";
import { VientoAndRachaMaxEntity } from "./VientoAndRachaMaxEntity";
import { VientoEntity } from "./VientoEntity";

export interface DiaEntity {
    probPrecipitacion?: (ProbPrecipitacionEntity)[] | null;
    cotaNieveProv?: (CotaNieveProvEntityOrRachaMaxEntity)[] | null;
    estadoCielo?: (EstadoCieloEntity)[] | null;
    viento?: (VientoEntity)[] | null;
    rachaMax?: (CotaNieveProvEntityOrRachaMaxEntity)[] | null;
    temperatura: TemperaturaOrSensTermicaOrHumedadRelativa;
    sensTermica: TemperaturaOrSensTermicaOrHumedadRelativa;
    humedadRelativa: TemperaturaOrSensTermicaOrHumedadRelativa;
    uvMax?: number | null;
    fecha: string;


    precipitacion?: (PrecipitacionEntityOrProbPrecipitacionEntityOrProbTormentaEntityOrNieveEntityOrProbNieveEntityOrTemperaturaEntityOrSensTermicaEntityOrHumedadRelativaEntity)[] | null;
    probTormenta?: (PrecipitacionEntityOrProbPrecipitacionEntityOrProbTormentaEntityOrNieveEntityOrProbNieveEntityOrTemperaturaEntityOrSensTermicaEntityOrHumedadRelativaEntity)[] | null;
    nieve?: (PrecipitacionEntityOrProbPrecipitacionEntityOrProbTormentaEntityOrNieveEntityOrProbNieveEntityOrTemperaturaEntityOrSensTermicaEntityOrHumedadRelativaEntity)[] | null;
    probNieve?: (PrecipitacionEntityOrProbPrecipitacionEntityOrProbTormentaEntityOrNieveEntityOrProbNieveEntityOrTemperaturaEntityOrSensTermicaEntityOrHumedadRelativaEntity)[] | null;
    vientoAndRachaMax?: (VientoAndRachaMaxEntity)[] | null;
    orto: string;
    ocaso: string;
}