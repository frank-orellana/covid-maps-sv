import {ChartDataSets} from 'charts.vue2';

export class MyDataset implements ChartDataSets{
  constructor(label:string,data:Array<number|undefined|null>,color:string,type?:string){
    this.label=label;
    this.data=data;
    this.backgroundColor= color;
    this.pointBackgroundColor = color;
    this.pointBorderColor = color;
    this.borderColor = color;
    this.type = type;
  }

  label = 'N/A';
  data : Array<number|undefined|null>;
  backgroundColor =  '#2c3e50';
  fill = false;
  borderWidth = 1;
  pointRadius = 0.25;
  pointBackgroundColor = 'red';
  pointBorderColor = 'red';
  borderColor = 'red';
  pointBorderWidth = 0;
  type! : string | undefined;
  hideInLegendAndTooltip!: boolean;
}

export function fixFechas(datos:Array<number|undefined|null>, fechas:Array<string>){
  while(datos.length < fechas.length){
    datos.unshift(undefined);
  }
  return datos;
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