import {Municipio} from '../model/geo'

export const COLOR_DEFAULT = "#77dd77"
export const COLOR_RESALTADO = "gray"

export class tipo_med{
	static casos = "0";
	static casos_poblacion = "1"
	static casos_km2 = "2"
	static casos_15d = "3"
};
export class tipo_esc{
  static lineal = "0";
  static logaritmica = "1";
  static trigonometrica = "2";
  static raiz_cuadrada = "3"
};

export class coloresEscala {
	static red = {hue:0,color:'red',gradientClass:'colorbar-red'};
	static blue = {hue:240,color:'blue',gradientClass:'colorbar-blue'};
}

export function colorearMunicipio(muni: Municipio, color: string) : void {
	if(!muni.elements) return;
	for (let e = 0; e < muni.elements.length; e++)
		muni.elements[e].style.fill = color;
}

// tslint:disable-next-line: max-line-length
export function colorProporcional(casos:number, maxVal: number, escalaMin: number, escalaMax: number, tipoEscala: tipo_esc) : number {
	let proporcional: number;

	switch(tipoEscala){
		case tipo_esc.logaritmica:
			proporcional = ((maxVal / Math.log10(maxVal)) * Math.log10(casos)) * 100 / maxVal;
			break;
		case tipo_esc.trigonometrica:
			proporcional = 100 * Math.sin(Math.asin(1) * casos / maxVal);
			break;
		case tipo_esc.raiz_cuadrada:
			proporcional = 100 * Math.sqrt(casos) / Math.sqrt(maxVal);
			break;
		default:
			proporcional = casos * 100 / maxVal;
	}

	const colorProporcional = (proporcional * (escalaMax - escalaMin) / 100) + escalaMin;
	return colorProporcional;
}