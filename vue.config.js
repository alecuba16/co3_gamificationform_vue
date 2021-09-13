const path = require('path');
module.exports = {
  outputDir:'gamificationform',
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  chainWebpack: config => {
      //this path is specific to my project
      config.resolve.alias.set('@assets', path.resolve('./public/assets')),
      config.externals("/^(genderListJSON|\$)$/i"),
      config.devtool(process.env.NODE_ENV === 'production'? 'false':'source-map')
  },
  devServer: {
    disableHostCheck: true,
    proxy: {
        '/projectco3proxy': {
          target: 'https://www.projectco3.eu/wp-content/corsproxy/index.php?url=https://script.google.com/macros/s/AKfycbyBDVwW8HkR0n4Z54EdtgKi-HS1rTvRybjZvzgmBkQkHlj31_O6/exec'
        }
      }
  }
}