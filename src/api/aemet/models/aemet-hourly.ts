export default interface AemetHourly {
    origen?: Origen;
    elaborado?: string;
    nombre?: string;
    provincia?: string;
    prediccion?: Prediccion;
    id?: string;
    version?: string;
}

interface Prediccion {
    dia: Dia[];
}

interface Dia {
    estadoCielo: EstadoCielo[];
    precipitacion: PeriodoValue[];
    probPrecipitacion: PeriodoValue[];
    probTormenta: PeriodoValue[];
    nieve: PeriodoValue[];
    probNieve: PeriodoValue[];
    temperatura: PeriodoValue[];
    sensTermica: PeriodoValue[];
    humedadRelativa: PeriodoValue[];
    vientoAndRachaMax: VientoAndRachaMax[];
    fecha: string;
    orto: string;
    ocaso: string;
}

interface VientoAndRachaMax {
    direccion?: string[];
    velocidad?: string[];
    periodo: string;
    value?: string;
}

interface PeriodoValue {
    value: string;
    periodo: string;
}

interface EstadoCielo {
    value: string;
    periodo: string;
    descripcion: string;
}

interface Origen {
    productor: string;
    web: string;
    enlace: string;
    language: string;
    copyright: string;
    notaLegal: string;
}