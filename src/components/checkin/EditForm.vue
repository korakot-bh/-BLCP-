<template lang="html">
  <v-card class="footerbg">
    <v-layout row wrap align-center justify-space-around>
      <v-flex v-if="loading" xs12>
        <v-layout row wrap justify-center>
          <v-progress-circular indeterminate size="100"></v-progress-circular>
        </v-layout>
      </v-flex>
      <h2 v-if="!loading">แก้ไขข้อมูลส่วนตัว</h2>
      <v-flex v-if="!loading" xs12>
        <br>
        <v-card-media
          contain
          height="200px"
          :src="picture + user.picture_card"
        >
        </v-card-media>
      </v-flex>
      <v-card-text v-if="!loading">
        <form action="" method="post">
          <v-layout row wrap align-center justify-space-around>
            <v-flex xs6 md5>
              <v-text-field
                v-model="user.firstname"
                name="firstname"
                label="ชื่อ"
                id="firstname"
              ></v-text-field>
            </v-flex>
            <v-flex xs6 md5>
              <v-text-field
                v-model="user.lastname"
                name="lastname"
                label="นามสกุล"
                id="lastname"
              ></v-text-field>
              </v-flex>

              <v-flex xs6 md5>
                <v-text-field
                  v-model="user.citizen_id"
                  readonly
                  name="citizenID"
                  label="รหัสประจำตัวประชาชน"
                  id="citizenID"
                ></v-text-field>
              </v-flex>

              <v-flex xs6 md5>
                <v-text-field
                  v-model="user.address"
                  name="address"
                  label="ที่อยู่ตามบัตรประชาชน"
                  id="address"
                ></v-text-field>
              </v-flex>

              <v-flex xs6 md5>
                <v-select
                  :items="provinces"
                  v-model="user.province"
                  label="จังหวัด"
                ></v-select>
              </v-flex>

              <v-flex xs6 md5>
                <v-select
                  @change="getDistricts()"
                  :items="cities"
                  v-model="user.city"
                  item-text="amphoe"
                  item-value="amphoe"
                  label="อำเภอ"
                ></v-select>
              </v-flex>

              <v-flex xs6 md5>
                <v-select
                  :items="districts"
                  item-text="district"
                  item-value="district"
                  v-model="user.district"
                  label="ตำบล"
                ></v-select>
              </v-flex>

              <v-flex xs6 md5>
                <v-text-field
                  v-model="user.phone"
                  name="phone"
                  label="เบอร์โทรศัพท์"
                  id="phone"
                  mask="#-##-###-####"
                ></v-text-field>
              </v-flex>
            </v-flex>
          </v-layout>
        </form>
      </v-card-text>


      <!-- <v-flex v-if="!loading" xs12>
        <v-card-text>
          <v-flex offset-xs3 xs6>
            <v-text-field
              v-model="user.firstname"
              name="firstname"
              label="ชื่อ"
              id="firstname"
            ></v-text-field>
          </v-flex>

          <v-text-field
            v-model="user.lastname"
            name="lastname"
            label="นามสกุล"
            id="lastname"
          ></v-text-field>
          <v-text-field
            v-model="user.citizen_id"
            readonly
            name="citizenID"
            label="รหัสประจำตัวประชาชน"
            id="citizenID"
          ></v-text-field>
          <v-text-field
            v-model="user.address"
            name="address"
            label="ที่อยู่ตามบัตรประชาชน"
            id="address"
          ></v-text-field>
          <v-select
            :items="provinces"
            v-model="user.province"
            label="จังหวัด"
          ></v-select>
          <v-select
            @change="getDistricts()"
            :items="cities"
            v-model="user.city"
            item-text="amphoe"
            item-value="amphoe"
            label="อำเภอ"
          ></v-select>
          <v-select
            :items="districts"
            item-text="district"
            item-value="district"
            v-model="user.district"
            label="ตำบล"
          ></v-select>
          <v-text-field
            v-model="user.phone"
            name="phone"
            label="เบอร์โทรศัพท์"
            id="phone"
            mask="#-##-###-####"
          ></v-text-field>
        </v-card-text>
      </v-flex> -->
    </v-layout>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn style="border-radius: 0.3em" color="error" :disabled="loadingBtn" @click="close()">
          close
      </v-btn>
      <v-btn style="border-radius: 0.3em" v-if="!loading" :disabled="loadingBtn" color="primary" @click="confirm()">
        <div v-if="!loadingBtn">
          confirm
        </div>
        <div v-else>
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import _ from 'lodash'
const data = require('../../../static/th_db.json')
export default {
  props: ['user', 'loading'],
  data () {
    return {
      picture: process.env.API + '/getImg/',
      loadingBtn: false,
      dataTh: data,
      provinces: ['ระยอง', ''],
      cities: [],
      districts: []
    }
  },
  methods: {
    confirm () {
      this.updateUser()
    },
    close () {
      this.$emit('close')
    },
    getCities () {
      this.cities = _.filter(this.dataTh, function (o) { return o.province === 'ระยอง' })
    },
    getDistricts () {
      var dis = this
      this.districts = _.filter(this.dataTh, function (o) { return o.amphoe === dis.user.city })
    },
    updateUser () {
      var source = {
        prefix: this.user.prefix,
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        citizen_id: this.user.citizen_id,
        date_of_birth: this.user.date_of_birth,
        address: this.user.address,
        province: this.user.province,
        city: this.user.city,
        district: this.user.district,
        phone: this.user.phone,
        blcp_code: this.user.blcp_code,
        picture: this.user.picture,
        picture_card: this.user.picture_card
      }
      this.loadingBtn = true
      this.axios.post(process.env.API + '/edit_user', {data: source}).then((response) => {
        // console.log(response.data)
        if (response.data === 'success') {
          this.$swal('แก้ไขข้อมูลสำเร็จ', '', 'success')
          this.loadingBtn = false
          this.$emit('edited')
          this.close()
        }
      }).catch(error => {
        console.log(error)
        this.$swal('การเชื่อมต่อผิดพลาด', 'ไม่สามารถแก้ไขข้อมููลได้ กรุณาลองใหม่', 'error')
        this.loadingBtn = false
        this.close()
      })
    }
  },
  created () {
    this.getCities()
    this.getDistricts()
  }
}
</script>

<style lang="css">
</style>
