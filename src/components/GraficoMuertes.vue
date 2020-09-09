<template>
	<div>
    <chart :type="tipoGrafico" :labels="labels" :datasets="dataset" :options="options" height="400px" />
    <div v-if="mostrarPromedioChk">
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
import store from '@/tools/store'



@Component({
  components: {Chart}
})
export default class GraficoCasosDiarios extends Vue {
  @Prop({default:'line'}) tipoGrafico! : string;
  fechasCasos : string[] = [];
  @Prop() tipoCasos!: tipo_casos_diarios;
  @Prop({default : false}) mostrarPromedioChk!: boolean;
  @Prop({default : false}) mostrarPromedioVar!: boolean;
  store = store;
 
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
      yAxes : [{ticks:{min: 0}}],
			xAxes : [{scaleLabel: {labelString : 'Fuente: https://ourworldindata.org/', display: true, fontSize : 10}}]
    },
    title: {text:'Cargando casos...',position:'top',display:true,fontSize:20},
    legend: {
      position:'bottom',
      labels: {
        fontColor: '#2c3e50'
      }
    }
  }

  @Watch('store')
  async watchStore() : Promise<void> {
    console.log('Store changed')
    await this.init();
  }

  @Watch('mostrarPromedioVar')
  async watchMostrarPromedioVar() : Promise<void> {
    console.log('mostrarPromedioVar changed')
    await this.init();
  } 

  async init(){

    const muertes = await store.getMuertes();

		if(this.options.title)
			this.options.title.text = 'Muertes totales El Salvador'
		this.labels = muertes.map(x => x.date);

		let ds1 = new MyDataset('Muertes totales acumuladas',muertes.map(x => x.total_deaths),'red');
    ds1.borderWidth = 2;
    ds1.pointRadius = 1;
    
    let ds2 = new MyDataset('Muertes diarias', muertes.map(x => x.new_deaths), 'darkblue')
    ds2.type = 'bar';
    this.dataset = [ds1, ds2];
  }

  mounted() : any{
    this.init().catch(err => console.error(err));
  }
}
</script>