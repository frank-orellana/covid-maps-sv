<template>
  <div>
    <object id="mapa" data="./img/el_salvador.svg" type="image/svg+xml" style="width:100%"></object>
    <div
      class="copy"
    >Creador: Franklin Orellana, Tritium S.p.A. © 2020 - Fuente de datos: https://covid19.gob.sv/ (8 DE MAYO 2020 6:33 p.m)</div>
    <input type="range" min="0" :max="maxIdxFechas" value="0" class="slider" id="myRange" v-model="fechaSelIdx"> 
    {{fechaSelIdx}} {{fechaSelFormateada}}
    <table id="colorbar" width="100%">
      <tr>
        <td style="background:lightgreen; width:4%">&nbsp;</td>
        <td colspan="3" class="colorbar"></td>
      </tr>
      <tr>
        <td style="text-align:center; width:4%">0</td>
        <td style="text-align:left; width:30%">1</td>
        <td style="text-align:center; width:30%">{{Math.floor(maxVal / 2)}}</td>
        <td style="text-align:right; width:36%">{{maxVal}}</td>
      </tr>
      <tr>
        <td colspan="4" style="text-align:center;">
          Total de casos LOCALES en todo el país:
          <b>{{total}}</b>
          más 117 importados: {{total + 117}}
        </td>
      </tr>
    </table>
    <h2>Municipios con mas casos:</h2>

    <table class="tablaMunicipios">
      <tr>
        <th>Departamento</th>
        <th>Municipio</th>
        <th>Casos</th>
      </tr>
      <tr
        v-for="x in tablaMunicipios"
        v-bind:key="x.municipio.id"
        @mouseover="resaltarMunicipio(x.municipio)"
        @mouseout="resaltarMunicipio(x.municipio,false)"
      >
        <td>{{x.departamento}}</td>
        <td>{{x.municipio.nombre}}</td>
        <td>{{x.casos}}</td>
      </tr>
      <tr>
        <td colspan="2">Total Top 10 municipios:</td>
        <td>{{tablaMunicipios.reduce((p,c) => c.casos + p,0)}}</td>
      </tr>
    </table>

    <div>Estos municipios representan el: {{(tablaMunicipios.reduce((p,c) => c.casos + p, 0) /total) * 100}}% de los casos del país.</div>
    <div id="tooltip" display="none" style="position: absolute; display: none;">
      {{muniTooltip.nombre}}: {{muniTooltip.numCasos}}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Tooltip } from "../tools/tooltip";
import { obtenerJson } from "../tools/tools";
import { colorearMunicipio, COLOR_DEFAULT, COLOR_RESALTADO } from "../tools/map_tools"
import { Departamento, Municipio, Casos } from '../model/geo';



@Component
export default class Mapa extends Vue {
  @Prop() private msg!: string;
  maxVal = 0;
  total = 0;
  ultimo = "";
  tablaMunicipios: {departamento: string;
            municipio: Municipio;
            casos: number;
          }[] = [];
  elsalvador = "";
  departamentos: Departamento[] = [];
  // Fechas
  fechasCasos: string[] = [];
  fechaSelIdx = 0;
  mantenerMax = true;

  get fechaSelFormateada(): string {
    const fecStr = this.fechasCasos[this.fechaSelIdx];
    if (fecStr == undefined) return "N/A";
    return fecStr.substr(8,2) + "/" + fecStr.substr(5,2) + "/" + fecStr.substr(0,4);
  }
  get maxIdxFechas(){ return this.fechasCasos.length - 1;}

  @Watch('fechaSelIdx')
  async fechaSelIdxChanged(){
    const fecString = this.fechasCasos[this.fechaSelIdx];

    this.casos = await obtenerJson("/casos_covid/"+ fecString,{method:'get'});
    this.mostrar();
  }

  //Casos
  casos: Casos[] = [];
  muniTooltip: any = {nombre:'',numCasos:0};

  resaltarMunicipio(muni: any, resaltar = true) {
    if (resaltar) {
      muni.originalFill = muni.elements[0].style.fill;
      colorearMunicipio(muni as Municipio,COLOR_RESALTADO);
    } else {
      colorearMunicipio(muni as Municipio,muni.originalFill);
    }
  }

  mostrar() {
    this.tablaMunicipios = [];

    const r = this.casos.reduce((p,c) => {return {tot:p.tot + c.casos, max:Math.max(p.max,c.casos)}}, {tot:0,max:0});
    this.total = r.tot;
    if(this.maxVal == 0 || !this.mantenerMax)
      this.maxVal = r.max;

    for (const x of this.departamentos) {
      for (const muni of x.municipios) {
        let num = this.casos.find(x => x.municipio.id == muni.id)?.casos || 0;
        muni.numCasos = num;

        num = ((num ? num : 0) * 100) / this.maxVal;

        if (num > 0){
          this.tablaMunicipios.push({
            departamento: x.nombre,
            municipio: muni,
            casos: muni.numCasos
          });
          colorearMunicipio(muni,"hsl(0, 100%, " + (100 - num - (100 - num) * 0.05) + "%)");
        }else
          colorearMunicipio(muni, COLOR_DEFAULT);
      }
    }

    this.tablaMunicipios.sort((a: any, b: any) => b.casos - a.casos);
    this.tablaMunicipios = this.tablaMunicipios.slice(0,10);
  }

  configurarEventosMunicipio(muni: Municipio){
    for (let i = 0; i < muni.elements.length; i++){
      const e = muni.elements[i];
      e.onmouseover = () => {
        this.resaltarMunicipio(muni);
        this.muniTooltip = muni;
      }
      e.onmousemove = function(evt: MouseEvent) {
        Tooltip.showTooltip(
          evt
        );
      };
      e.onmouseout = () => {
        Tooltip.hideTooltip();
        this.resaltarMunicipio(muni, false);
      };
    }
  }

  init() {

    if(this.departamentos.length == 0){
      console.log('departamentos no cargados, reintentando');
      return setTimeout(this.init,250);
    }
    const svgObject = (document?.getElementById("mapa") as HTMLObjectElement).contentDocument;
    if (svgObject == null) {
      console.log('svg object not found, reintentando');
      return setTimeout(this.init,250);
    }

    for (const dep of this.departamentos) {
      const cod = dep.codigo;
      const depLayer = (svgObject.getElementById(
        cod
      ) as unknown) as SVGElement;
      for (const muni of dep.municipios) {
        const muniLayer = depLayer
          .getElementsByTagName("g")
          .namedItem(muni.codigo);
        if (muniLayer) {
          muni.elements = muniLayer.getElementsByTagName("path");

          colorearMunicipio(muni,COLOR_DEFAULT);
          this.configurarEventosMunicipio(muni);
        } else console.warn(dep.nombre, muni.nombre, "not found");
      }
    }
    this.mostrar();
  }

  mounted() {
    (async () => {
      try {
        this.casos = await obtenerJson("/casos_covid");
        this.fechasCasos = await obtenerJson("/fechas_casos");

        if(this.departamentos.length == 0) {
          this.departamentos = await obtenerJson("/departamentos/codigo_pais/503/si",{method:'get',cache:'force-cache'});
          this.init();
        }
        
        this.fechaSelIdx = this.maxIdxFechas;
        //console.log("casos:", this.casos, 'fechasCasos',this.fechasCasos,"departamentos", this.departamentos);
      } catch (e) {
        console.error(e);
      }
    })();

    //window.addEventListener("load", this.init);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#tooltip {
  background: cornsilk;
  border: 1px solid black;
  border-radius: 5px;
  padding: 5px;
}

.colorbar {
  height: 25px;
  background: linear-gradient(
    to right,
    hsl(0, 100%, 95%) 0%,
    hsl(0, 100%, 50%) 50%,
    hsl(0, 100%, 5%) 100%
  );
}

.copy {
  width: 100%;
  text-align: right;
  color: silver;
  font-size: small;
}

.tablaMunicipios {
  font-size: small;
  background-color: lightgreen;
  margin-right: auto;
  margin-left: auto;
  border: darkgray;
  border-collapse: collapse;
}
.tablaMunicipios td th {
  border: 1px solid darkgray;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
