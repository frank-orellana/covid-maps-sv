<template>
  <div class="home">
  	<div class="grid-graficos">
			<GraficoCasosDiarios :store="store" tipoCasos='0'/>
			<GraficoCasosDiarios :store="store" tipoCasos='2' mostrarPromedioChk="true"/>
			<GraficoCasosDiarios :store="store" tipoCasos='1' mostrarPromedioVar="true" mostrarPromedioChk="true"/>
			<GraficoResumenDiario/>
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
import { obtenerCasosDiarios } from '@/tools/graphs_tools';

const commonStore = { 
	fechasCasos : [] as Array<string>,
	casosDiarios : [] as Array<CasosDiarios>
}

@Component({
	name: 'Gráficos',
	components: {Footer, GraficoResumenDiario, GraficoCasosDiarios}
})
export default class Graficos extends Vue {
	store = commonStore;
	
	async init(){
		const fechasCasos = await obtenerJson("/fechas_casos");
		const casosDiarios = await obtenerCasosDiarios(fechasCasos[fechasCasos.length - 1],'reload');
		casosDiarios.sort((a,b) => a.casos > b.casos ? -1 : 1);

		const histCasosMuni =  [];
		const params = {method:'get', mode: 'cors', cache: 'reload'} as RequestInit;
		for(let i = 0; i < 8; i++){
			histCasosMuni.push(obtenerJson('/hist_casos/'+ casosDiarios[i].id_municipio, params));
		}

		await Promise.all(histCasosMuni);

		this.store = {fechasCasos,casosDiarios};
	}

	mounted(){
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
	grid-template-columns:  50%  50%;
	padding-top: 80px;
}

@media (max-width: 600px){
	.grid-graficos {
		grid-template-columns: auto;
	}
}
</style>