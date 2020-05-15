module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/maps/covid_maps_sv_beta/'
    : '/',
  configureWebpack: {
    devServer: {
      disableHostCheck: true
    }
  },
}
