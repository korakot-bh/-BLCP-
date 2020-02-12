<template lang="html">
  <div>
    <v-toolbar class="nav" white app color="">
      <!-- <img src="@/assets/logo_blcp_h45.png"> -->
      <v-toolbar-side-icon @click.stop="drawer = !drawer" v-if="isLogin"></v-toolbar-side-icon>
      <!-- <div><img src="@/assets/logo_blcp.png" /></div> -->
      <img class="logo" style="" src="@/assets/blcp-logo.png">

      <!-- <span class="subheading font-weight-bold">BLCP POWER</span> -->
      <v-spacer></v-spacer>
      <div v-if="isLogin" class="body-2">    <!-- display user infomation -->
        <v-menu offset-y>
          <v-btn flat large class="px-2" slot="activator">
            <span>{{name}}</span>
            <span class="mr-1 ml-1">{{type}}</span>
            <v-avatar
            size="36px"
            class="white"
            >
              <img src="@/assets/logo.png" alt="alt">
            </v-avatar>
          </v-btn>
          <v-list class="pa-0">
            <v-list-tile @click="openEditPass()">
              <v-list-tile-title>
                <v-icon>lock</v-icon>
                <span class="ml-2">PASSWORD</span>
              </v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="logout()">
              <v-list-tile-title>
                <v-icon>exit_to_app</v-icon>
                <span class="ml-3">
                  LOGOUT
                </span>
              </v-list-tile-title>
            </v-list-tile>

          </v-list>
        </v-menu>
      </div>
    </v-toolbar>
    <v-navigation-drawer v-model="drawer" temporary white app fixed>
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar color="grey lighten-2">
            <!-- <span style="color:black;"></span> -->
            <v-icon color="black">home</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>MENU</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-list-tile v-for="item in items" :key="item.title" @click="redirectTo(item.link)" v-if="item.auth === type || type === '[ Admin ]'">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.title }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-dialog
      v-model="editPasswordDialog"
      persistent
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card class="footerbg">
        <v-card-title primary-title>
          <h2>แก้ไขรหัสผ่าน</h2>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                :error-messages="passwordErr"
                prepend-icon="lock"
                :append-icon="showPass ? 'visibility_off' : 'visibility'"
                :type="showPass ? 'text' : 'password'"
                @click:append="showPass = !showPass"
                v-model="oldPassword"
                name="oldPassword"
                label="รหัสผ่านเก่า"
                id="oldPassword"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                :error-messages="newPasswordErr"
                prepend-icon="lock"
                :append-icon="showPass1 ? 'visibility_off' : 'visibility'"
                :type="showPass1 ? 'text' : 'password'"
                @click:append="showPass1 = !showPass1"
                v-model="newPassword"
                name="newPassword"
                label="รหัสผ่านใหม่"
                id="newPassword"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                :error-messages="newPassword2Err"
                prepend-icon="lock"
                :append-icon="showPass2 ? 'visibility_off' : 'visibility'"
                :type="showPass2 ? 'text' : 'password'"
                @click:append="showPass2 = !showPass2"
                v-model="newPassword2"
                name="newPassword2"
                label="ยืนยันรหัสผ่านใหม่"
                id="newPassword2"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" style="border-radius:0.3em;" @click="editPasswordDialog = false" :disabled="passwordLoading">ยกเลิก</v-btn>
          <v-btn color="primary"  style="border-radius:0.3em;" :disabled="passwordLoading" @click="setNewPassword()">
            <div v-if="!passwordLoading">
              ยืนยัน
            </div>
            <div v-else>
              <v-progress-circular indeterminate></v-progress-circular>
            </div>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  created () {
    // alert(window.location.pathname)
    if (!this.$cookies.isKey('isLogin') || this.$cookies.get('isLogin') === 'false') {
      this.redirectTo('login')
    }
    if (this.$cookies.isKey('user')) {
      // console.log(this.$cookies.get('user'))
      this.user = JSON.parse(this.$cookies.get('user'))
      // alert(JSON.parse(this.displayUsername))
      this.name = this.user.firstname
      if (this.user.role === 0) {
        this.type = '[ Admin ]'
      } else {
        this.type = '[ Staff ]'
        var current = window.location.pathname
        if (current === '/manage-staff' || current === '/report' || current === '/manage-event') {
          this.redirectTo('reg')
        }
      }
    }
  },
  data () {
    return {
      passwordLoading: false,
      passwordErr: '',
      newPasswordErr: '',
      newPassword2Err: '',
      newPassword: '',
      newPassword2: '',
      oldPassword: '',
      showPass: false,
      showPass1: false,
      showPass2: false,
      editPasswordDialog: false,
      drawer: null,
      items: [
        // transfer_within_a_station
        {title: 'ลงทะเบียนด้วยคอมพิวเตอร์', icon: 'desktop_windows', link: '/reg', auth: '[ Staff ]'},
        {title: 'ลงทะเบียนด้วยมือถือ', icon: 'phone_iphone', link: '/mobile-reg-home', auth: '[ Staff ]'},
        // { divider: true },
        // { heading: 'EVENT' },
        {title: 'รายชื่อการประชุม / ผู้เข้าร่วมงาน', icon: 'toc', link: '/reg-list', auth: '[ Staff ]'},
        {title: 'รายงานการประชุม', icon: 'toc', link: '/report', auth: '[ Admin ]'},
        {title: 'จัดการการประชุม', icon: 'event', link: '/manage-event', auth: '[ Admin ]'},
        {title: 'จัดการพนักงาน', icon: 'person', link: '/manage-staff', auth: '[ Admin ]'}
      ],
      isLogin: this.checkLogin(),
      user: '',
      name: '',
      type: ''
    }
  },
  watch: {
    oldPassword () {
      this.passwordErr = ''
    },
    newPassword () {
      this.newPasswordErr = ''
    },
    newPassword2 () {
      this.newPassword2Err = ''
    }
  },
  methods: {
    openEditPass () {
      this.editPasswordDialog = true
      this.passwordErr = ''
      this.newPasswordErr = ''
      this.newPassword2Err = ''
      this.oldPassword = ''
      this.newPassword = ''
      this.newPassword2 = ''
    },
    setNewPassword () {
      if (this.newPassword !== this.newPassword2) {
        this.newPassword2Err = 'รหัสผ่านไม่ตรงกัน'
      } else if (this.newPassword === '' || this.newPassword === null) {
        this.newPasswordErr = 'โปรดระบุรหัสผ่านใหม่'
      } else if (this.password === '' || this.password === null) {
        this.passwordErr = 'โปรดระบุรหัสผ่าน'
      } else {
        this.passwordErr = ''
        this.newPasswordErr = ''
        this.newPassword2Err = ''
        this.passwordLoading = true
        this.newPasswordErr = ''
        this.axios.post(process.env.API + '/selfUpdate_password', {data: {id: this.user.id, password: this.oldPassword, new_password: this.newPassword}}).then(response => {
          if (response.data === 'success') {
            this.passwordLoading = false
            this.$swal('แก้ไขรหัสผ่านเรียบร้อยแล้ว', '', 'success')
            this.editPasswordDialog = false
          } else {
            this.passwordLoading = false
            this.passwordErr = 'รหัสผ่านไม่ถูกต้อง'
          }
        }).catch(er => {
          this.passwordLoading = false
          console.log(er)
          this.$swal('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'กรุณาลองใหม่ในภายหลัง', 'error')
          this.editPasswordDialog = false
        })
      }
    },
    checkLogin () {
      if (this.$cookies.isKey('isLogin')) {
        if (this.$cookies.get('isLogin') === 'true') {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    redirectTo (destination) {
      this.$root.redirectTo(destination)
    },
    logout () {
      if (this.$cookies.isKey('isLogin')) {
        this.$cookies.remove('isLogin')
        this.$cookies.remove('user')
        this.$root.redirectTo('login')
      }
    }
  }
}
</script>

<style lang="css" scoped>
.logo {
  width: 135px;
  height: 46px;
}
.nav {
  opacity: 0.9;
}
</style>
