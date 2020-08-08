export interface CasosDiarios  {
  id: number;
  id_municipio: number;
  fecha: string;
  casos: number;
  casos_diarios: number;
  casos_15d: number;
  municipio: Municipio;
}

export interface Municipio {
  id: number;
  codigo: string;
  nombre: string;
  nombre_simple: string;
  poblacion: number;
  elements: HTMLCollectionOf<SVGPathElement>;
  numCasos: number;
  numCasosDia: number;
  numCasos15d: number;
  numCasosX100000: number;
  numCasosXKm2: number;
  area: number;
  departamento: Departamento;
}

export interface MunicipioJson {
  id: number;
  codigo: string;
  nombre: string;
  nombre_simple: string;
  poblacion: number;
  area: number;
}

export interface Departamento {
  id: number;
  codigo: string;
  nombre: string;
  poblacion: number;
  area: number;
  municipios: Municipio[];
}