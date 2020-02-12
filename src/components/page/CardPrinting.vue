<template lang="html">
  <!-- <v-layout row wrap justify-center align-center> -->
  <div>
    <div v-if="!loading">
      <!-- <br class="print-ignore"/> -->
      <!-- <div class="div-front"> -->
      <v-card width="86mm" class="print-ignore right">
        <v-card-title primary-title>
          จัดระยะการพิมพ์ (หน่วยมิลลิเมตร, mm.)
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="topMargin"
            name="name"
            label="ระยะจากด้านบน"
            id="id"
          ></v-text-field>
          <v-text-field
            v-model="leftMargin1"
            name="name"
            label="ระยะจากด้านซ้าย (หน้าการ์ด)"
            id="id"
          ></v-text-field>
          <v-text-field
            v-model="leftMargin2"
            name="name"
            label="ระยะจากด้านซ้าย (หลังการ์ด)"
            id="id"
          ></v-text-field>
          <v-text-field
            v-model="btwMargin"
            name="name"
            label="ระยะระหว่างการ์ด"
            id="id"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="closeTab()">CLOSE</v-btn>
          <v-btn color="primary" @click="print()"><v-icon>print</v-icon>&nbsp;Print</v-btn>
        </v-card-actions>
      </v-card>
      <!-- <div style="height: 29.7cm; width: 21cm;" class="elevation-5 print-ignore"> -->
        <v-flex xs12 sm12 md6>
          <v-card class="aaa" id="card-front" height="55mm" width="86mm" :style="frontCard">
            <v-card-text>
              <v-layout row wrap justify-center text-xs-center align-center>
                <v-flex xs6>
                  <br>
                  <v-avatar
                  size="70px"
                  class="blue lighten-5 mt-2"
                  >
                  <img :src="picCaptured">
                </v-avatar>
                <v-flex xs12 class="mt-2">
                  <span>{{firstName}} {{lastName}}</span>
                  <v-spacer></v-spacer>
                  <span>รหัสประชาชน</span>
                  <v-spacer></v-spacer>
                  <span>{{citizen_id}}</span>
                  <v-spacer></v-spacer>
                  <br>
                  <!-- <qrcode :value="blcp" :options="{ size: 80 }"></qrcode> -->
                </v-flex>
              </v-flex>
              <v-flex xs6>
                <br>
                <qrcode class="ml-3 ma-1 mt-3" :value="blcp" :options="{ size: 105 }"></qrcode>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>

    <!-- </div> -->
    <br class="print-ignore"/>
    <!-- <div class="div-back"> -->
      <v-card class="aaa" id="card-back" height="55mm" width="86mm" :style="backCard">
        <v-card-text>
          <v-layout text-xs-center row wrap justify-center align-center fill-height>
            <v-flex xs7>
              <br><br><br>
              <span>สายด่วนรับข้อร้องเรียน</span>
              <br>
              <span>038-918644-5</span>
              <v-spacer></v-spacer>
              <br>
              <span>EMERGENCY CALL</span>
              <br>
              <span>038-91855-5</span>
              <v-spacer></v-spacer>
              <br>
            </v-flex>
            <v-flex xs5>
              <br><br>
              <img class="mt-3 ml-1" width="100px" src="../../assets/lineqr.png">
              <!-- <qrcode class="mt-2 ml-1" :value="blcp" :options="{ size: 100 }" ></qrcode> -->
              <h5 class="white--text ml-3 mt-2">Line Group ไตรภาคี</h5>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
      <!-- </div> -->

    <!-- </div> -->


  </div>
  <div class="print-ignore" v-else>
    <v-progress-circular indeterminate large color="primary"></v-progress-circular>
  </div>
<!-- </v-layout> -->
</div>
</template>

<script>
export default {
  data () {
    return {
      topMargin: 10,
      leftMargin1: 32,
      leftMargin2: 32,
      btwMargin: 5,
      picCaptured: process.env.API + '/getImg/',
      loading: false,
      blcp: this.$route.query.blcp,
      citizen_id: '',
      prefix: '',
      firstName: '',
      lastName: '',
      phone: '',
      user: ''
    }
  },
  computed: {
    frontCard () {
      var style = {
        'margin-top': this.topMargin + 'mm',
        'margin-left': this.leftMargin1 + 'mm',
        'margin-bottom': this.btwMargin + 'mm'
      }
      return style
    },
    backCard () {
      var style = {
        'margin-left': this.leftMargin2 + 'mm'
      }
      return style
    }
  },
  methods: {
    closeTab () {
      window.close()
    },
    print () {
      window.print()
    },
    getUserByBLCP () {
      this.loading = true
      var source = {blcp_code: this.blcp}
      this.axios.post(process.env.API + '/get_userby_blcp', {data: source}).then((response) => {
        // console.log(response.data)
        var user = response.data
        // console.log(user.length)
        if (user.length > 0) {
          var id = user[0].citizen_id
          this.blcp = user[0].blcp_code
          this.citizen_id = id[0] + '-' + id[1] + '' + id[2] + '' + id[3] + '' + id[4] + '-' + id[5] + '' + id[6] + '' + id[7] + '' + id[8] + '' + id[9] + '-' + id[10] + '' + id[11] + '-' + id[12]
          this.prefix = user[0].prefix
          this.firstName = user[0].firstname
          this.lastName = user[0].lastname
          this.phone = user[0].phone
          this.picCaptured = this.picCaptured + user[0].picture
          this.loading = false
        } else {
          this.$swal('BLCP CODE ไม่ถูกต้อง!', '', 'error')
          this.loading = false
        }
      })
    }
  },
  created () {
    this.getUserByBLCP()
    // alert('')
    // window.print()
  }
}
</script>

<style lang="css" scoped>
@page {
  size: A4;
  margin: 0;
}
</style>
