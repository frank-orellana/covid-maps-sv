<template>
  <div class="home">
  	<div class="grid-graficos">
			<GraficoCasosDiarios style="grid-area:a" tipoCasos='0'/>
			<GraficoCasosDiarios style="grid-area:b" tipoCasos='2' mostrarPromedioChk="true"/>
			<GraficoCasosDiarios style="grid-area:c" tipoCasos='1' mostrarPromedioVar="true" mostrarPromedioChk="true"/>
			<chart type="line" style="grid-area:d" :labels="deathLabels" :datasets="deathDS" :options="deathOptions" height="400px" />
			<GraficoResumenDiario style="grid-area:e" />
  	</div>
		<Footer />
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import Component from 'vue-class-component'
import Footer from '@/components/Footer.vue'
import GraficoResumenDiario from '@/components/GraficoResumenDiario.vue'
import GraficoCasosDiarios from '@/components/GraficoCasosDiarios.vue'
import { obtenerJson, sleep } from '../tools/tools';
import { CasosDiarios } from '@/model/geo';
import store from '@/tools/store'
import Chart, { ChartDataSets, ChartOptions } from 'charts.vue2';
import { MyDataset } from '@/tools/graphs_tools';

@Component({
	name: 'Gráficos',
	components: {Footer, GraficoResumenDiario, GraficoCasosDiarios, Chart}
})
export default class Graficos extends Vue {
	store = store;

	deathLabels = ['Cargando...'];
  deathDS : ChartDataSets[] = [{
    label: 'Cargando casos...',
    backgroundColor: '#f87979',
    data: [0]
	}];
	deathOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales : {
			yAxes : [{ticks:{min: 0}}],
			xAxes : [{scaleLabel: {labelString : 'Fuente: https://ourworldindata.org/', display: true, fontSize : 10}}]
    },
    title: {text:'Cargando casos...',position:'top',display:true,fontSize:20},
    legend: {
      position:'bottom',
      labels: {fontColor: '#2c3e50'}
    }
  }
	
	async init(){
		const fechasCasos = await store.getFechasCasos();
		const casosDiarios = await store.obtenerCasosDiarios(fechasCasos[fechasCasos.length - 1],'reload');

		const histCasosMuni =  [];
		const params = {method:'get', mode: 'cors', cache: 'reload'} as RequestInit;
		for(let i = 0; i < 8; i++){
			histCasosMuni.push(store.getHistCasosDiariosMunicipio(casosDiarios[i].id_municipio));
		}

		await Promise.all(histCasosMuni);
		console.log('prefetch completed...')

		const muertes = await store.getMuertes();

		if(this.deathOptions.title)
			this.deathOptions.title.text = 'Muertes totales El Salvador'
		this.deathLabels = muertes.map(x => x.date);

		let ds = new MyDataset('Muertes totales acumuladas',muertes.map(x => x.total_deaths),'red');
		ds.borderWidth = 1.5;
		this.deathDS = [ds];
	}

	created(){
		this.init().catch(err => console.log(err));
	}
}
</script>

<style scoped>
.copy {
  font-size: x-small;
}
.grid-graficos {
	display: grid;
	grid-template:
		"a a" 550px
		"b c"
		"d e" /
		50% 50%;
	padding-top: 50px;
}

@media (max-width: 600px){
	.grid-graficos {
		grid-template: 
		"a"
		"b"
		"c"
		"d"
		"e" /
		auto;
	}
}
</style>