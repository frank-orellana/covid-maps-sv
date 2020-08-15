<template>
  <div class="home">
  	<div class="grid-graficos">
			<div style="grid-area:a">Detalle de casos de {{municipio.nombre}}</div>
			<GraficoCasosDiariosMuni style="grid-area:b" :idMunicipio="idMunicipio" tipoCasos='0'/>
			<GraficoCasosDiariosMuni style="grid-area:c" :idMunicipio="idMunicipio" tipoCasos='1'/>
			<!--GraficoCasosDiarios :store="store" tipoCasos='0'/>
			<GraficoCasosDiarios :store="store" tipoCasos='2' mostrarPromedioChk="true"/>
			<GraficoCasosDiarios :store="store" tipoCasos='1' mostrarPromedioVar="true" mostrarPromedioChk="true"/>
			<GraficoResumenDiario/-->
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
import GraficoCasosDiariosMuni from '@/components/GraficoCasosDiariosMuni.vue'
import { obtenerJson, sleep } from '../tools/tools';
import { CasosDiarios, Municipio } from '@/model/geo';

import store from '@/tools/store';



@Component({
	name: 'Gráficos',
	components: {Footer, GraficoCasosDiariosMuni, GraficoResumenDiario, GraficoCasosDiarios}
})
export default class Graficos extends Vue {
	idMunicipio = Number(this.$route.params.id_muni);
	municipio : Municipio | {} = {};
	
	async init(){
		const fechasCasos = await store.getFechasCasos();
		const casosDiarios = await store.obtenerCasosDiarios(fechasCasos[fechasCasos.length - 1],'reload');
		console.log('casosDiarios',casosDiarios);
		//casosDiarios.sort((a,b) => a.casos > b.casos ? -1 : 1);

		const histCasosMuni =  [];
		const params = {method:'get', mode: 'cors', cache: 'reload'} as RequestInit;
		//for(let i = 0; i < 8; i++){
			histCasosMuni.push(store.getHistCasosDiariosMunicipio(this.idMunicipio));
		//}

		const histCasos = await Promise.all(histCasosMuni);

		//store.dummy++;

		this.municipio = (await store.getMunicipios()).get(this.idMunicipio) || {};
	}

	beforeMount(){
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
	"a a" 
	"b c" /
	50% 50%;
	padding-top: 80px;
}

@media (max-width: 600px){
	.grid-graficos {
		grid-template: 
			"a"
			"b"
			"c"
			/ 100%
		;
	}
}
</style>