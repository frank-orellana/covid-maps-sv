module.exports = {
  publicPath: import.meta.env.MODE === 'production'
    ? '/maps/covid_maps_sv/'
    : '/',
  configureWebpack: {
    devServer: {
      disableHostCheck: true
    }
  },
}
