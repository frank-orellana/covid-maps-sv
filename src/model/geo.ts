export interface Casos {
  id: number;
  casos: number;
  municipio: MunicipioJson;
}

export interface Municipio {
  id: number;
  codigo: string;
  nombre: string;
  nombre_simple: string;
  poblacion: number;
  elements: HTMLCollectionOf<SVGPathElement>;
  numCasos: number;
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