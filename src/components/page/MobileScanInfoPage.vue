<template lang="html">
  <v-app >
    <v-card class="mobile-bg">
      <v-layout row wrap justify-center fill-height text-xs-center>
        <v-card width="100%" class="mobile-card">
          <v-layout row wrap fill-height justify-center align-center>

            <v-card v-if="loading" width="100%" height="100%" class="font-weight-bold white--text title" color="blue-grey darken-2">
              <v-layout row wrap fill-height justify-center align-center>
                <v-progress-circular indeterminate></v-progress-circular>
              </v-layout>
            </v-card>
            <v-card v-if="!loading" width="100%" height="10%" class="font-weight-bold white--text title" color="blue-grey darken-2">
              <v-layout row wrap fill-height justify-center align-center>
                <v-spacer></v-spacer>
                <span>ระบบลงทะเบียนด้วยมือถือ</span>
                <v-spacer></v-spacer>
                <v-icon class="mr-2" @click="logout()" color="white">exit_to_app</v-icon>
              </v-layout>
            </v-card>
            <v-card v-if="!loading" width="100%" height="80%" :class="cardClass">
              <v-layout row wrap justify-center fill-height align-center>
                <v-card-text class="pa-0">
                  <span>ข้อมูลผู้เข้าร่วมประชุม</span>
                  <v-spacer></v-spacer>
                  <br/>
                  <v-avatar
                  size="120"
                  class="grey"
                  >
                  <img :src="profilePic" alt="alt">
                </v-avatar>
                <v-spacer></v-spacer>
                <br/>
                <span>รหัสประชาชน: {{citizenID}}</span>
                <v-spacer></v-spacer>
                <br/>
                <span>ชื่อ-นามสกุล: {{firstName}} {{lastName}}</span>
                <v-spacer></v-spacer>
                <br/>
                <span>ที่อยู่: {{address}}</span>
              </v-card-text>
              <v-card-text class="pa-0">
                <span>เข้าร่วมประชุมทั้งหมด: {{totalJoin}} ครั้ง</span>
                <v-spacer></v-spacer>
                <span>เวลาเข้า: {{checkin_time}}</span>
                <v-spacer></v-spacer>
                <span>เวลาออก: {{checkout_time}}</span>
              </v-card-text>
            </v-layout>
          </v-card>
          <v-card v-if="!loading" width="100%" height="10%" :class="cardClass">
            <v-layout row wrap fill-height justify-center align-center>
              <v-btn style="border-radius: 0.3em" @click="openCheckInBox()" color="green" :disabled="checkin" class="white--text">Check-In</v-btn>
              <v-btn style="border-radius: 0.3em" @click="openCheckOutBox()" color="indigo" :disabled="checkout" class="white--text">Check-Out / Pay</v-btn>
            </v-layout>
          </v-card>
    </v-layout>
  </v-card>
</v-layout>
<v-layout row justify-center>
  <v-dialog v-model="checkinDialog" persistent max-width="100%">
    <v-card style="border-radius: 0.3em">
      <v-card-title class="headline">ยืนยันลงชื่อเข้าร่วมประชุม?</v-card-title>
      <v-card-text class="subheading">
        <span>ต้องการลงชื่อเข้าร่วมประชุมให้กับ</span>
        <v-spacer></v-spacer>
        <span>คุณ{{firstName}} {{lastName}}</span>
        <v-spacer></v-spacer>
        <span>ณ วันที่ {{checkDate}} เวลา {{checkTime}} น.</span>
        <v-spacer></v-spacer>
        <span></span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn style="border-radius: 0.3em" color="grey" flat @click.native="checkinDialog = false">Cancel</v-btn>
        <v-btn style="border-radius: 0.3em" color="green darken-1" dark @click.native="checkinM()">Check-in</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-layout>
<v-layout row justify-center>
  <v-dialog v-model="checkinInfoDialog" persistent max-width="100%">
    <v-card style="border-radius: 0.3em">
      <v-alert class="subheading" type="success" :value="true">
        Check-In Success
      </v-alert>
      <v-card-text class="subheading">
        <span>ผู้เข้าร่วมทั้งหมด: {{totalReg}} คน</span>
        <v-spacer></v-spacer>
        <span>ลงทะเบียนกับคุณ: {{yourReg}} คน</span>

      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn style="border-radius: 0.3em" color="green darken-1" flat @click.native="redirectTo('mobile-reg-home')">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-layout>
<v-layout row justify-center>
  <v-dialog v-model="checkoutDialog" persistent max-width="95%">
    <v-card style="border-radius: 0.3em">
      <v-card-title class="headline">ยืนยันลงชื่อออกการประชุม?</v-card-title>
      <v-card-text class="subheading">
        <span>ต้องการลงชื่อออกประชุมให้กับ</span>
        <v-spacer></v-spacer>
        <span>คุณ{{firstName}} {{lastName}}</span>
        <v-spacer></v-spacer>
        <span>ณ วันที่ {{checkDate}} เวลา {{checkTime}} น.</span>
        <v-spacer></v-spacer>
        <span></span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn style="border-radius: 0.3em" color="grey" flat @click.native="checkoutDialog = false">Cancel</v-btn>
        <v-btn style="border-radius: 0.3em" color="indigo" dark @click.native="checkoutM()">Check-out</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-layout>
<v-layout row justify-center>
  <v-dialog v-model="payDialog" persistent max-width="95%">
    <v-card style="border-radius: 0.3em">
      <v-card-title class="headline">จ่ายเงินให้กับผู้เข้าประชุม?</v-card-title>
      <v-card-text class="subheading">
        <span>คุณ{{firstName}} {{lastName}}</span>
        <v-spacer></v-spacer>
        <span>เข้าร่วมประชุม: {{joined}} ครั้ง</span>
        <v-spacer></v-spacer>
        <span>เวลาเข้า {{checkinDatetime}}</span>
        <v-spacer></v-spacer>
        <span>เวลาออก {{checkoutDatetime}}</span>
        <v-spacer></v-spacer>
        <span>เป็นเวลา {{joinedTime}} (ชั่วโมง:นาที:วินาที)</span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn style="border-radius: 0.3em" color="red" dark @click.native="payM(1)">NOT</v-btn>
        <v-btn style="border-radius: 0.3em" color="indigo" dark @click.native="payM(0)">PAY</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-layout>
<v-layout row justify-center>
  <v-dialog v-model="alertDialog" persistent max-width="95%">
    <v-card style="border-radius: 0.3em">
      <v-alert type="error" :value="true" width="100%" class="headline">
        Invalid QR Code!
      </v-alert>
      <v-card-text class="subheading">
        <span>กรุณาติดต่อพนักงานหรือลองใหม่อีกครั้งในภายหลัง.</span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn style="border-radius: 0.3em" flat color="primary" @click.native="redirectTo('mobile-reg-home')">OKAY</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-layout>
<v-layout row justify-center>
  <v-dialog v-model="checkoutInfoDialog" persistent max-width="95%">
    <v-card style="border-radius: 0.3em">
      <v-alert class="subheading" type="success" :value="true">
        Check-Out Success
      </v-alert>
      <v-card-text class="subheading">
        <span>ลงชื่อออกประชุมให้กับ</span>
        <v-spacer></v-spacer>
        <span>คุณ{{firstName}} {{lastName}}</span>
        <v-spacer></v-spacer>
        <span>ณ {{checkDate}} เวลา {{checkTime}} น.</span>
        <v-spacer></v-spacer>
        <span>สถานะการจ่ายเงิน :</span>
        <span v-if="payment" class="green--text"> จ่ายแล้ว </span>
        <span v-else class="red--text"> ไม่จ่าย</span>
        <v-spacer></v-spacer>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn style="border-radius: 0.3em" color="green darken-1" dark @click.native="redirectTo('mobile-reg-home')">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-layout>
<v-layout row justify-center>
  <v-dialog v-model="loadingDialog" persistent max-width="50%">
    <v-card style="border-radius: 0.3em">
      <v-card-text class="subheading">
        <v-layout row wrap justify-center>
          <v-progress-circular indeterminate></v-progress-circular>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</v-layout>
</v-card>
</v-app>
</template>

<script>
export default {
  data () {
    return {
      profilePic: process.env.API + '/getImg/',
      joined: 0,
      joinedTime: '',
      checkinDatetime: '',
      checkoutDatetime: '',
      payment: false,
      loadingDialog: false,
      totalJoin: 0,
      checkTime: '',
      checkDate: '',
      yourReg: '',
      totalReg: '',
      user: null,
      loading: false,
      firstName: '',
      lastName: '',
      citizenID: '',
      address: '',
      checkin_time: '-',
      checkout_time: '-',
      alertDialog: false,
      checkinDialog: false,
      checkinInfoDialog: false,
      checkoutDialog: false,
      checkoutInfoDialog: false,
      payDialog: false,
      checkin: false,
      checkout: false,
      pay: true,
      cardClass: 'font-weight-bold transparent black--text subheading elevation-0',
      blcp: this.$route.query.blcp
    }
  },
  methods: {
    logout () {
      this.$swal({
        title: 'ต้องการออกจากระบบ ?',
        text: 'กด "ยืนยัน" เพื่อออกจากระบบหรือ "ยกเลิก"',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'ยกเลิก',
        confirmButtonText: 'ยืนยัน'
      }).then(result => {
        if (result) {
          if (this.$cookies.isKey('isLogin')) {
            this.$cookies.remove('isLogin')
            this.$cookies.remove('user')
            this.$root.redirectTo('login')
          }
        }
      })
    },
    redirectTo (des) {
      this.$root.redirectTo(des)
    },
    openCheckInBox () {
      var d = new Date()
      this.checkDate = d.getDate() + '/' + (d.getMonth() + 1) + '/' + (d.getFullYear() + 543)
      this.checkTime = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes()
      this.checkinDialog = true
    },
    openCheckOutBox () {
      var d = new Date()
      this.checkDate = d.getDate() + '/' + (d.getMonth() + 1) + '/' + (d.getFullYear() + 543)
      this.checkTime = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes()
      this.checkoutDialog = true
    },
    checkinM () {
      this.checkinDialog = false
      this.loadingDialog = true
      var manager = JSON.parse(this.$cookies.get('user'))
      var s = {manager_id: manager.id, blcpcode: this.user.blcp_code, user_fullname: (this.user.firstname + ' ' + this.user.lastname), manager_fullname: (manager.firstname + ' ' + manager.lastname), type: 'ลงทะเบียนด้วย QR Code'}
      this.axios.post(process.env.API + '/checkin', {source: s}).then((response) => {
        var res = response.data
        // console.log(res)
        if (res === 'fail') {
          this.loadingDialog = false
          this.$swal('ไม่มีการประชุมในวันนี้!', 'กรุณาเพิ่มการประชุมในหน้า "จัดการการประชุม" ก่อน', 'error')
        } else {
          this.axios.post(process.env.API + '/get_regCount_total').then(totalRes => {
            // console.log(totalRes);
            if (totalRes.data !== 'fail') {
              this.totalReg = totalRes.data[0].count
              this.axios.post(process.env.API + '/get_regCount_byManagerID', {manager_id: manager.id}).then(managerRes => {
                if (managerRes.data !== 'fail') {
                  this.checkinInfoDialog = true
                  this.yourReg = managerRes.data[0].count
                  this.loadingDialog = false
                  this.checkinInfoDialog = true
                } else {
                  this.yourReg = 0
                }
              })
            } else {
              this.totalReg = 0
              this.yourReg = 0
            }
          })
        }
      }).catch(error => {
        console.log(error)
        this.loadingDialog = false
        this.$swal('การเชื่อมต่อผิดพลาด!', '', 'error')
      })
    },
    checkoutM () {
      this.loadingDialog = true
      this.checkoutDialog = false

      // this.checkoutInfoDialog = true
      var manager = JSON.parse(this.$cookies.get('user'))
      var s = {manager_id: manager.id, blcpcode: this.user.blcp_code, manager_fullname: (manager.firstname + ' ' + manager.lastname)}
      this.axios.post(process.env.API + '/checkout', {source: s}).then((response) => {
        var res = response.data
        if (res === 'fail') {
          this.loadingDialog = false
          this.$swal('ไม่มีการประชุมในวันนี้!', 'กรุณาเพิ่มการประชุมในหน้า "จัดการการประชุม" ก่อน', 'error')
        } else {
          this.loadingDialog = false
          var d = new Date(res[0].checkin_datetime)
          this.checkinDatetime = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ' น.'
          d = new Date(res[0].checkout_datetime)
          this.checkoutDatetime = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ' น.'
          this.joinedTime = res[0].times
          this.payDialog = true
        }
      }).catch(error => {
        console.log(error)
        this.loadingDialog = false
        this.$swal('การเชื่อมต่อผิดพลาด!', '', 'error')
      })
    },
    payM (pay) {
      if (pay === 0) {
        this.payment = true
      } else {
        this.payment = false
      }
      this.loadingDialog = true
      this.payDialog = false
      var s = {manager_id: (JSON.parse(this.$cookies.get('user'))).id, blcpcode: this.user.blcp_code, received_money: pay}
      this.axios.post(process.env.API + '/received_money', {source: s}).then((response) => {
        var res = response.data
        // console.log(res)
        if (res === 'fail') {
          this.loadingDialog = false
          this.checkoutInfoDialog = true
          this.$swal('ไม่พบผู้เข้าประชุม!', 'กรุณาลองใหม่ในภายหลัง', 'error')
        } else {
          this.loadingDialog = false
          this.checkoutInfoDialog = true
        }
      }).catch(error => {
        console.log(error)
        this.loadingDialog = false
        this.$swal('การเชื่อมต่อผิดพลาด!', '', 'error')
      })
    },
    getUserByBLCP (blcp) {
      this.loading = true
      var source = {blcp_code: blcp}
      this.axios.post(process.env.API + '/get_userby_blcp', {data: source}).then((response) => {
        // console.log(response.data)
        var user = response.data
        // alert(user)
        if (user.length > 0) {
          this.user = user[0]
          this.firstName = this.user.firstname
          this.lastName = this.user.lastname
          this.citizenID = this.user.citizen_id
          this.address = this.user.address
          this.profilePic = this.profilePic + this.user.picture
          // this.loading = false
          this.axios.post(process.env.API + '/get_userCount_byID', {user_id: this.user.id}).then(resJoin => {
            var res = resJoin.data
            if (res !== 'fail') {
              this.totalJoin = res[0].count
            }
          })
          this.axios.post(process.env.API + '/checkuser_in_event', {blcp_code: blcp}).then((response) => {
            var user = response.data
            if (user === 'fail') {
              this.loading = false
              this.$swal('ไม่มีการประชุมในวันนี้!', 'กรุณาเพิ่มการประชุมในหน้า "จัดการการประชุม" ก่อน', 'error').then(result => {
                if (result) {
                  this.redirectTo('mobile-reg-home')
                }
              })
            } else if (user === null) {
              this.loading = false
              this.checkin = false
              this.checkout = true
            } else {
              this.loading = false
              var d
              if (user[0].checkin_datetime !== null) {
                this.checkin = true
                d = new Date(user[0].checkin_datetime)
                this.checkin_time = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' เวลา: ' +
                (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ' น. '
              }
              if (user[0].checkout_datetime !== null) {
                this.checkout = true
                d = new Date(user[0].checkout_datetime)
                this.checkout_time = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' เวลา: ' +
                (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ' น. '
              }
            }
          }).catch(error => {
            this.$swal('เกิดข้อผิดพลาด', '', 'error')
            console.log(error)
            this.loadingDialog = false
          })
        } else {
          this.alertDialog = true
          // this.$swal('BLCP CODE ไม่ถูกต้อง!', 'กรุณาลองใหม่', 'error')
          this.loading = false
        }
      }).catch(error => {
        console.log(error)
        this.loadingDialog = false
        this.$swal('การเชื่อมต่อผิดพลาด กรุณาลองใหม่ภายหลัง', error, 'error')
      })
    }
  },
  created () {
    this.getUserByBLCP(this.$route.query.blcp)
  }
}
</script>

<style lang="css" scoped>
.scanBtn {
  height: 70px;
}
.border {
  border-radius: 4.5em;
  padding: 3em;
}
</style>
