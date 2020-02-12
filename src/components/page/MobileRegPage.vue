<template lang="html">
  <v-app >
    <v-card class="mobile-bg">
      <v-layout row wrap justify-center fill-height text-xs-center>
        <v-card width="100%" class="mobile-card">
          <v-layout row wrap fill-height justify-center align-center>
            <v-card width="100%" height="10%" class="font-weight-bold white--text title" color="blue-grey darken-2">
              <v-layout row wrap fill-height justify-center align-center>
                <v-spacer></v-spacer>
                <span>ระบบลงทะเบียนด้วยมือถือ</span>
                <v-spacer></v-spacer>
                <v-icon class="mr-2" @click="logout()" color="white">exit_to_app</v-icon>
              </v-layout>
            </v-card>
            <!-- <v-card width="100%" height="10%" :class="cardClass">
              <v-layout row wrap fill-height justify-center align-center>

              </v-layout>
            </v-card> -->
            <v-card width="80%" height="90%" :class="cardClass">
              <v-layout row wrap justify-center fill-height align-center>
                <v-card-text class="pa-0">
                  <span>ยินดีต้อนรับ</span>
                  <v-spacer></v-spacer>
                  <v-spacer></v-spacer>
                  <span>คุณ {{staffName}} {{staffLast}}</span>
                  <v-spacer></v-spacer>
                  <span>USER TYPE: {{staffRole}}</span>
                </v-card-text>
                <v-card-text class="pa-0">
                  <v-btn style="border-radius: 0.3em" dark color="green" class="scanBtn title" @click="redirectTo('mobile-scan')"><v-icon large>camera_alt</v-icon>&nbsp;SCAN QR CODE</v-btn>
                </v-card-text>
                <v-card style="border-radius: 0.3em" width="90%">
                  <v-card-text>
                    <v-autocomplete @focus="clearUsers()" :search-input.sync="search" color="blue-grey" v-model="searchUser" append-outer-icon="search" :items="users" item-text="displayInfo" item-value="userInfo" label="ค้นหา ชื่อ - นามสกุล / รหัสประชาชน " no-data-text="ไม่พบข้อมูล">
                    </v-autocomplete>
                    <v-btn style="border-radius: 0.3em" color="blue" class="white--text" :disabled="searchBtn" @click="redirectTo('/mobile-scan-info?blcp=' + searchUser.blcp)">ค้นหา</v-btn>
                  </v-card-text>
                </v-card>
                <v-card-text class="pa-0">
                  <span>การประชุม: {{eventName}}</span>
                  <v-spacer></v-spacer><br>
                  <span>รายชื่อในฐานข้อมูลทั้งหมด: {{totalReg}} คน</span>
                  <v-spacer></v-spacer>
                  <span>ผู้เข้าร่วมประชุมปัจจุบัน: {{nowReg}} คน</span>
                  <v-spacer></v-spacer>
                  <span>ลงทะเบียนกับคุณ: {{yourReg}} คน</span>
                </v-card-text>
              </v-layout>
            </v-card>
          </v-layout>
        </v-card>
      </v-layout>
    </v-card>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      eventName: '-',
      totalReg: 0,
      nowReg: 0,
      yourReg: 0,
      search: '',
      staffID: '',
      staffName: '',
      staffLast: '',
      staffRole: '',
      searching: false,
      searchBtn: false,
      cardClass: 'font-weight-bold transparent black--text subheading elevation-0',
      searchUser: null,
      users: []
    }
  },
  created () {
    var staff = JSON.parse(this.$cookies.get('user'))
    this.staffID = staff.id
    this.staffName = staff.firstname
    this.staffLast = staff.lastname
    if (staff.role === 0) {
      this.staffRole = 'Admin'
    } else {
      this.staffRole = 'Staff'
    }
    this.getTotalUser()
    this.getNowReg()
    this.getYourReg()
    this.getEvent()
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
  },
  mounted () {
    this.$nextTick(function () {
      window.setInterval(() => {
        this.getNowReg()
        this.getYourReg()
      }, 10000)
    })
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
    getTotalUser () {
      this.axios.post(process.env.API + '/get_count_TotalUser').then(res => {
        if (res.data.length > 0) {
          this.totalReg = res.data[0].count
        }
      })
    },
    getEvent () {
      this.axios.post(process.env.API + '/getTodayEvent').then(res => {
        if (res.data !== 'fail') {
          this.eventName = res.data[0].name_event
        }
      })
    },
    getNowReg () {
      this.axios.post(process.env.API + '/get_regCount_total').then(res => {
        if (res.data !== 'fail') {
          this.nowReg = res.data[0].count
        }
      })
    },
    getYourReg () {
      this.axios.post(process.env.API + '/get_regCount_byManagerID', {manager_id: this.staffID}).then(res => {
        if (res.data !== 'fail') {
          this.yourReg = res.data[0].count
        }
      })
    },
    clearUsers () {
      this.users = []
    },
    redirectTo (des) {
      this.$root.redirectTo(des)
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
  }
}
</script>

<style lang="css" scoped>
.scanBtn {
  height: 70px;
}

</style>
