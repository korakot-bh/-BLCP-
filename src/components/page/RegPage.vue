<template lang="html">
  <div class="bg">
    <my-nav/>
    <v-content>
      <v-container fluid grid-list-xl text-xs-center >
        <v-layout row wrap fill-height justify-center>
          <v-flex xs12 md8 sm10>
            <v-card class="elevation-12 footerbg">
            <v-card-text class="display-1 white">
                ลงทะเบียนผู้เข้าร่วมการประชุม
              </v-card-text>
              <v-layout row wrap justify-center>
                <v-flex xs12>
                  <div>
                    <v-btn style="border-radius: 0.3em" title="แสกนคิวอาร์โค้ดเพื่อเข้า-ออกการประชุม หรือรับเงิน" @click="qrDialog = true, stopScanQR = false, dialogSize = '500px'" class="regBtn subheading" color="primary" dark>
                      <v-icon large>portrait</v-icon>
                      &nbsp;ลงทะเบียนด้วยคิวอาร์โค้ด
                    </v-btn>
                    <v-btn style="border-radius: 0.3em" title="*กรณีที่ยังไม่เคยลงทะเบียนมาก่อน" @click="newRegDialog = true, regStep = 1" slot="activator" class="regBtn subheading" dark color="green">
                      <v-icon large>person_add</v-icon>
                      &nbsp;ลงทะเบียนใหม่
                    </v-btn>
                    <v-dialog max-width="500px" persistent v-model="loadingDialog" :overlay="false" transition="dialog-transition" >
                      <v-card>
                        <v-card-text>
                          <v-layout row wrap justify-center>
                            <v-progress-circular indeterminate :size="100"></v-progress-circular>
                          </v-layout>
                        </v-card-text>
                        <v-card-text class="headline">
                          <v-layout row wrap justify-center>
                            Loading..
                          </v-layout>
                        </v-card-text>
                      </v-card>
                    </v-dialog>

                    <v-dialog max-width="1100px" persistent v-model="newRegDialog" :overlay="false" transition="dialog-transition" >
                      <v-card class="elevation-0 footerbg">
                        <new-reg-form @closed="newRegDialog=false" @newReg="regType = 'ลงทะเบียนใหม่'" @showCheckinBox="openCheckInBox($event)" :clear="true" :regisStep="regStep" @nextTab="regStep++" @prevTab="regStep--"/>
                      </v-card>
                    </v-dialog>

                    <v-dialog  :max-width="dialogSize" persistent v-model="qrDialog" :overlay="false" transition="dialog-transition" >
                      <v-card class="footerbgqr elevation-0">
                        <v-card-text v-if="qrDialog">
                          <qr-checkin @closed="qrDialog=false" @qrReg="regType = 'ลงทะเบียนด้วย QR Code'" @showUserInfo="openRegInfo($event)" :stop="stopScanQR" :user="user" @editUser="editUser($event)" @showCheckinBox="openCheckInBox($event)"/>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                    <v-dialog max-width="500px" persistent v-model="checkinDialog" :overlay="false" transition="dialog-transition" >
                      <checkin-box @showCheckinBox="openCheckInBox($event)" :recievedCard="false" @closed="checkinDialog=false" :type="regType" :user="checkinUser" @scan="checkinDialog = false, qrDialog = true, stopScanQR = false" @close="checkinDialog = false"/>
                    </v-dialog>
                  </div>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-card class="elevation-0 white-08opa">
                    <v-card-text>
                      <span class="headline">ค้นหาผู้เข้าร่วมประชุม</span>
                      <v-autocomplete no-data-text="ไม่พบข้อมูล" @closed="checkinDialog=false"  @focus="clearUsers()" :search-input.sync="search" :loading="searching" color="blue-grey" v-model="searchUser" append-outer-icon="search" :items="users" item-text="displayInfo" item-value="userInfo" label="ค้นหา ชื่อ - นามสกุล / รหัสประชาชน ">
                      </v-autocomplete>
                      <v-btn style="border-radius: 0.3em" dark color="blue-grey" @click="openRegInfo(searchUser.blcp), regType = 'ลืมบัตร'">ค้นหา</v-btn>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <my-footer/>
  </div>
</template>

<script>
import Navbar from '@/components/index/Navbar'
import Footer from '@/components/index/Footer'
import NewRegForm from '@/components/checkin/NewRegisterForm'
// import UserList from '@/components/checkin/UserList'
import QRCheckIn from '@/components/checkin/QRCheckIn'
import CheckIn from '@/components/checkin/CheckInBox'
// import EditForm from '@/components/checkin/EditForm'
export default {
  components: {
    'my-nav': Navbar,
    'my-footer': Footer,
    'new-reg-form': NewRegForm,
    // 'user-list': UserList,
    'qr-checkin': QRCheckIn,
    'checkin-box': CheckIn
    // 'edit-form': EditForm
  },
  data () {
    return {
      regType: '',
      search: '',
      searching: false,
      dialogSize: '500px',
      loadingDialog: false,
      user: null,
      checkinUser: null,
      newRegDialog: false,
      qrDialog: false,
      regStep: 1,
      editStep: 1,
      checkinDialog: false,
      blcp: null,
      editDialog: false,
      searchUser: null,
      stopScanQR: false,
      users: []
    }
  },
  methods: {
    openRegInfo (blcp) {
      // console.log(this.qrDialog + ' ' + this.checkinDialog)
      this.qrDialog = false
      this.blcp = blcp
      this.dialogSize = '500px'
      this.loadingDialog = true
      this.loading = true
      var source = {blcp_code: blcp}
      this.axios.post(process.env.API + '/get_userby_blcp', {data: source}).then((response) => {
        // console.log(response.data)
        var user = response.data
        // alert(user)
        if (user.length > 0) {
          this.user = user[0]
          this.stopScanQR = true
          this.searchUser = null
          this.loadingDialog = false
          this.qrDialog = true
        } else {
          this.$swal('BLCP CODE ไม่ถูกต้อง!', '', 'error')
          this.loadingDialog = false
        }
      }).catch(error => {
        console.log(error)
        this.loadingDialog = false
        this.$swal('การเชื่อมต่อผิดพลาด กรุณาลองใหม่ภายหลัง', error, 'error')
      })
    },
    openCheckInBox (blcp) {
      this.loadingDialog = true
      this.checkinUser = null
      this.blcp = blcp
      this.getUser(blcp)
      this.axios.post(process.env.API + '/checkuser_in_event', {blcp_code: blcp}).then((response) => {
        var user = response.data
        if (user === 'fail') {
          this.loadingDialog = false
          this.qrDialog = false
          this.editDialog = false
          this.newRegDialog = false
          this.$swal('ไม่มีการประชุมในวันนี้!', 'กรุณาเพิ่มการประชุมในหน้า "จัดการการประชุม" ก่อน', 'error')
        } else if (user === null) {
          this.loadingDialog = false
          this.qrDialog = false
          this.editDialog = false
          this.newRegDialog = false
          this.checkinDialog = true
          this.checkinUser = this.user
          this.checkinUser.received_money = null
        } else {
          this.qrDialog = false
          this.editDialog = false
          this.newRegDialog = false
          this.checkinDialog = true
          this.loadingDialog = false
          this.checkinUser = this.user
          this.checkinUser.received_money = user[0].received_money
          var d
          if (user[0].checkin_datetime !== null) {
            d = new Date(user[0].checkin_datetime)
            this.checkinUser.checkin_datetime = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' เวลา: ' +
            (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ' น. '
          }
          if (user[0].checkout_datetime !== null) {
            d = new Date(user[0].checkout_datetime)
            this.checkinUser.checkout_datetime = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' เวลา: ' +
            (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ' น. '
          }
        }
      }).catch(error => {
        this.$swal('เกิดข้อผิดพลาด', '', 'error')
        console.log(error)
        this.loadingDialog = false
      })

      // alert(blcp)
    },
    editUser (blcp) {
      this.dialogSize = '1100px'
      // this.editStep = 1
      // this.qrDialog = false
      this.blcp = blcp
      // this.editDialog = true
    },
    clearUsers () {
      this.users = []
    },
    getUser (blcp) {
      var source = {blcp_code: blcp}
      this.axios.post(process.env.API + '/get_userby_blcp', {data: source}).then((response) => {
        var user = response.data
        if (user.length > 0) {
          this.user = user[0]
        }
      })
    },
    getUserBySearch () {
      this.searching = true
      var text = '%' + this.search + '%'
      this.axios.post(process.env.API + '/search_user', {search: text}).then((response) => {
        // console.log(response.data)
        var user = response.data
        if (user.length > 0) {
          this.users = []
          for (var i = 0; i < user.length; i++) {
            var temp = {
              displayInfo: '',
              userInfo: {
                blcp: '',
                name: '',
                last: '',
                citizen_id: ''
              }
            }
            temp.displayInfo = user[i].firstname + ' ' + user[i].lastname + ' / ' + user[i].citizen_id
            temp.userInfo.blcp = user[i].blcp_code
            temp.userInfo.name = user[i].firstname
            temp.userInfo.last = user[i].lastname
            temp.userInfo.citizen_id = user[i].citizen_id
            this.users.push(temp)
          }
          this.searching = false
        } else {
          this.searching = false
        }
      }).catch(error => {
        console.log(error)
        this.$swal('การเชื่อมต่อผิดพลาด!', 'กรุณาลองอีกครั้ง', 'error')
        this.searching = false
      })
    }
  },
  watch: {
    search () {
      if (this.search !== null) {
        if (this.search.length > 0) {
          this.getUserBySearch()
        } else {
          this.users = []
        }
      }
    }
  }
}
</script>

<style lang="css" scoped>
.fullOpa {
  opacity: 1.0;
}
.footerbgqr {
  opacity: 1;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 1.5em;
}
</style>
