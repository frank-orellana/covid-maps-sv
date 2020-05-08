<template>
  <div>
    <object id="mapa" data="./img/el_salvador.svg" type="image/svg+xml" style="width:100%"></object>
    <div
      class="copy"
    >Creador: Franklin Orellana, Tritium S.p.A. © 2020 - Fuente de datos: https://covid19.gob.sv/ (4 DE MAYO 2020 9:36 p.m.)</div>
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
        v-for="x in tablaMunicipios.slice(0,10)"
        v-bind:key="x.departamento"
        @mouseover="resaltarMunicipio(x.municipio)"
        @mouseout="resaltarMunicipio(x.municipio,false)"
      >
        <td>{{x.departamento}}</td>
        <td>{{x.municipio.nombre}}</td>
        <td>{{x.casos}}</td>
      </tr>
    </table>

    <div>el salvador: {{elsalvador}}</div>
    <div id="tooltip" display="none" style="position: absolute; display: none;">
      {{muniTooltip.nombre}}: {{muniTooltip.numCasos}}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Tooltip } from "../tools/tooltip";
import { obtenerJson } from "../tools/tools";
import { colorearMunicipio } from "../tools/map_tools"
import { Departamento, Municipio, Casos } from '../model/geo';



@Component
export default class Mapa extends Vue {
  @Prop() private msg!: string;
  maxVal = 0;
  total = 0;
  ultimo = "";
  tablaMunicipios: any = [];
  elsalvador = "";
  departamentos: Departamento[] = [];
  casos: Casos[] = [];
  muniTooltip: any = {nombre:'',numCasos:0};

  resaltarMunicipio(muni: any, resaltar = true) {
    if (resaltar) {
      muni.originalFill = muni.elements[0].style.fill;
      colorearMunicipio(muni as Municipio,"gray");
      //for (const e of muni.elements) e.style.fill = "gray";
    } else {
      //for (const e of muni.elements) e.style.fill = muni.originalFill;
      colorearMunicipio(muni as Municipio,muni.originalFill);
    }
  }

  mostrar() {
    this.tablaMunicipios = [];

    const r = this.casos.reduce((p,c) => {return {tot:p.tot + c.casos, max:Math.max(p.max,c.casos)}}, {tot:0,max:0});
    this.total = r.tot;
    this.maxVal = r.max;

    console.log('mostrar', r,this.casos);

    for (const x in this.departamentos) {
      for (const muni of this.departamentos[x].municipios) {
        let num = this.casos.find(x => x.municipio.id == muni.id)?.casos || 0;
        muni.numCasos = num;

        num = ((num ? num : 0) * 100) / this.maxVal;

        if (num > 0)
          this.tablaMunicipios.push({
            departamento: x,
            municipio: muni,
            casos: muni.numCasos
          });

        if (num > 0)
          colorearMunicipio(muni,"hsl(0, 100%, " + (100 - num - (100 - num) * 0.05) + "%)")
      }
    }

    this.tablaMunicipios.sort((a: any, b: any) => b.casos - a.casos);
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

  mounted() {
    // eslint-disable-next-line
    const self = this;
    (async () => {
      try {
        this.casos = await obtenerJson("/casos_covid");
        console.log("casos:", this.casos);
      } catch (e) {
        console.error(e);
      }
    })();

    window.addEventListener("load", function() {
      (async () => {
        try {
          self.departamentos = await obtenerJson(
            "/departamentos/codigo_pais/503/si"
          );
          console.log("departamentos", self.departamentos);
        } catch (e) {
          console.error(e);
        }

        const svgObject = (document?.getElementById("mapa") as HTMLObjectElement).contentDocument;
        if (svgObject == null) return console.error("svg object not found");

        console.log("len", self.departamentos.length);
        for (const dep of self.departamentos) {
          const cod = dep.codigo;
          const depLayer = (svgObject.getElementById(
            cod
          ) as unknown) as SVGElement;
          for (const muni of dep.municipios) {
            const muniLayer = depLayer
              .getElementsByTagName("g")
              .namedItem(muni.codigo);
            if (muniLayer) {
              //console.log(x,m);
              muni.elements = muniLayer.getElementsByTagName("path");

              colorearMunicipio(muni,"lightgreen");
              self.configurarEventosMunicipio(muni);
            } else console.warn(dep.nombre, muni.nombre, "not found");
          }
        }

        self.mostrar();
      })();
    });
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
