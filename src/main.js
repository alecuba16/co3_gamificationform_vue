import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import Buefy from 'buefy'
Vue.use(Buefy)
import 'buefy/dist/buefy.css'

import vueCountryRegionSelect from 'vue-country-region-select'
Vue.use(vueCountryRegionSelect);

import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)
 Vue.component('apexchart', VueApexCharts)

Vue.prototype.$eventHub = new Vue(); // Global event bus
new Vue({
  el: '#app',
  render: h => h(App)
})