<template lang="html">
  <div>
    <v-card v-if="!isStop" class="elevation-0">
      <v-card-text v-if="!loading">
        <qrcode-reader @decode="onDecode" :paused="pause"></qrcode-reader>
          <br>
          <v-layout row wrap align-center justify-center>
          <v-btn style="border-radius: 0.3em"  color="red" dark  @click="closed()">Close</v-btn>
          </v-layout>
      </v-card-text>
      <v-card-text v-else class="headline">
        <v-layout row wrap justify-center>
          <v-progress-circular indeterminate :size="70"></v-progress-circular>
        </v-layout>
        <v-layout row wrap justify-center>
          <span>Loading</span>
        </v-layout>
      </v-card-text>
    </v-card>

    <v-card class="footerbg elevation-0" v-else>
    <reg-info @showRegInfo="showRegInfo($event)" @closed="closed()" v-if="!isEdit" :user="inUser" @scan="scan()" @getBLCP="showCheckinBox($event)" @editUser="editUser($event)"/>
    <v-stepper v-else v-model="editStep" class="elevation-0">
      <v-stepper-header class="elevation-0" app>
        <v-stepper-step step="1" :complete="editStep > 1">กรอกข้อมูลส่วนตัว</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2" :complete="editStep > 2">ถ่ายรูป</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3">ปริ้นบัตรประจำตัว</v-stepper-step>
      </v-stepper-header>
      <v-layout row wrap text-xs-center>
        <v-flex xs12 sm10 offset-sm1 md10>
          <v-stepper-content class="elevation-0" step="1">
            <v-card>
              <v-card-title primary-title class="headline">
                กรอกข้อมูลส่วนตัว
                <v-btn style="border-radius: 0.3em" color="primary" @click="openCam('card')"><v-icon>camera_alt</v-icon>&nbsp;ลงทะเบียนด่วน !</v-btn>
              </v-card-title>
              <v-card-media
              contain
              height="300px"
              :src="cardCaptured"
              v-show="quickRegImg"
              title="สามารถถ่ายใหม่ด้วยการกด'ลงทะเบียนด่วน'อีกครั้ง"
              >
            </v-card-media>
          </v-card-media>
            <v-card-text>
              <form class="" action="" method="post">
                <v-layout row wrap align-center justify-space-around>
                  <v-flex xs12 md1>
                    <v-select
                    :items="prefix"
                    v-model="selectPrefixName"
                    label="คำนำหน้า"
                    ref="prefixName"
                    ></v-select>
                  </v-flex>

                  <v-flex xs12 md3>
                    <v-text-field :error-messages="firstNameErrMsg" name="firstName" label="ชื่อ *" v-model="firstName" ref="firstName" id="firstName" required>
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 md5>
                    <v-text-field :error-messages="lastNameErrMsg" name="lastName" label="นามสกุล *" v-model="lastName" ref="lastName" id="lastName" required>

                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 md5>
                    <v-text-field name="citizenID" label="รหัสประชาชน *" v-model="citizenID" ref="citizenID" id="citizenID" required mask="#-####-#####-##-#" readonly>

                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 md5>
                    <v-menu ref="menu" :close-on-content-click="false" v-model="menu" :nudge-right="40" lazy transition="scale-transition" offset-y full-width min-width="250px" >

                      <v-text-field :error-messages="dateErrMsg" slot="activator" v-model="date" label="ปี/เดือน/วัน เกิด *" hint="ISO Format" prepend-icon="event" required readonly >

                      </v-text-field>
                      <v-date-picker color="blue-grey darken-3" locale="th" ref="picker" v-model="date" :max="new Date().toISOString().substr(0, 10)" min="1950-01-01" @change="save" required >
                      </v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12 md11>
                    <v-text-field :error-messages="addressErrMsg" name="address" v-model="address" label="ที่อยู่ตามบัตรประชาชน" ref="address" id="address">

                    </v-text-field>
                  </v-flex>

                  <v-flex xs12 md5>
                    <v-text-field
                    v-model="selectProvince"
                    label="จังหวัด"
                    ref="province"
                    readonly
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 md5>
                    <v-select
                    @change="districtFilter()"
                    :items="citys"
                    v-model="selectCity"
                    ref="city"
                    label="อำเภอ"
                    item-text="amphoe"
                    item-value="amphoe"
                    ></v-select>
                  </v-flex>

                  <v-flex xs12 md5>
                    <v-select
                    :items="districts"
                    v-model="selectDistrict"
                    label="ตำบล/แขวง"
                    ref="district"
                    item-text="district"
                    item-value="district"
                    ></v-select>
                  </v-flex>

                  <v-flex xs12 md5>
                    <v-text-field name="phoneNum" v-model="phoneNum" label="เบอร์โทรศัพท์" id="phoneNum" required>

                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 md5>

                  </v-flex>
                </v-layout>
                <v-btn style="border-radius: 0.3em"  color="red" dark  @click="closed()">Close</v-btn>
                <v-btn style="border-radius: 0.3em"  outline @click="firstTabValidate()" color="primary">Next</v-btn>
              </form>
            </v-card-text>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card>
            <v-layout row wrap>
              <v-dialog persistent v-model="camDialog" max-width="600px">
                <v-card class="footerbg elevation-0" >
                  <v-card-title>
                    <span class="headline" v-if="picCam">ถ่ายรูปสำหรับติดบัตรประจำตัว</span>
                    <span class="headline" v-if="!picCam">ถ่ายรูปบัตรประชาชน</span>
                    <v-spacer></v-spacer>
                    <v-btn color="error" icon @click.stop="closeCam()"><v-icon>close</v-icon></v-btn>
                  </v-card-title>
                  <v-card class="elevation-0" color="white">
                    <v-card-text>
                      <v-layout row wrap justify-center>
                        <div v-if="!picCam">
                          <video ref="video" id="video" width="400" height="300" autoplay></video>
                          <canvas ref="canvas" id="canvas" width="400" height="300"></canvas>
                        </div>
                        <div v-if="picCam">
                          <video ref="video" id="video" width="400" height="300" autoplay></video>
                          <canvas ref="canvas" id="canvas" width="400" height="300"></canvas>
                        </div>
                      </v-layout>
                    </v-card-text>
                    <v-card-actions>
                      <v-layout row wrap justify-center>
                        <v-btn style="border-radius: 0.3em" v-if="picCam" id="snap" color="primary" @click="capturePic()">ถ่ายรูป</v-btn>
                        <v-btn style="border-radius: 0.3em" v-if="!picCam" id="snap" color="primary" @click="captureCard()">ถ่ายรูป</v-btn>
                      </v-layout>
                    </v-card-actions>
                  </v-card>
                </v-card>
              </v-dialog>
            </v-layout>
            <v-card-title primary-title class="headline">
              <div>
                <span >ถ่ายรูป</span>
                <span v-if="picCaptureAlert" class="subheading red--text">*กรุณาถ่ายรูปเพื่อติดบัตร</span>
              </div>

            </v-card-title>
            <v-card-media
            contain
            height="300px"
            :src="picCaptured"
            v-show="picImg"
            title="สามารถถ่ายใหม่ด้วยการกด'ลงทะเบียนด่วน'อีกครั้ง"
            >
          </v-card-media>
            <v-card-text>
              <v-btn color="primary" @click="openCam('pic')"><v-icon>camera_alt</v-icon>&nbsp;ถ่ายรูปสำหรับติดบัตร</v-btn>
            </v-card-text>
            <v-card-actions>
              <v-btn style="border-radius: 0.3em"  color="red" dark  @click="closed()">Close</v-btn>
              <v-spacer></v-spacer>
              <v-btn style="border-radius: 0.3em" outline @click="prevTab()" color="blue-grey">Back</v-btn>
              <v-btn style="border-radius: 0.3em" outline @click="secondTabValidate()" color="primary">Next</v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>
        <v-stepper-content step="3">
          <v-card>
            <v-card-title primary-title class="headline">
              ปริ้นบัตรประจำตัว
            </v-card-title>
            <v-card-text>
              <v-layout row wrap fill-height align-center justify-space-around text-xs-center>
                <v-flex xs12 sm12 md6>
                  <v-card class="aaa" white id="card-front" height="5.4cm" width="8.6cm">
                    <v-card-text>
                      <v-layout row wrap>
                        <v-flex xs6>
                          <br><br>
                          <v-avatar
                          size="70px"
                          class="blue lighten-5"
                          >
                          <img :src="picCaptured">
                        </v-avatar>
                        <br>
                        <v-flex xs12>
                          <span>{{firstName}} {{lastName}}</span>
                          <v-spacer></v-spacer>
                          <span>รหัสประชาชน</span>
                          <v-spacer></v-spacer>
                          <span>{{citizenID}}</span>
                          <v-spacer></v-spacer>
                          <br>
                          <!-- <qrcode :value="user.blcp_code" :options="{ size: 80 }"></qrcode> -->
                          <!-- <img :src="require('@/assets/qr_exam.png')" height="80px"> -->
                        </v-flex>
                      </v-flex>
                      <v-flex xs6>
                        <br><br>
                        <qrcode :value="user.blcp_code" :options="{ size: 105 }"></qrcode>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs12 md5>
                <v-card  class="aaa" white  id="card-back" height="5.4cm" width="8.6cm">
                  <v-card-text>
                    <v-layout row wrap justify-center align-center fill-height>
                      <v-flex xs6>
                        <br>
                        <br><br>
                        <span>สายด่วนรับข้อร้องเรียน</span>
                        <span>038-918644-5</span>
                        <v-spacer></v-spacer>
                        <br>
                        <span>EMERGENCY CALL</span>
                        <span>038-918555</span>
                        <v-spacer></v-spacer>
                        <br>
                        <!-- <span>เบอร์โทรศัพท์: {{phoneNum}}</span>
                        <v-spacer></v-spacer>
                        <br> -->
                      </v-flex>
                    <v-flex xs6>
                      <br>
                      <!-- <img :src="require('@/assets/qr_exam.png')" height="130px"> -->
                      <!-- <qrcode :value="user.blcp_code" :options="{ size: 105 }"></qrcode> -->
                      <img class="mt-5 ml-4" width="100px" src="../../assets/lineqr.png">
                      <h5 class="white--text ml-4">Line Group ไตรภาคี</h5>

                    </v-flex>
                  </v-layout>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>

          </v-card-text>
          <v-card-actions>
            <v-btn style="border-radius: 0.3em" :disabled="disConfirm" color="red" dark  @click="closed()">Close</v-btn>
            <v-spacer></v-spacer>
            <v-btn style="border-radius: 0.3em" :disabled="disConfirm" outline @click="prevTab()" color="blue-grey">Back</v-btn>
            <v-btn style="border-radius: 0.3em" :disabled="disConfirm" @click="confirm()" color="primary">
              <div v-if="!loading">
                Confirm
              </div>
              <div v-else>
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>
            </v-btn>
            <v-btn style="border-radius: 0.3em" :disabled="disPrint" color="primary" @click="printCard()">Print</v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>
    </v-flex>
  </v-layout>
  </v-stepper>
  </v-card>
</div>
</template>

<script>
import _ from 'lodash'
import RegInfo from '@/components/checkin/RegInfo'
const dataTh = require('../../../static/th_db.json')
export default {
  props: ['stop', 'user'],
  data () {
    return {
      list: dataTh,
      picCaptureAlert: false,
      addressErrMsg: '',
      firstNameErrMsg: '',
      lastNameErrMsg: '',
      dateErrMsg: '',
      editStep: 1,
      disConfirm: false,
      disPrint: true,
      date: null,
      menu: false,
      userID: '',
      firstName: '',
      lastName: '',
      citizenID: '',
      phoneNum: '',
      address: '',
      selectPrefixName: 'นาย',
      selectProvince: 'ระยอง',
      selectDistrict: '',
      selectCity: '',
      provinces: 'ระยอง',
      prefix: ['นาย', 'นาง', 'นางสาว'],
      citys: null,
      camDialog: false,
      districts: null,
      stream: null,
      quickRegImg: false,
      picImg: false,
      video: {},
      canvas: {},
      picCaptured: '',
      cardCaptured: '',
      picCam: false,
      isEdit: false,
      loading: false,
      inUser: this.user,
      pause: false,
      isStop: this.stop,
      pic: null,
      card: null,
      newPic: false,
      newCard: false
    }
  },
  created () {
    this.cityFilter()
    this.districtFilter()
  },
  methods: {
    showRegInfo (blcp) {
      this.$emit('showUserInfo', blcp)
    },
    cityFilter () {
      this.citys = _.filter(this.list, function (o) { return o.province === 'ระยอง' })
    },
    districtFilter () {
      var me = this
      this.districts = _.filter(this.list, function (o) { return o.amphoe === me.selectCity })
    },
    onDecode (content) {
      this.loading = true
      // alert(content)
      var source = {blcp_code: content}
      this.axios.post(process.env.API + '/get_userby_blcp', {data: source}).then((response) => {
        // console.log(response.data)
        var user = response.data
        if (user.length > 0) {
          this.inUser = user[0]

          // alert(this.inUser.blcp_code)
          this.loading = false
          // this.pause = true
          // this.isStop = true
          this.$emit('qrReg')
          this.$emit('showUserInfo', content)
          // console.log(this.inUser)
        } else {
          this.$swal('QR CODE ไม่ถูกต้อง!', 'กรุณาลองใหม่อีกครั้ง', 'error')
          this.loading = false
        }
      })
    },
// computed: {
//   isStop () {
// return this.stop
// }
// },
    scan () {
      this.pause = false
      this.isStop = false
    },
    showCheckinBox (blcp) {
      this.$emit('showCheckinBox', blcp)
    },
    editUser (blcp) {
      this.isEdit = true
      // this.$emit('editUser', blcp)
      if (this.user.picture_card !== null) {
        this.cardCaptured = process.env.API + '/getImg/' + this.user.picture_card
        this.quickRegImg = true
      }
      if (this.user.picture !== null) {
        this.picImg = true
        this.picCaptured = process.env.API + '/getImg/' + this.user.picture
      }
      this.selectPrefixName = this.user.prefix
      this.userID = this.user.id
      this.firstName = this.user.firstname
      this.lastName = this.user.lastname
      this.citizenID = this.user.citizen_id
      this.date = this.formatDate(this.user.date_of_birth)
      this.address = this.user.address
      this.selectProvince = this.user.province
      this.selectCity = this.user.city
      this.selectDistrict = this.user.district
      this.cityFilter()
      this.districtFilter()
      this.$emit('editUser')
    },
    nextTab () {
      this.editStep += 1
    },
    closed () {
      this.$emit('closed')
    },
    prevTab () {
      this.editStep -= 1
    },
    save (date) {
      this.$refs.menu.save(date)
    },
    openCam (type) {
      if (type === 'card') {
        this.picCam = false
      } else {
        this.picCam = true
      }
      this.camDialog = true
      this.video = this.$refs.video
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
          this.video.src = window.URL.createObjectURL(stream)
          this.stream = stream
          this.video.play()
        })
      }
    },
    closeCam () {
      this.camDialog = false
      this.video.pause()
      this.video.src = null
    },
    captureCard () {
      this.quickRegImg = true
      this.canvas = this.$refs.canvas
      this.canvas.getContext('2d').drawImage(this.video, 0, 0, 400, 300)
      this.cardCaptured = this.canvas.toDataURL('image/png')
      this.newCard = true
      this.closeCam()
      var track = this.stream.getTracks()[0]
      track.stop()
    },
    capturePic () {
      this.picImg = true
      this.canvas = this.$refs.canvas
      this.canvas.getContext('2d').drawImage(this.video, 0, 0, 400, 300)
      this.picCaptured = this.canvas.toDataURL('image/png')
      this.newPic = true
      this.closeCam()
      var track = this.stream.getTracks()[0]
      track.stop()
    },
    printCard () {
      this.resetForm()
      this.editStep = 1
      let routeData = this.$router.resolve({name: 'card-printing', query: {blcp: this.user.blcp_code}})
      window.open(routeData.href, '_blank')
      this.$emit('showCheckinBox', this.user.blcp_code)
    },
    confirm () {
      this.loading = true
      this.disConfirm = true
      var oldPic = this.user.picture
      var oldCard = this.user.picture_card
      var date = new Date()
      var pic, card, uploadPic, uploadCard
      if (this.newPic) {
        pic = 'pic_' + this.citizenID + '_' + date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds() + '.jpg'
        uploadPic = this.picCaptured.substr(22)
      } else {
        pic = this.user.picture
        uploadPic = null
      }
      if (this.newCard) {
        card = 'card_' + this.citizenID + '_' + date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds() + '.jpg'
        uploadCard = this.cardCaptured.substr(22)
      } else {
        card = this.user.picture_card
        uploadCard = null
      }
      var data = {pic: uploadPic, card: uploadCard, card_name: card, pic_name: pic, old_pic: oldPic, old_card: oldCard}
      var source = {prefix: this.selectPrefixName, firstname: this.firstName, lastname: this.lastName, citizen_id: this.citizenID, date_of_birth: this.date, address: this.address, province: this.selectProvince, district: this.selectDistrict, city: this.selectCity, phone: this.phoneNum, blcp_code: this.citizenID, picture: pic, picture_card: card}
      this.loginAlert = false
      this.axios.post(process.env.API + '/edit_user', {data: source}).then((response) => {
        // console.log(response.data)
        if (response.data === 'success') {
          this.$swal('แก้ไขข้อมูลสำเร็จ', '', 'success')
          this.loading = false
          this.disPrint = false
          this.disPrint = false
        }
      }).catch(error => {
        console.log(error)
        this.$swal('การเชื่อมต่อผิดพลาด', 'ไม่สามารถแก้ไขข้อมููลได้ กรุณาลองใหม่', 'error')
        this.disConfirm = false
        this.loading = false
      })
      this.axios.post(process.env.API + '/upload_img', {data: data}).catch(error => {
        console.log(error)
        this.$swal('การอัพโหลดรูปไม่สำเร็จ!', 'ไม่สามารถแก้ไขข้อมููลได้ กรุณาลองใหม่', 'error')
      })
    },
    resetForm () {
      this.quickRegImg = false
      this.picImg = false
      this.cardCaptured = null
      this.picCaptured = null
      this.firstName = null
      this.lastName = null
      this.citizenID = null
      this.phoneNum = null
      this.address = null
      this.selectProvince = null
      this.selectCity = null
      this.selectPrefixName = null
      this.selectDistrict = null
    },
    formatDate (date) {
      var d = new Date(date)
      // alert(d.getMonth())
      return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
    },
    firstNameValidate () {
      if (this.firstName === '') {
        this.firstNameErrMsg = 'โปรดระบุชื่อ'
        this.$refs.firstName.focus()
        return false
      } else {
        this.firstNameErrMsg = ''
        return true
      }
    },
    lastNameValidate () {
      if (this.lastName === '') {
        this.lastNameErrMsg = 'โปรดระบุนามสกุล'
        this.$refs.lastName.focus()
        return false
      } else {
        this.lastNameErrMsg = ''
        return true
      }
    },
    dateValidate () {
      if (this.date === null || this.date === '') {
        this.dateErrMsg = 'โปรดระบุวันเกิด'
        return false
      } else {
        this.dateErrMsg = ''
        return true
      }
    },
    addressValidate () {
      if ((this.address === '' || this.selectCity === '' || this.selectDistrict === '') && this.cardCaptured === '') {
        this.addressErrMsg = '*กรุณากรอกที่อยู่หรือกด "ลงทะเบียนด่วน"'
        this.$refs.address.focus()
        return false
      } else {
        this.addressErrMsg = ''
        return true
      }
    },
    firstTabValidate () {
      if (this.firstNameValidate() && this.lastNameValidate() && this.dateValidate() && this.addressValidate()) {
        this.nextTab()
      } else {
        this.firstNameValidate()
        this.lastNameValidate()
        this.dateValidate()
        this.addressValidate()
      }
    },
    secondTabValidate () {
      if (this.picCaptured === '' || this.picCaptured === null || this.picImg === false) {
        this.picCaptureAlert = true
      } else {
        this.picCaptureAlert = false
        this.nextTab()
      }
    }
  },
  components: {
    'reg-info': RegInfo
  },
  watch: {
    menu (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
    firstName () {
      this.firstNameValidate()
    },
    lastName () {
      this.lastNameValidate()
    },
    date () {
      this.dateValidate()
    },
    address () {
      this.addressValidate()
    }
  }
}
</script>

<style lang="css">
#canvas {
  display: none
}
</style>
