import { CasosDiarios, Municipio, Departamento } from '@/model/geo';
import { getMunicipiosServer, getDepartamentosServer } from './municipios';
import { obtenerJson } from './tools';

class Store {
	private _municipios!: Map<number, Municipio> | Promise<Map<number, Municipio>> | undefined;
	private _departamentos!: Departamento[] | Promise<Departamento[]>;
	private _fechasCasos!: Array<string>;
	private _listaCasosDiariosFecha: Map<string,CasosDiarios[] | Promise<CasosDiarios[]>> = new Map();
	private _histCasosDiariosMunis = new Map<number, CasosDiarios[] | Promise<CasosDiarios[]>>();
	private _muertes!: Array<any> | Promise<Array<any>>;

	dummy = 0;

	constructor() {
		console.log('Initializing store...');
	}


	async getFechasCasos() : Promise<string[]> {
		if(this._fechasCasos) return this._fechasCasos;

		return new Promise((resolve,reject) => {
			obtenerJson("/fechas_casos")
				.then(val => {
					this._fechasCasos = (val || []) as string[];
					resolve(this._fechasCasos);
				})
				.catch(reason => reject(reason));
		})
	}

	async obtenerCasosDiarios(fecString: string, cache : RequestInit["cache"] = 'default'): Promise<CasosDiarios[]>{
		const casos = this._listaCasosDiariosFecha.get(fecString);
		if(casos != undefined) {
			if(casos instanceof Promise) console.log('obtenerCasosDiarios',fecString,'Already being requested. Returning promise to wait...');
			return casos;
		}

		const p : Promise<CasosDiarios[]> = new Promise((resolve, reject) => {
			this.getMunicipios()
			.then(munis => {
				obtenerJson("/casos_diarios/"+ fecString,{method:'get', mode: "cors", cache: cache})
				.then(casos2 => {
					let cas = (casos2 || []) as CasosDiarios[];
					cas = cas.map(c => ({
						...c,
						municipio: munis.get(c.id_municipio) as Municipio
					}));
					this._listaCasosDiariosFecha.set(fecString,cas);
					resolve(cas);
				}).catch(reason => reject(reason))
			}).catch(reason => reject(reason))
		});

		this._listaCasosDiariosFecha.set(fecString,p);
		return p;
	}

	async getMunicipios() : Promise<Map<number,Municipio>>{
		if(this._municipios) return this._municipios;

		const munis = new Map<number, Municipio>();
		for (let d of await this.getDepartamentos()) {
			for (let m of d.municipios) {
				m.departamento = d;
				munis.set(m.id, m);
			}
		}
		this._municipios = munis;
		return munis;
	}

	async getDepartamentos(reload: boolean = false) : Promise<Departamento[]>{
		if (this._departamentos) {
			if(this._departamentos instanceof Promise) console.log('getDepartamentos','Already being requested. Returning promise to wait...');
			return this._departamentos;
		}

		this._municipios = undefined;

		const p : Promise<Departamento[]> = new Promise((resolve, reject) => {
			getDepartamentosServer(true,reload)
				.then(val => {
					this._departamentos = val;
					resolve(val);
				})
				.catch(reason => reject(reason))
		});
		this._departamentos = p;
		return p;
	}

	async getHistCasosDiariosMunicipio(idMunicipio: number): Promise<CasosDiarios[]> { 
		let c = this._histCasosDiariosMunis.get(idMunicipio);
		if (c != undefined) {
			if(c instanceof Promise)console.log('getHistCasosDiariosMunicipio',idMunicipio,'Already being requested. Returning promise to wait...');
			return c;
		}

		console.log(idMunicipio,'not cached, requesting it...')
		const p : Promise<CasosDiarios[]> = new Promise((resolve, reject) => {
			obtenerJson('/hist_casos/' + idMunicipio, { method: 'get', mode: 'cors' })
				.then(casos => {
					c = (casos || []) as CasosDiarios[];
					this._histCasosDiariosMunis.set(idMunicipio, c);

					resolve(c);
				})
				.catch(reason => reject(reason))
		});
		this._histCasosDiariosMunis.set(idMunicipio,p);
		return p;
	}

	async getMuertes() : Promise<Array<any>>{
		let m = this._muertes;
		if(m != undefined) return m;

		const p : Promise<Array<any>> = new Promise((resolve,reject) => {
			obtenerJson('/muertes', {method: 'get', mode: 'cors'})
			.then(muertes => {
				this._muertes = muertes;
				resolve(muertes);
			})
			.catch(reason => reject(reason));
		})
		m = p;
		return p;
	}
}

const store = new Store();
export default store;