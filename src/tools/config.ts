console.log('config:',process.env.NODE_ENV);

export default {
	api_url : process.env.NODE_ENV === 'production'? 'https://tritium.cl:3000': 'http://192.168.1.68:3000',
	app_name : 'tritium maps'
}