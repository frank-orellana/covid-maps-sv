console.log('config:',import.meta.env.MODE);

export default {
	api_url : import.meta.env.MODE === 'production'? 'https://intranet.tritium.cl:3000': `http://${location.hostname}:3000`,
	app_name : 'tritium maps'
}