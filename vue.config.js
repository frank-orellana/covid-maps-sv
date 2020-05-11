module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/maps/'
    : '/',
  configureWebpack: {
    devServer: {
      disableHostCheck: true
    }
  },
}
