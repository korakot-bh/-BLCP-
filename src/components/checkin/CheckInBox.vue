<template lang="html">
  <v-card class="footerbg">
    <v-layout row wrap justify-center align-center>
      <v-card-title primary-title class="headline">
        ลงชื่อผู้เข้าร่วมประชุม
      </v-card-title>
      <v-card-text>
        <v-layout row wrap justify-center>
          <v-avatar
          size="150"
          class="blue lighten-2"
          >
          <img :src="profilePic + user.picture" alt="alt">
        </v-avatar>
        </v-layout>
    </v-card-text>
    <!-- <v-card-text>
      <v-layout row wrap justify-center>
        BLCP Code: {{blcpCode}}
      </v-layout>
    </v-card-text> -->
    <v-card-text>
      <v-layout row wrap justify-center>
        รหัสประจำตัวประชาชน: {{user.citizen_id}}
      </v-layout>
    </v-card-text>
    <v-card-text>
      <v-layout row wrap justify-center>
        ชื่อ: {{user.firstname}} {{user.lastname}}
      </v-layout>
    </v-card-text>
    <v-card-text>
      <v-layout row wrap justify-center>
        วัน/เวลาเข้าร่วมงาน: {{user.checkin_datetime}}
        <br>
        วัน/เวลาออกจากงาน: {{user.checkout_datetime}}
      </v-layout>
    </v-card-text>
    <v-card-text v-if="user.received_money !== null">
      <v-layout row wrap justify-center >
        สถานะการจ่ายเงิน:
        <span v-if="user.received_money === 0" class="green--text ml-1">ได้รับเงินแล้ว</span>
        <span v-else class="red--text ml-1">ไม่ได้รับเงิน</span>
        <div v-if="!payLoading">
          <v-icon v-if="user.received_money === 0" class="ml-1" small @click="managePayment(false)">edit</v-icon>
          <v-icon v-else class="ml-1" small @click="managePayment(true)">edit</v-icon>
        </div>
        <div v-else>
          <v-progress-circular size="20" indeterminate class="ml-1"></v-progress-circular>
        </div>
      </v-layout>
    </v-card-text>
    <v-card-text v-if="user.received_card !== 1">
      <v-layout row wrap justify-center>
        <v-spacer></v-spacer>
        <v-checkbox label="ได้รับบัตรแล้ว" v-model="recievedCard" :value="true"></v-checkbox>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-btn style="border-radius: 0.3em" @click="close()" color="red" dark>close</v-btn>
    </v-card-actions>
    <v-spacer></v-spacer>
    <v-card-actions>
      <v-btn style="border-radius: 0.3em" color="green" :disabled="checkinBtn" @click="openCheckin()" class="white--text">check-in</v-btn>
      <v-btn style="border-radius: 0.3em" color="indigo" :disabled="checkoutBtn" @click="openCheckout()" class="white--text">check-out / pay</v-btn>
    </v-card-actions>
  </v-layout>
  <v-dialog v-model="checkinDialog" persistent max-width="400">
    <v-card class="footerbg">
      <v-card-title class="headline">ยืนยันลงชื่อเข้าร่วมประชุม?</v-card-title>
      <v-card-text class="subheading">
        <span>ต้องการลงชื่อเข้าร่วมประชุมให้กับ</span>
        <v-spacer></v-spacer>
        <span>คุณ{{user.firstname}} {{user.lastname}}</span>
        <v-spacer></v-spacer>
        <span>ณ เวลา {{checkTime}} น. {{checkDate}}</span>
        <v-spacer></v-spacer>
        <span></span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn style="border-radius: 0.3em" color="grey" flat @click="checkinDialog = false">Cancel</v-btn>
        <v-btn style="border-radius: 0.3em" color="green darken-1" dark @click.native="checkin()">Check-in</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="checkinInfoDialog" persistent max-width="400">
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
        <v-btn style="border-radius: 0.3em" color="green darken-1" flat @click.native="close()">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog  v-model="checkoutDialog" persistent max-width="400">
    <v-card class="footerbg">
      <v-card-title class="headline">ยืนยันลงชื่อออกการประชุม?</v-card-title>
      <v-card-text class="subheading">
        <span>ต้องการลงชื่อออกประชุมให้กับ</span>
        <v-spacer></v-spacer>
        <span>คุณ{{user.firstname}} {{user.lastname}}</span>
        <v-spacer></v-spacer>
        <span>ณ เวลา {{checkTime}} น {{checkDate}}</span>
        <v-spacer></v-spacer>
        <span></span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn style="border-radius: 0.3em" color="error" dark @click.native="checkoutDialog = false">Cancel</v-btn>
        <v-btn style="border-radius: 0.3em" color="indigo" dark @click.native="checkout()">Check-out</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="paymentDialog" persistent max-width="400">
    <v-card style="border-radius: 0.3em">
      <v-card-title class="headline">จ่ายเงินให้กับผู้เข้าประชุม?</v-card-title>
      <v-card-text class="subheading">
        <span>คุณ{{user.firstname}} {{user.lastname}}</span>
        <v-spacer></v-spacer>
        <span>เข้าร่วมประชุม: 2 ครั้ง</span>
        <v-spacer></v-spacer>
        <span>วันที่: {{checkDate}}</span>
        <v-spacer></v-spacer>
        <span>เวลาเข้า {{checkoutUser.checkin_datetime}}</span>
        <v-spacer></v-spacer>
        <span>เวลาออก {{checkoutUser.checkout_datetime}}</span>
        <v-spacer></v-spacer>
        <span>เป็นเวลา {{checkoutUser.times}} (ชั่วโมง:นาที:วินาที)</span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn style="border-radius: 0.3em" color="red" dark @click.native="payment(1)">NOT</v-btn>
        <v-btn style="border-radius: 0.3em" color="indigo" dark @click.native="payment(0)">PAY</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="paymentInfoDialog" persistent max-width="400">
    <v-card style="border-radius: 0.3em">
      <v-alert class="subheading" type="success" :value="true">
        Check-out Success
      </v-alert>
      <v-card-text class="subheading">
        <span>ลงชื่อออกประชุมให้กับ</span>
        <v-spacer></v-spacer>
        <span>คุณ{{checkoutUser.firstname}} {{checkoutUser.lastname}}</span>
        <v-spacer></v-spacer>
        <span>ณ เวลา {{checkoutUser.checkout_datetime}}</span>
        <v-spacer></v-spacer>
        <span>สถานะการจ่ายเงิน :</span>
        <span class="green--text" v-if="pay"> จ่ายแล้ว </span>
        <span class="red--text" v-else> ไม่จ่าย</span>
        <v-spacer></v-spacer>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn style="border-radius: 0.3em" color="green darken-1" flat @click.native="close()">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="loading" persistent max-width="400">
    <v-card style="border-radius: 0.3em">
      <v-card-text>
        <v-layout row wrap justify-center>
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
export default {
  props: ['user', 'type', 'recievedCard'],
  data () {
    return {
      // checkinBtn: false,
      // checkoutBtn: false,
      payLoading: false,
      profilePic: process.env.API + '/getImg/',
      totalReg: '',
      yourReg: '',
      paymentInfoDialog: false,
      pay: false,
      checkoutUser: '',
      loading: false,
      checkTime: '',
      checkDate: '',
      firstName: '',
      lastName: '',
      checkinDialog: false,
      checkinInfoDialog: false,
      checkoutDialog: false,
      paymentDialog: false

    }
  },
  computed: {
    checkinBtn () {
      // alert(this.user.citizen_id)
      if (this.user.checkin_datetime === this.user.undefineValue) {
        return false
      } else {
        return true
      }
    },
    checkoutBtn () {
      if (this.user.checkin_datetime !== this.user.undefineValue && this.user.checkout_datetime === this.user.undefineValue) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    managePayment (receivedMoney) {
      var text = ''
      if (receivedMoney) {
        text = 'ยืนยันเพื่อเปลี่ยนสถานะเป็น "ได้รับเงิน"'
      } else {
        text = 'ยืนยันเพื่อเปลี่ยนสถานะเป็น "ยังไม่ได้รับเงิน"'
      }
      this.$swal({
        title: 'แก้ไขสถานะการจ่ายเงินหรือไม่ ?',
        text: text,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'ยกเลิก',
        confirmButtonText: 'ยืนยัน'
      }).then(result => {
        if (receivedMoney) {
          receivedMoney = 0
        } else {
          receivedMoney = 1
        }
        if (result) {
          this.payLoading = true
          var data = {manager_id: JSON.parse(this.$cookies.get('user')).id, blcpcode: this.user.blcp_code, received_money: receivedMoney}
          this.axios.post(process.env.API + '/received_money', {source: data}).then(response => {
            if (response.data === 'success') {
              this.payLoading = false
              this.$swal('แก้ไขสำเร็จแล้ว', '', 'success')
              this.$emit('showCheckinBox', this.user.blcp_code)
            } else {
              this.payLoading = false
              this.$swal('แก้ไขไม่สำเร็จ', 'แก้ไขผิดพลาด กรุณาลองใหม่ภายหลัง', 'error')
            }
          }).catch(er => {
            console.log(er)
            this.payLoading = false
            this.$swal('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'กรุณาลองใหม่ในภายหลัง', 'error')
          })
        }
      })
    },
    openCheckout () {
      var date = new Date()
      this.checkDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + (date.getFullYear() + 543)
      this.checkTime = date.getHours() + ':' + date.getMinutes()
      this.checkoutDialog = true
    },
    openCheckin () {
      var date = new Date()
      this.checkDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + (date.getFullYear() + 543)
      this.checkTime = date.getHours() + ':' + date.getMinutes()
      this.checkinDialog = true
    },
    close () {
      this.$emit('close')
    },
    checkin () {
      if (this.recievedCard) {
        var t = {citizen_id: this.user.citizen_id, received_card: 1}
        this.axios.post(process.env.API + '/receive_card', {source: t})
      }
      this.loading = true
      this.checkinDialog = false
      var manager = JSON.parse(this.$cookies.get('user'))
      var s = {manager_id: manager.id, blcpcode: this.user.blcp_code, user_fullname: (this.user.firstname + ' ' + this.user.lastname), manager_fullname: (manager.firstname + ' ' + manager.lastname), type: this.type}
      this.axios.post(process.env.API + '/checkin', {source: s}).then((response) => {
        var res = response.data
        // console.log(res)
        if (res === 'fail') {
          this.loading = false
          this.checkinInfoDialog = true
          this.$swal('ไม่มีการประชุมในวันนี้!', 'กรุณาเพิ่มการประชุมในหน้า "จัดการการประชุม" ก่อน', 'error')
        } else {
          this.axios.post(process.env.API + '/get_regCount_total').then(totalRes => {
            // console.log(totalRes);
            if (totalRes.data !== 'fail') {
              this.totalReg = totalRes.data[0].count
            }
            this.axios.post(process.env.API + '/get_regCount_byManagerID', {manager_id: manager.id}).then(managerRes => {
              this.yourReg = managerRes.data[0].count
              this.loading = false
              this.checkinInfoDialog = true
            })
          })
        }
      }).catch(error => {
        console.log(error)
        this.$swal('การเชื่อมต่อผิดพลาด!', '', 'error')
      })
    },
    checkout () {
      if (this.recievedCard) {
        var t = {citizen_id: this.user.citizen_id, received_card: 1}
        this.axios.post(process.env.API + '/receive_card', {source: t})
      }
      this.loading = true
      this.checkoutDialog = false
      var manager = JSON.parse(this.$cookies.get('user'))
      var s = {manager_id: manager.id, blcpcode: this.user.blcp_code, manager_fullname: (manager.firstname + ' ' + manager.lastname)}
      this.axios.post(process.env.API + '/checkout', {source: s}).then((response) => {
        var res = response.data
        // console.log(res)
        if (res === 'fail') {
          this.loading = false
          this.$swal('ไม่มีการประชุมในวันนี้!', 'กรุณาเพิ่มการประชุมในหน้า "จัดการการประชุม" ก่อน', 'error')
          this.checkoutDialog = true
        } else {
          // console.log(res)
          this.checkoutUser = res[0]
          var d = new Date(this.checkoutUser.checkin_datetime)
          this.checkoutUser.checkin_datetime = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ' น.'
          d = new Date(this.checkoutUser.checkout_datetime)
          this.checkoutUser.checkout_datetime = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ' น.'
          // this.checkoutUser.checkin_datetime = this.checkoutUser.checkin_datetime.replace(' ', ' เวลา: ')
          // this.checkoutUser.checkin_datetime = this.checkoutUser.checkin_datetime + ' น.'
          // this.checkoutUser.checkout_datetime = this.checkoutUser.checkout_datetime.replace(' ', ' เวลา: ')
          // this.checkoutUser.checkout_datetime = this.checkoutUser.checkout_datetime + ' น.'
          this.loading = false
          this.paymentDialog = true
        }
      }).catch(error => {
        console.log(error)
        this.$swal('การเชื่อมต่อผิดพลาด!', '', 'error')
      })
    },
    payment (pay) {
      if (pay === 0) {
        this.pay = true
      } else {
        this.pay = false
      }
      this.loading = true
      this.paymentDialog = false
      var s = {manager_id: (JSON.parse(this.$cookies.get('user'))).id, blcpcode: this.user.blcp_code, received_money: pay}
      this.axios.post(process.env.API + '/received_money', {source: s}).then((response) => {
        var res = response.data
        // console.log(res)
        if (res === 'fail') {
          this.loading = false
          this.paymentInfoDialog = true
          this.$swal('ไม่พบผู้เข้าประชุม!', 'กรุณาลองใหม่ในภายหลัง', 'error')
        } else {
          this.loading = false
          this.paymentInfoDialog = true
        }
      }).catch(error => {
        console.log(error)
        this.$swal('การเชื่อมต่อผิดพลาด!', '', 'error')
      })
    },
    scan () {
      this.$emit('scan')
    }
  }
}
</script>

<style lang="css">
</style>
