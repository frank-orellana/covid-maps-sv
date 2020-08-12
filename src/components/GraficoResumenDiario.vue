<template>
  <div>
    <MyChart :type="tipoGrafico" :labels="labels" :datasets="dataset" :options="options" :height="height" />
    <div>tipo de gráfico <input type="radio" value="bar" v-model="tipoGrafico"> barras <input type="radio" value="line" v-model="tipoGrafico"> linea</div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator';
import { ChartConfiguration, ChartOptions} from 'chart.js'
import { obtenerJson, sleep } from '../tools/tools';

//import MyChart, {ChartData, ChartDataSets} from '@/components/MyCharts.vue';
import MyChart, {ChartData, ChartDataSets} from 'charts.vue2';

@Component({
  components: {MyChart}
})
export default class GraficoResumenDiario extends Vue {
  tipoGrafico : string = 'bar';
  height : string = '400px';

  labels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  dataset : ChartDataSets[] = [{
    label: 'Casos promedio por día',
    backgroundColor: '#f87979',
    data: [1,2,3]
  }];

  options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    /*scales : {
      yAxes : [{ticks:{min: 0, suggestedMin: 100}}]
    },*/
    title: {text:'Cargando casos...',position:'top',display:true,fontSize:18},
    legend : {
      position : 'bottom'
    }
  }

  async init(){
    const casosPromedio = await obtenerJson('/promedio_casos_diarios',{method:'get', mode: 'cors'}) as Array<any>;
    if(casosPromedio == undefined) return;

    const datos = casosPromedio.map(v => v.promedio.toFixed(2)) as Array<number>;
    console.log(this.dataset[0].data);
    this.dataset = [{
      label: 'Casos promedio por día',
      backgroundColor: '#2c3e50',
      data: datos
    }];

    if(this.options.title)  this.options.title.text = 'Promedio de casos diarios';
  }

  mounted() : any{
    this.init().catch(err => console.error(err));
  }
}
</script>
<style scoped>

</style>