<template lang="html">
  <v-app>
    <v-card class="mobile-bg">
      <v-layout row wrap justify-center fill-height>
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
            <v-card width="100%" height="10%" :class="cardClass">
              <v-layout row wrap fill-height justify-center align-center>
                ลงทะเบียนด้วยคิวอาร์โค้ดบนบัตร
              </v-layout>
            </v-card>
            <v-card width="100%" height="60%" :class="cardClass">
              <v-layout row wrap justify-center fill-height align-center>
                <v-card-text>
                  <qrcode-reader @decode="onDecode" :paused="pause"
                  :video-constraints="{
                      facingMode: { ideal: 'environment' }
                    }" class="video">
                  </qrcode-reader>
                </v-card-text>
              </v-layout>
            </v-card>
            <v-card width="100%" height="10%" :class="cardClass">
              <v-layout row wrap fill-height justify-center align-center>
                SCAN HERE
              </v-layout>
            </v-card>
            <v-card width="100%" height="10%" :class="cardClass">
              <v-layout row wrap fill-height justify-center align-center>

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
      pause: false,
      blcp: '',
      cardClass: 'font-weight-bold transparent black--text subheading elevation-0'
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
    onDecode (content) {
      this.pause = true
      this.blcp = content
      // this.blcp = content.detail[0]
      this.redirectTo('mobile-scan-info?blcp=' + content)
    },
    redirectTo (des) {
      this.$root.redirectTo(des)
    }
  }
}
</script>

<style lang="css" scoped>
.video {
  margin: 0;
  padding: 0;
}
</style>
