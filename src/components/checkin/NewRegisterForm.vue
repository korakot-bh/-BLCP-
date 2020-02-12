<template lang="html" class="print-ignore">
  <v-stepper v-model="regisStep" class="regisdiv elevation-0">
    <v-stepper-header app class="elevation-0">
      <v-stepper-step step="1" :complete="regisStep > 1">กรอกข้อมูลส่วนตัว</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="2" :complete="regisStep > 2">ถ่ายรูป</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="3">ปริ้นบัตรประจำตัว</v-stepper-step>
    </v-stepper-header>
    <v-layout row wrap text-xs-center>
      <v-flex xs12 sm10 offset-sm1>
        <v-stepper-content step="1">
          <v-card>
            <v-card-title primary-title class="headline elevation-0">

              <div>
                <span>กรอกข้อมูลส่วนตัว</span>
                <v-btn style="border-radius: 0.3em" color="primary" @click="openCam('card')"><v-icon>camera_alt</v-icon>&nbsp;ลงทะเบียนด่วน !</v-btn>
                <span class="red--text body-2" v-if="cardCaptureAlert"> *กรุณาถ่ายรูปบัตรประชาชน</span>
              </div>
            </v-card-title>
            <v-card-media
            contain
            height="300px"
            :src="cardCaptured"
            v-show="quickRegImg"
            title="สามารถถ่ายใหม่ด้วยการกด'ลงทะเบียนด่วน'อีกครั้ง"
            >
          </v-card-media>
          <!-- <img :src="cardCaptured" v-show="quickRegImg" title="สามารถถ่ายใหม่ด้วยการกด'ลงทะเบียนด่วน'อีกครั้ง"> -->
          <v-card-text>
            <form action="" method="post">
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
                  <v-text-field :error-messages="firstNameErrMsg" ref="firstName" name="firstName" label="ชื่อ *" v-model="firstName" id="firstName" required>

                  </v-text-field>
                </v-flex>
                <v-flex xs12 md5>
                  <v-text-field :error-messages="lastNameErrMsg" ref="lastName" name="lastName" label="นามสกุล *" v-model="lastName" id="lastName" required>

                  </v-text-field>
                </v-flex>
                <v-flex xs11 md5>
                  <v-text-field :loading="citizenLoading" :error-messages="citizenIDErrMsg" ref="citizenID" mask="#-####-#####-##-#" name="citizenID" label="รหัสประจำตัวประชาชน *" v-model="citizenID" id="citizenID" required>

                  </v-text-field>
                </v-flex>
                <v-flex xs12 md5>
                  <v-menu ref="menu" :close-on-content-click="false" v-model="menu" :nudge-right="200" lazy transition="scale-transition" offset-y full-width min-width="250px" >

                    <v-text-field :error-messages="dateErrMsg" slot="activator" ref="birth" v-model="date" label="ปี-เดือน-วัน เกิด *" prepend-icon="event" readonly>

                    </v-text-field>
                    <v-date-picker color="blue-grey darken-3" ref="picker" locale="th" v-model="date" :max="new Date().toISOString().substr(0, 10)" min="1950-01-01" @change="save" required >
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md11>
                  <v-text-field name="address" v-model="address" label="ที่อยู่ตามบัตรประชาชน" id="address">

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
                  label="อำเภอ"
                  ref="city"
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
                  <v-text-field ref="phone" name="phoneNum" v-model="phoneNum" label="เบอร์โทรศัพท์" id="phoneNum" mask="#-##-###-####">
                  </v-text-field>
                </v-flex>
                <v-flex xs12 md5>
                </v-flex>
              </v-layout>
              <!-- <v-card-actions> -->
                <!-- <v-spacer></v-spacer> -->
                <v-btn  style="border-radius: 0.3em"  color="error" @click="closed()">close</v-btn>
                <v-btn  style="border-radius: 0.3em"  dark @click="firstTabValidate()" color="primary">Next</v-btn>
              <!-- </v-card-actions> -->
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
                        <video ref="video" width="400" height="300" id="video" autoplay></video>
                        <canvas ref="canvas" width="400" height="300" id="canvas"></canvas>
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
              <span>ถ่ายรูป</span>
              <span class="red--text body-2" v-if="picCaptureAlert"> *กรุณาถ่ายรูปเพื่อติดบัตร</span>
            </div>
          </v-card-title>
          <v-card-media
          contain
          height="250px"
          :src="picCaptured"
          v-show="picImg"
          title="สามารถถ่ายใหม่ด้วยการกด'ลงทะเบียนด่วน'อีกครั้ง"
          >
        </v-card-media>
          <v-card-text>
            <v-btn style="border-radius: 0.3em"  color="primary" @click="openCam('pic')"><v-icon>camera_alt</v-icon>&nbsp;ถ่ายรูปสำหรับติดบัตร</v-btn>
          </v-card-text>
          <v-card-actions>
            <v-btn style="border-radius: 0.3em" color="red" dark @click="closed()" >Close</v-btn>
            <v-spacer></v-spacer>
            <v-btn style="border-radius: 0.3em"  outline @click="prevTab()" color="blue-grey">Back</v-btn>
            <v-btn style="border-radius: 0.3em" outline @click="secondPageValidate()" color="primary">Next</v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>
      <v-stepper-content step="3">
        <v-card>
          <v-card-title primary-title class="headline">
            ตัวอย่างบัตร
          </v-card-title>
          <v-card-text>
            <v-layout row wrap text-xs-center>
              <v-flex xs12 sm12 md6>
                <v-card class="aaa" color="teal darken-1" white id="card-front" height="55mm" width="86mm">
                  <v-card-text>
                    <v-layout row wrap justify-center align-center>
                      <v-flex xs6>
                        <br>
                        <v-avatar
                        size="70px"
                        class="blue lighten-5 mt-3 ma-1"
                        >
                        <img :src="picCaptured">
                      </v-avatar>

                    <v-flex xs12 class="">
                      <span>{{firstName}} {{lastName}}</span>
                      <v-spacer></v-spacer>
                      <span>รหัสประชาชน</span>
                      <v-spacer></v-spacer>
                      <span>{{citizenID}}</span>
                      <v-spacer></v-spacer>
                      <br>
                    </v-flex>
                    </v-flex>
                    <v-flex xs6>
                      <br>
                      <qrcode class="ml-3 ma-1 mt-3" :value="citizenID" :options="{ size: 105 }"></qrcode>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs12 md5>
              <v-card class="aaa" id="card-back" height="55mm" width="86mm">
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
                      <span>038-918555</span>
                      <v-spacer></v-spacer>
                      <br>
                    </v-flex>
                    <v-flex xs5>
                      <br><br>
                      <!-- <qrcode class="ml-1 mt-2" :value="blcp" :options="{ size: 100 }"></qrcode> -->
                      <img class="mt-3 ml-1" width="100px" src="../../assets/lineqr.png">

                      <h5 class="white--text ml-3 mt-2">Line Group ไตรภาคี</h5>

                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>

        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="disConfirm" style="border-radius: 0.3em" color="red" dark @click="closed()" >Close</v-btn>
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
</template>




<script>
// import TakePhoto from '@/components/checkin/TakePhoto';
import _ from 'lodash'
const dataTh = require('../../../static/th_db.json')
export default {
  props: ['regisStep', 'clear'],
  data: () => ({
    list: dataTh,
    citizenLoading: false,
    citizenCheck: false,
    loading: false,
    picCaptureAlert: false,
    cardCaptureAlert: false,
    dateErrMsg: '',
    citizenIDErrMsg: '',
    firstNameErrMsg: '',
    lastNameErrMsg: '',
    disConfirm: false,
    disPrint: true,
    blcp: '1111',
    date: null,
    menu: false,
    firstName: '',
    lastName: '',
    citizenID: '',
    phoneNum: '',
    address: '',
    selectProvince: 'ระยอง',
    selectCity: '',
    selectPrefixName: 'นาย',
    selectDistrict: '',
    provinces: 'ระยอง',
    prefix: ['นาย', 'นาง', 'นางสาว'],
    districts: null,
    citys: null,
    camDialog: false,
    stream: null,
    quickRegImg: false,
    picImg: false,
    video: {},
    canvas: {},
    picCaptured: '',
    cardCaptured: '',
    picCam: false,
    rules: {
      required: value => !!value || 'โปรดระบุข้อมูลนี้',
      reqMin13: value => value.length === 13 || 'รหัสประชาชน 13 หลัก',
      reqMin10: value => value.length === 10 || 'เบอร์โทรศัพท์ 10 หลัก'
    }
    // sharedItems: TakePhoto.data()["camDialog"]
  }),
  created () {
    this.citys = _.filter(this.list, function (o) { return o.province === 'ระยอง' })
    // this.regisStep = 1
    // this.resetForm()
  },
  computed: {

  },
  watch: {
    menu (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
    regisStep () {
      if (this.regisStep === 1) {
        this.disConfirm = false
        this.disPrint = true
      }
    },
    citizenID () {
      if (this.citizenIDValidate()) {
        this.checkCitizenID()
      }
    },
    date () {
      this.dateValidate()
    },
    firstName () {
      this.firstNameValidate()
    },
    lastName () {
      this.lastNameValidate()
    }
  },
  methods: {
    districtFilter () {
      // alert(this.selectCity)
      // this.firstName = this.selectCity
      var me = this
      this.districts = _.filter(this.list, function (o) { return o.amphoe === me.selectCity })
    },
    closed () {
      this.resetForm()
      this.$emit('closed')
    },
    secondPageValidate () {
      if (this.picCaptured !== '') {
        this.picCaptureAlert = false
        this.nextTab()
      } else {
        this.picCaptureAlert = true
      }
    },
    firstTabValidate () {
      if (!this.firstNameValidate() || !this.lastNameValidate() || this.citizenIDErrMsg !== '' || !this.dateValidate() || !this.addressValidate()) {
        this.firstNameValidate()
        this.lastNameValidate()
        this.citizenIDValidate()
        this.dateValidate()
      } else {
        this.nextTab()
      }
    },
    // firstTabValidate () {
    //   // alert(this.cardCaptured.substr(22))
    //   this.axios.post(process.env.API + '/upload_img', {image: this.cardCaptured.substr(22)}).then(res => {
    //     alert(res)
    //   })
    // },
    dateValidate () {
      if (this.date === null) {
        this.dateErrMsg = 'โปรดระบุ วัน/เดือน/ปี เกิด'
        return false
      } else {
        this.dateErrMsg = ''
        return true
      }
    },
    firstNameValidate () {
      if (this.firstName === '') {
        this.firstNameErrMsg = 'โปรดระบุชื่อจริง'
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
    citizenIDValidate () {
      if (this.citizenID === '') {
        this.citizenIDErrMsg = 'โปรดระบุรหัสประจำตัวประชาชน'
        this.$refs.citizenID.focus()
        return false
      } else if (this.citizenID.length < 13) {
        this.citizenIDErrMsg = 'รหัสประจำตัวประชาชน 13 หลัก'
        this.$refs.citizenID.focus()
        return false
      } else {
        this.citizenIDErrMsg = ''
        return true
      }
    },
    addressValidate () {
      if ((this.address === '' || this.selectCity === '' || this.selectDistrict === '') && this.cardCaptured === '') {
        this.cardCaptureAlert = true
        return false
      } else {
        this.cardCaptureAlert = false
        return true
      }
    },
    checkIDCard (id) {
      if (id === null || id.length !== 13) {
        return false
      }
      var sum = 0
      for (var i = 0; i < 12; i++) {
        sum += parseFloat(id.charAt(i)) * (13 - i)
      }
      if ((11 - sum % 11) % 10 !== parseFloat(id.charAt(12))) {
        return false
      }
      return true
    },
    checkCitizenID () {
      var source = {citizen_id: this.citizenID}
      if (this.checkIDCard(this.citizenID)) {
        this.citizenLoading = true
        this.axios.post(process.env.API + '/get_userby_citizenid', {data: source}).then((response) => {
          // console.log(response.data)
          var user = response.data
          if (user.length > 0) {
            this.citizenIDErrMsg = '*ผู้ใช้นี้เคยลงทะเบียนแล้ว!'
            this.citizenLoading = false
            return false
          } else {
            this.citizenIDErrMsg = ''
            this.citizenLoading = false
            this.citizenCheck = true
            return true
          }
        }).catch(er => {
          console.log(er)
          this.citizenIDErrMsg = '*ไม่สามารถตรวจสอบได้!'
          this.citizenLoading = false
          return false
        })
      } else {
        this.citizenIDErrMsg = 'รหัสประชาชนไม่ถูกต้อง'
        return false
      }
    },
    confirm () {
      this.loading = true
      this.disConfirm = true
      var date = new Date()
      var picName = 'pic_' + this.citizenID + '_' + date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds() + '.jpg'
      var cardName = 'card_' + this.citizenID + '_' + date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds() + '.jpg'
      var pic = ''
      var card = ''
      if (this.picCaptured === '' || this.picCaptured === null) {
        pic = null
        picName = null
      } else {
        pic = this.picCaptured.substr(22)
      }
      if (this.cardCaptured === '' || this.cardCaptured === null) {
        card = null
        cardName = null
      } else {
        card = this.cardCaptured.substr(22)
      }
      var source = {prefix: this.selectPrefixName, firstname: this.firstName, lastname: this.lastName, citizen_id: this.citizenID, date_of_birth: this.date, address: this.address, province: this.selectProvince, district: this.selectDistrict, city: this.selectCity, phone: this.phoneNum, blcp_code: this.citizenID, picture: picName, picture_card: cardName, received_card: 0}
      var data = {pic: pic, card: card, pic_name: picName, card_name: cardName, old_pic: null, old_card: null}
      this.loginAlert = false
      this.axios.post(process.env.API + '/new_register', {source: source}).then((response) => {
        // console.log(response.data)
        if (response.data === 'success') {
          this.$emit('newReg')
          this.$swal('ลงทะเบียนสำเร็จ', '', 'success')
          this.loading = false
          this.disPrint = false
          this.axios.post(process.env.API + '/upload_img', {data: data})
        }
      }).catch(er => {
        this.loading = false
        this.disConfirm = false
        this.$swal('การเชื่อมต่อผิดพลาด', 'กรุณาลองใหม่ภายหลัง', 'error')
      })
    },
    nextTab () {
      this.regisStep += 1
      this.$emit('nextTab')
    },
    prevTab () {
      this.regisStep -= 1
      this.$emit('prevTab')
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
      // console.log(localStream.getVideoTracks());
      this.video.pause()
      this.video.src = null
      // var track = stream.getTracks()[0]
      // track.stop()
      // this.stream.stop()
      // mediaStream.stop()
    },
    captureCard () {
      this.quickRegImg = true
      this.canvas = this.$refs.canvas
      this.canvas.getContext('2d').drawImage(this.video, 0, 0, 400, 300)
      // this.cardCaptured.push(this.cardCanvas.toDataURL('image/png'))
      this.cardCaptured = this.canvas.toDataURL('image/png')
      this.closeCam()
      var track = this.stream.getTracks()[0]
      track.stop()
      // console.log(this.cardCaptured);
    },
    capturePic () {
      this.picImg = true
      this.canvas = this.$refs.canvas
      this.canvas.getContext('2d').drawImage(this.video, 0, 0, 400, 300)
      // this.cardCaptured.push(this.cardCanvas.toDataURL('image/png'))
      this.picCaptured = this.canvas.toDataURL('image/png')
      // console.log(this.picCaptured)
      this.closeCam()
      var track = this.stream.getTracks()[0]
      track.stop()
    },
    printCard () {
      this.regisStep = 1
      let routeData = this.$router.resolve({name: 'card-printing', query: {blcp: this.citizenID}})
      window.open(routeData.href, '_blank')
      this.$emit('showCheckinBox', this.citizenID)
      this.resetForm()
    },
    resetForm () {
      this.dateErrMsg = ''
      this.citizenIDErrMsg = ''
      this.firstNameErrMsg = ''
      this.lastNameErrMsg = ''
      this.quickRegImg = false
      this.picImg = false
      this.cardCaptured = ''
      this.picCaptured = ''
      this.firstName = ''
      this.lastName = ''
      this.citizenID = ''
      this.phoneNum = ''
      this.address = ''
      this.selectPrefixName = 'นาย'
      this.selectProvince = 'ระยอง'
      this.selectCity = ''
      this.date = null
    }
  }
}
</script>

<style lang="css" scoped>
#canvas {
  display: none
}
.footerbg {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 1.5em;
  padding: 1em;
}
</style>
