export default interface AemetDaily {
    origen?: Origen;
    elaborado?: string;
    nombre?: string;
    provincia?: string;
    prediccion?: Prediccion;
    id?: number;
    version?: number;
}

interface Prediccion {
    dia: Dia[];
}

interface Dia {
    probPrecipitacion: ProbPrecipitacion[];
    cotaNieveProv: CotaNieveProv[];
    estadoCielo: EstadoCielo[];
    viento: Viento[];
    rachaMax: CotaNieveProv[];
    temperatura: Temperatura;
    sensTermica: Temperatura;
    humedadRelativa: Temperatura;
    uvMax?: number;
    fecha: string;
}

interface Temperatura {
    maxima: number;
    minima: number;
    dato: Dato[];
}

interface Dato {
    value: number;
    hora: number;
}

interface Viento {
    direccion: string;
    velocidad: number;
    periodo?: string;
}

interface EstadoCielo {
    value: string;
    periodo?: string;
    descripcion: string;
}

interface CotaNieveProv {
    value: string;
    periodo?: string;
}

interface ProbPrecipitacion {
    value: number;
    periodo?: string;
}

interface Origen {
    productor: string;
    web: string;
    enlace: string;
    language: string;
    copyright: string;
    notaLegal: string;
}