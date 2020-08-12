import Chart, {ChartData, ChartDataSets, ChartConfiguration, ChartOptions} from 'charts.vue2';
import { CasosDiarios, Municipio } from '@/model/geo';
import { obtenerJson } from './tools';
import { getMunicipios } from './municipios';

export class MyDataset implements ChartDataSets{
  constructor(label:string,data:Array<number|null>,color:string){
    this.label=label;
    this.data=data;
    this.backgroundColor= color;
    this.pointBackgroundColor = color;
    this.pointBorderColor = color;
    this.borderColor = color;
  }

  label = 'N/A';
  data : Array<number|null>;
  backgroundColor =  '#2c3e50';
  fill = false;
  borderWidth = 1;
  pointRadius = 0.25;
  pointBackgroundColor = 'red';
  pointBorderColor = 'red';
  borderColor = 'red';
  pointBorderWidth = 0;
  type! : string;
  hideInLegendAndTooltip!: boolean;
}

export async function obtenerCasosDiarios(fecString: string, cache : RequestInit["cache"] = 'default'): Promise<CasosDiarios[]>{
  //const casos = this.listaCasosDiariosFecha.get(fecString);
  //if(casos != undefined) return casos;
  const municipios = await getMunicipios();

  let casos2: CasosDiarios[] = (await obtenerJson("/casos_diarios/"+ fecString,{method:'get', mode: "cors", cache: cache})) || [];
  casos2 = casos2.map(c => ({
    id: c.id,
    id_municipio: c.id_municipio,
    fecha: c.fecha,
    casos: c.casos,
    casos_diarios: c.casos_diarios,
    casos_15d: c.casos_15d,
    municipio: municipios.get(c.id_municipio) as Municipio
  }));
  //this.listaCasosDiariosFecha.set(fecString,casos2);
  return casos2;
}

export function fixFechas(datos:Array<number|undefined>, fechas:Array<string>){
  while(datos.length < fechas.length){
    datos.unshift(undefined);
  }
}

export function movingAvg(array: Array<number | null>, countBefore: number, countAfter: number) {
  if (countAfter == undefined) countAfter = 1; else countAfter++;
  const result = new Array<number | null>(array.length);
  for (let i = 0; i < array.length; i++) {
    const subArr = array.slice(Math.max(i - countBefore, 0), Math.min(i + countAfter + 1, array.length));
    ///@ts-ignore
    result[i] = subArr.reduce((a, b) => isNaN(b) ? a : a + b, 0) / subArr.length;
  }
  return result;
}