<template>
	<div>
    <chart :type="tipoGrafico" :labels="labels" :datasets="dataset" :options="options" height="550px" />
    <div v-if="mostrarPromedioChk">
      <!--tipo de gráfico <input type="radio" value="bar" v-model="tipoGrafico">barras <input type="radio" value="line" v-model="tipoGrafico"> linea-->
      <input type="checkbox" v-model="mostrarPromedioVar"> Promedio móvil 7 días 
    </div>
    
	</div>	
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator';
import { obtenerJson, tipo_casos_diarios } from '../tools/tools';

import Chart, {ChartData, ChartDataSets, ChartConfiguration, ChartOptions} from 'charts.vue2';
import { CasosDiarios } from '../model/geo';
import { fixFechas, MyDataset, movingAvg } from '../tools/graphs_tools'

import store from '@/tools/store';

@Component({
  components: {Chart}
})
export default class GraficoCasosDiarios extends Vue {
  @Prop({default:'line'}) tipoGrafico! : string;
  fechasCasos : string[] = [];
  @Prop() tipoCasos!: tipo_casos_diarios;
  @Prop({default : false}) mostrarPromedioChk!: boolean;
  @Prop({default : false}) mostrarPromedioVar!: boolean;
  @Prop() idMunicipio!: number;

  store = store;

  @Watch('store',{deep:true})
  async watchStore() : Promise<void> {
    console.log('Store changed')
    await this.init();
  }
 
  labels = ['Cargando...'];
  dataset : ChartDataSets[] = [{
    label: 'Cargando casos...',
    backgroundColor: '#f87979',
    data: [0]
  }];

  options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales : {
      yAxes : [{ticks:{min: 0}}]
    },
    title: {text:'Cargando casos...',position:'top',display:true,fontSize:20},
    legend: {
      position:'bottom',
      labels: {
        fontColor: '#2c3e50'
      }
    }
  }

  @Watch('mostrarPromedioVar')
  async watchMostrarPromedioVar() : Promise<void> {
    console.log('mostrarPromedioVar changed')
    await this.init();
  } 

  async init(){
    console.log('store',store);

    this.fechasCasos = await store.getFechasCasos();
    if(!this.fechasCasos || this.fechasCasos.length == 0) return;

    const casos_diarios = await store.obtenerCasosDiarios(this.fechasCasos[this.fechasCasos.length - 1]) // await obtenerCasosDiarios(this.fechasCasos[this.fechasCasos.length - 1],'reload');
    if(casos_diarios.length == 0){
      console.warn('No se pudo obtener los casos diarios de la fecha', this.fechasCasos[this.fechasCasos.length - 1],this.fechasCasos.length - 1);
      return;
    }

    const colores = ['red','yellow','orange','blue','cyan','green', 'pink','silver','fucsia']

    const ds = [];
    const histCasosDiariosMuni = await store.getHistCasosDiariosMunicipio(this.idMunicipio);

    const casos = histCasosDiariosMuni.map(x => x.casos);
    const casos_dia = histCasosDiariosMuni.map(x => x.casos_diarios);
    const casos_dia_movingAvg = movingAvg(casos_dia,3,3);
    const casos_15d = histCasosDiariosMuni.map(x => x.casos_15d);
 
    if(this.tipoCasos == tipo_casos_diarios.acumulados){
      ds.push(new MyDataset('Casos totales acumulados',fixFechas(casos,this.fechasCasos),colores[0]));
      ds.push(new MyDataset('Casos activos aproximados (15 días)',fixFechas(casos_15d,this.fechasCasos),colores[2]));
    }else{
      ds.push(new MyDataset('Promedio móvil casos diarios',fixFechas(casos_dia_movingAvg,this.fechasCasos),colores[3]));
      ds.push(new MyDataset('Casos diarios',fixFechas(casos_dia,this.fechasCasos),'silver','bar'));
    }


    /*for(let i = 0; i < 8; i++){
      let c = await obtenerJson('/hist_casos/'+ casos_diarios[i].id_municipio,{method:'get', mode: 'cors'}) as Array<CasosDiarios>;
      let datos = c
        .sort((a,b) => a.fecha  < b.fecha ? -1 : 1)
        .map(v => {
          switch(this.tipoCasos){
            case tipo_casos_diarios.acumulados: return v.casos;
            case tipo_casos_diarios.diarios: return v.casos_diarios;
            case tipo_casos_diarios.activos: return v.casos_15d;
            default: return v.casos;
          }});
      fixFechas(datos,this.fechasCasos);

      if(!this.mostrarPromedioVar)
        ds.push(new MyDataset(casos_diarios[i].municipio.nombre,datos,colores[i]));
      else {
        const movingAvgDS = new MyDataset(casos_diarios[i].municipio.nombre,movingAvg(datos,3,3),colores[i]);
        movingAvgDS.type = 'line';
        movingAvgDS.hideInLegendAndTooltip = true;
        ds.push(movingAvgDS);
      }
    }*/

    this.labels = this.fechasCasos;
    this.dataset = ds;

    if(this.options.title)
      switch(this.tipoCasos){
        case tipo_casos_diarios.acumulados: this.options.title.text = 'Casos acumulados'; break;
        case tipo_casos_diarios.diarios:    this.options.title.text = 'Casos diarios'; break;
        case tipo_casos_diarios.activos:    this.options.title.text = 'Casos activos aproximados (15 días)'; break;
      }
  }

  mounted() : any{
    this.init().catch(err => console.error(err));
  }
}
</script>