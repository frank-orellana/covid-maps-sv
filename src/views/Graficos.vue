<template>
  <div class="home">
  	<div class="grid-graficos">
			<GraficoCasosDiarios tipoCasos='0'/>
			<GraficoCasosDiarios tipoCasos='2' mostrarPromedioChk="true"/>
			<GraficoCasosDiarios tipoCasos='1' mostrarPromedioVar="true" mostrarPromedioChk="true"/>
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
import store from '@/tools/store'

@Component({
	name: 'Gráficos',
	components: {Footer, GraficoResumenDiario, GraficoCasosDiarios}
})
export default class Graficos extends Vue {
	store = store;
	
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
	grid-template-columns:  50%  50%;
	padding-top: 80px;
}

@media (max-width: 600px){
	.grid-graficos {
		grid-template-columns: auto;
	}
}
</style>