<template lang="html">
  <v-app style="background-color:#EEEEEE">
    <my-nav/>
    <v-content>
      <v-container fluid grid-list-xl text-xs-center fill-height>
        <v-layout row wrap justify-center>
          <v-flex xs12 sm12 md5 d-flex>
            <v-btn href="/reg" color="blue-grey darken-2" dark block class="fullHeight">
              <div>
                <span class="display-3">Check-in</span>
                <v-spacer></v-spacer>
                <span class="subheading">ลงชื่อเข้าร่วมประชุม</span>
              </div>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm12 md4 d-flex>
            <v-btn color="grey lighten-1" block class="fullHeight">
              <div>
                <span class="display-2">Check-out</span>
                <v-spacer></v-spacer>
                <span class="body-2">ลงชื่อออกจากงานและการจ่ายเงิน</span>
              </div>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm12 md3 d-flex>
            <v-layout row wrap>
              <v-flex xs12 sm6 md12 d-flex >
                <v-btn color="indigo" dark block class="fullHeight">
                  <div>
                    <span class="display-1">Manage Staff</span>
                    <v-spacer></v-spacer>
                    <span class="body-1">จัดการพนักงาน</span>
                  </div>
                </v-btn>
              </v-flex>
              <v-flex xs12 sm6 md12 d-flex >
                <v-btn color="green" dark block class="fullHeight">
                  <div>
                    <span class="display-1">Report</span>
                    <v-spacer></v-spacer>
                    <span class="body-1">ดูรายงานการเข้าประชุม</span>
                  </div>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <my-footer/>
  </v-app>
</template>

<script>

import Navbar from '@/components/index/Navbar'
import Footer from '@/components/index/Footer'

export default {
  components: {
    'my-nav': Navbar,
    'my-footer': Footer
  },
  data () {
    return {
      regisClass: '',
      checkClass: '',
      manageClass: '',
      reportClass: ''
    }
  },
  created () {
    // check login status
    // console.log(this.$cookies.get('isLogin') === 'false')
    if (!this.$cookies.isKey('isLogin') || this.$cookies.get('isLogin') === 'false') {
      this.$root.redirectTo('login')
      console.log('false')
    }
  },
  methods: {
  }
}
</script>

<style lang="css" scoped>
.fullHeight {
  height: 100%
}
</style>
