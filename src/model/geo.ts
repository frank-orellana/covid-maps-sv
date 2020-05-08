export interface Casos {
  id: number;
  casos: number;
  municipio: Municipio;
}

export interface Municipio {
  id: number;
  codigo: string;
  nombre: string;
  poblacion: number;
  elements: HTMLCollectionOf<SVGPathElement>;
  numCasos: number;
}

export interface Departamento {
  id: number;
  codigo: string;
  nombre: string;
  poblacion: number;
  municipios: Municipio[];
}