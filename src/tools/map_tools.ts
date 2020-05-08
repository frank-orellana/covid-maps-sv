import {Municipio} from '../model/geo'

export enum colors {
	default = "ligthgreen"
}

export function colorearMunicipio(muni: Municipio, color: colors | string) {
	if(!muni.elements) return;
	for (let e = 0; e < muni.elements.length; e++)
		muni.elements[e].style.fill = color;
}