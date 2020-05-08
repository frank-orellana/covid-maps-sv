import config from "./config";

export async function obtenerJson(url: string, params = {}): Promise<any>{
	console.log("fetching", config.api_url + url);
	const resp = await fetch(config.api_url + url, {method: "post"});
	if(resp.status == 200){
		const json = await resp.json();
		console.log('response:', json);
		return json;
	}else{
		return {error: resp.status}
	}
}

export function cleanUpSpecialChars(str: string) {
	return str
		.toLowerCase()
		.replace(/[àáâãäå]/gi, "a")
		.replace(/[èéê]/gi, "e")
		.replace(/[ìíî]/gi, "i")
		.replace(/[òóô]/gi, "o")
		.replace(/[ùúû]/gi, "u")
		.replace(/[ñ]/gi, "n")
		.replace(/[^a-z0-9 ]/gi, ""); // final clean up
}