<template lang="html">
  <div>
    <div v-if="!isEdit">
      <v-layout row wrap justify-center align-center>
        <v-card-title primary-title class="headline" >
          ข้อมูลผู้เข้าร่วมประชุม
        </v-card-title>
        <v-card-text>
          <v-layout row wrap justify-center>
            <v-avatar
            size="100"
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
          ชื่อ-นามสกุล : {{user.firstname}} {{user.lastname}}
        </v-layout>
      </v-card-text>
      <v-card-text>
        <v-layout row wrap justify-center>
          ที่อยู่ตามบัตรประชาชน: {{user.address}}
        </v-layout>
      </v-card-text>
      <v-card-text>
        <v-layout row wrap justify-center>
          <div v-if="user.received_card !== 1">
            สถานะบัตร:
            <span  class="red--text ml-1">ยังไม่ได้รับ</span>
            <v-icon v-if="!cardLoading" @click="manageCard(true)" small class="ml-1">edit</v-icon>
            <v-progress-circular v-else size="20" color="primary" indeterminate></v-progress-circular>
            <!-- <v-btn color="primary" flat>รับบัตร</v-btn> -->
          </div>
          <div v-else>
            สถานะบัตร:
            <span class="green--text ml-1">ได้รับแล้ว</span>
            <v-icon v-if="!cardLoading" @click="manageCard(false)" small class="ml-1">edit</v-icon>
            <v-progress-circular v-else size="20" color="primary" indeterminate></v-progress-circular>
            <!-- <h6 id="edit" @click="manageCard()" class="ml-1 indigo--text" style="display: inline;"><u><v-icon small>edit</v-icon> </u></h6> -->
          </div>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-btn style="border-radius: 0.3em" dark color="teal lighten-1" @click="scan()"><v-icon>camera_alt</v-icon>&nbsp;แสกนใหม่</v-btn>
      </v-card-actions>
      <v-spacer></v-spacer>
      <v-card-actions>
        <v-btn style="border-radius: 0.3em"  dark color="blue-grey" @click="editUser()"><v-icon small class="mr-2">edit</v-icon>Edit user</v-btn>
        <v-btn style="border-radius: 0.3em"  dark color="primary" @click="confirm()">next</v-btn>
        <br><br><br>
      </v-card-actions>
      <v-card-actions>
        <v-btn style="border-radius: 0.3em" @click="closed()" color="red" dark>close</v-btn>
      </v-card-actions>
    </v-layout>
  </div>
  <div v-if="isEdit">
    <edit-form/>
  </div>
</div>
</template>

<script>
import EditForm from '@/components/checkin/EditForm'
export default {
  props: ['user'],
  components: {
    'edit-form': EditForm
  },
  data () {
    return {
      cardLoading: false,
      profilePic: process.env.API + '/getImg/',
      isEdit: false,
      checkinDialog: false,
      checkoutDialog: false,
      payDialog: false
    }
  },
  methods: {
    manageCard (recievedCard) {
      var text = ''
      if (recievedCard) {
        text = 'ต้องการเปลี่ยนสถานะเป็น "ได้รับบัตร" หรือไม่?'
      } else {
        text = 'ต้องการเปลี่ยนสถานะเป็น "ยังไม่ได้รับบัตร" หรือไม่?'
      }
      this.$swal({
        title: 'แก้ไขสถานะบัตรหรือไม่ ?',
        text: text,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        // reverseButtons: true,
        cancelButtonText: 'ยกเลิก',
        confirmButtonText: 'ยืนยัน'
      }).then(result => {
        if (result) {
          var data
          if (recievedCard) {
            this.cardLoading = true
            data = {citizen_id: this.user.citizen_id, received_card: 1}
            this.axios.post(process.env.API + '/receive_card', {source: data}).then(res => {
              this.$swal('แก้ไขสำเร็จ', '', 'success')
              this.$emit('showRegInfo', this.user.blcp_code)
              this.cardLoading = false
            }).catch(er => {
              console.log(er)
              this.$swal('การเชื่อมต่อผิดพลาด!', 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิฟเวอร์ กรุณาลองใหม่', 'error')
              this.cardLoading = false
            })
          } else {
            this.cardLoading = true
            data = {citizen_id: this.user.citizen_id, received_card: 0}
            this.axios.post(process.env.API + '/receive_card', {source: data}).then(res => {
              this.$swal('แก้ไขสำเร็จ', '', 'success')
              this.$emit('showRegInfo', this.user.blcp_code)
              this.cardLoading = false
            }).catch(er => {
              console.log(er)
              this.$swal('การเชื่อมต่อผิดพลาด!', 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิฟเวอร์ กรุณาลองใหม่', 'error')
              this.cardLoading = false
            })
          }
        }
      })
    },
    confirm () {
      // this.checkin = true
      // alert(this.user.blcp_code)
      this.$emit('getBLCP', this.user.blcp_code)
    },
    closed () {
      this.$emit('closed')
    },
    scan (event) {
      this.$emit('scan')
    },
    editUser () {
      // alert(this.blcpCode)
      // this.isEdit = true
      // this.$emit('editUser')
      this.$emit('editUser', this.user.blcp_code)
    }
  }
}
</script>

<style lang="css" scoped>
#edit:hover {
  cursor: pointer;
}
</style>
