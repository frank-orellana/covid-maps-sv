export interface CasosDiarios  {
  id: number;
  id_municipio: number;
  fecha: string;
  casos: number;
  casos_diarios: number;
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
  numCasosX100000: number;
  departamento: Departamento;
}

export interface MunicipioJson {
  id: number;
  codigo: string;
  nombre: string;
  nombre_simple: string;
  poblacion: number;
}

export interface Departamento {
  id: number;
  codigo: string;
  nombre: string;
  poblacion: number;
  municipios: Municipio[];
}