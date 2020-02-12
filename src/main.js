// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import VueCookies from 'vue-cookies'
import VueSweetAlert from 'vue-sweetalert'
import axios from 'axios'
import VueAxios from 'vue-axios'
// import VueResource from 'vue-resource'
import VueQRReader from 'vue-qrcode-reader'
// import QRReader from 'vue-qr-reader'
import QRCodeGen from '@xkeshi/vue-qrcode'
import VueChart from 'vue-chart-js'
import 'vuetify/dist/vuetify.min.css'
require('@/components/css/style.css')

Vue.use(VueChart)
Vue.component('qrcode', QRCodeGen)
// Vue.use(QRCodeGen)
Vue.use(Vuetify)
Vue.use(VueSweetAlert)
Vue.use(VueCookies)
Vue.use(VueAxios, axios)
// Vue.use(VueResource)
Vue.use(VueQRReader)
Vue.use(VueSweetAlert)
// Vue.use(QRReader)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  methods: {
    redirectTo (destination) {
      router.push(destination)
    },
    getUserByBLCP (blcp) {
      var source = {blcp_code: blcp}
      this.axios.post(process.env.API + '/get_userby_blcp', {data: source}).then((response) => {
        // console.log(response.data)
        var user = response.data
        console.log(user[0])
        if (user.length > 0) {
          return user[0]
        } else {
          return null
        }
      })
    }
  }
})
