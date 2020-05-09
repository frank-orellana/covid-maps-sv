import {Municipio} from '../model/geo'

export const COLOR_DEFAULT = "lightgreen"
export const COLOR_RESALTADO = "gray"

export function colorearMunicipio(muni: Municipio, color: string) {
	if(!muni.elements) return;
	for (let e = 0; e < muni.elements.length; e++)
		muni.elements[e].style.fill = color;
}