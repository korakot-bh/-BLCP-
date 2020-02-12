<template>
  <!-- <v-layout row wrap justify-center> -->
    <!-- <v-flex lg12 md12 xs12 sm12> -->
      <!-- <div> -->
      <v-card>
        <!-- <v-toolbar flat color="white">
          <v-toolbar-title>รายชื่อการประชุม</v-toolbar-title>
          <v-spacer></v-spacer> -->
          <v-card-title>
            <!-- <span class="subheading">รายชื่อเจ้าหน้าที่</span> -->
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details>
            </v-text-field>
            <v-btn color="primary" dark @click="dialog = true, addStaff()">เพิ่มเจ้าหน้าที่</v-btn>
          </v-card-title>

          <v-dialog v-model="dialog" persistent max-width="800px">
            <v-card class="footerbg">
              <v-card-text><h2 v-if="type === 'add'">ลงทะเบียนเจ้าหน้าที่ใหม่</h2><h2 v-if="type === 'edit'">แก้ไขเจ้าหน้าที่</h2>
                <v-container grid-list-md>
                  <v-layout wrap>

                    <v-flex xs12>
                      <v-flex xs12 sm6 md6>
                        <v-text-field prepend-icon="assignment" label="Username *" v-model="username">
                        </v-text-field>
                      </v-flex>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <v-text-field prepend-icon="lock" label="Password *" v-model="password" :append-icon="show1 ? 'visibility_off' : 'visibility'" :type="show1 ? 'text' : 'password'" @click:append="show1 = !show1" hint="At least 6-14 characters" v-if="type === 'add'">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field prepend-icon="lock" label="Comfirm Password *" v-model="password2" :append-icon="show2 ? 'visibility_off' : 'visibility'" :type="show2 ? 'text' : 'password'" @click:append="show2 = !show2" hint="At least 6-14 characters" v-if="type === 'add'">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field :readonly='readonly' :loading="citizenIDLoading" :error-messages="citizeIDErr" prepend-icon="assignment" label="รหัสบัตรประชาชน *" v-model="citizen_id" mask="#-####-#####-##-#">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <!-- <v-btn style="border-radius: 0.3em" color="primary" @click="checkStaff">ตรวจสอบเลขบัตรประชาชน</v-btn> -->
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field prepend-icon="assignment" label="ชื่อ *" v-model="firstname">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field prepend-icon="assignment" label="นามสกุล *" v-model="lastname">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-menu ref="menu" :close-on-content-click="false" v-model="menu" :nudge-right="40" lazy transition="scale-transition" offset-y full-width min-width="250px" >
                        <!-- <v-text-field slot="activator" v-model="date" label="วัน/เดือน/ปี เกิด *" prepend-icon="event" required readonly >
                        </v-text-field> -->
                        <v-date-picker color="blue-grey darken-3" ref="picker" v-model="date" :max="new Date().toISOString().substr(0, 10)" min="1950-01-01" @change="save" required >
                        </v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <!-- <v-text-field prepend-icon="home" label="ที่อยู่ตามบัตรประชาชน *" v-model="form.address">
                      </v-text-field> -->
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field prepend-icon="call" label="เบอร์โทรศัพท์ *์" v-model="phone" mask="###-#######">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-select
                      prepend-icon="assignment_ind"
                      :items="items"
                      v-model="role"
                      item-text="text"
                      item-value="value"
                      label="สิทธิ์การใช้งาน *"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn style="border-radius: 0.3em" color="error" :disabled="loading" dark @click.native="clearData">ยกเลิก</v-btn>
                <v-btn style="border-radius: 0.3em" color="primary" :disabled="loading" depressed @click.native="saveStaff()">
                  <div v-if="!loading">
                    บันทึก
                  </div>
                  <div v-if="loading">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  </div>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
                      :error-messages="passwordErr"
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
                <v-btn style="border-radius: 0.3em" color="error" @click="editPasswordDialog = false" :disabled="passwordLoading">ยกเลิก</v-btn>
                <v-btn style="border-radius: 0.3em" color="primary" :disabled="passwordLoading" @click="setNewPassword()">
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
        <!-- </v-toolbar> -->
        <v-data-table :headers="headers" :items="listStaff" :search="search" :rows-per-page-items="[{ text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }, 10, 50]">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.number }}</td>
            <td class="text-xs-center">{{ props.item.username }}</td>
            <td class="text-xs-center">{{ props.item.fullname }}</td>
            <td class="text-xs-center">{{ props.item.phone }}</td>
            <!-- <td class="text-xs-center">{{ props.item.role }}</td> -->
            <td class="text-xs-center">
              <v-btn style="border-radius: 0.3em" small depressed dark color="indigo lighten-1" class="mx-0" v-if="props.item.role === 0">
                Admin
              </v-btn>
              <v-btn style="border-radius: 0.3em" small depressed dark color="cyan lighten-2" class="mx-0" v-if="props.item.role=== 1">
                Staff
              </v-btn>
            </td>
            <td class="justify-center">
              <v-btn style="border-radius: 0.3em" color="blue-grey" flat @click="editStatus(props.item)">
                <v-icon small class="mr-1">
                  edit
                </v-icon>
                แก้ไข
              </v-btn>
              <v-btn style="border-radius: 0.3em" color="blue-grey" flat @click="editPassword(props.item)">
                <v-icon small class="mr-1">
                  lock
                </v-icon>
                แก้ไขรหัสผ่าน
              </v-btn>
              <v-btn style="border-radius: 0.3em" color="error" flat @click="deleteItem(props.item)">
                <v-icon small class="mr-1">
                  delete
                </v-icon>
                ลบ
              </v-btn>
            </td>
          </template>
          <v-alert slot="no-results" :value="true" outline color="error" icon="warning">
            Your search for "{{ search }}" found no results.
          </v-alert>
        </v-data-table>
      </v-card>
      <!-- </div> -->
    <!-- </v-flex> -->
  <!-- </v-layout> -->
  <!-- </v-container> -->
  <!-- </v-content> -->
</template>

<script>
export default {
  data () {
    const defaultForm = Object.freeze({
      id: '',
      username: '',
      password: '',
      Password2: '',
      firstname: '',
      lastname: '',
      citizen_id: '',
      date_of_birth: '',
      address: '',
      phone: '',
      role: '',
      number: ''
    })
    return {
      passwordErr: '',
      showPass1: false,
      showPass2: false,
      passwordLoading: false,
      newPassword: '',
      newPassword2: '',
      editPasswordDialog: false,
      loading: false,
      readonly: false,
      form: Object.assign({}, defaultForm),
      citizenIDLoading: false,
      citizeIDErr: '',
      id: '',
      username: '',
      password: '',
      password2: '',
      firstname: '',
      lastname: '',
      citizen_id: '',
      phone: '',
      role: '',
      date: null,
      menu: false,
      dialog: false,
      show1: false,
      show2: false,
      items: [
        {
          text: 'Admin',
          value: 0
        },
        {
          text: 'Staff',
          value: 1
        }
      ],
      search: '',
      status: 0,
      headers: [
        { text: 'ลำดับที่', align: 'centered', value: 'number' },
        { text: 'ชื่อผู้ใช้งาน', align: 'centered', value: 'username', sortable: true },
        { text: 'ชื่อ-นามสกุล', align: 'centered', value: 'fullname', sortable: true },
        { text: 'เบอร์ติดต่อ', align: 'centered', value: 'phone_number', sortable: true },
        { text: 'สิทธิ์การใช้งาน', align: 'centered', value: 'role', sortable: true },
        { text: 'จัดการ', align: 'centered', value: 'name', sortable: true }
      ],
      listStaff: [],
      listStaff2: [],
      type: ''
    }
  },
  computed: {

    computedDateFormatted () {
      return this.formatDate(this.date)
    }
  },

  created () {
    this.getListStaff()
  },

  watch: {
    menu (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
    dialog (val) {
      val || this.close()
    },
    citizen_id () {
      if (this.citizen_id.length === 13 && this.type === 'add') {
        if (!this.checkIDCard(this.citizen_id)) {
          this.citizeIDErr = 'เลขบัตรไม่มีอยู่จริง'
        } else {
          this.citizeIDErr = ''
          this.checkStaff()
        }
      } else if (this.citizen_id.length < 13) {
        this.citizeIDErr = 'เลขบัตรประชาชน 13 หลัก'
      } else if (this.citizen_id.length === 0 || this.citizen_id === '') {
        this.citizeIDErr = 'โปรดระบุเลขบัตรประชาชน'
      } else {
        this.citizeIDErr = ''
      }
    },
    newPassword2 () {
      // if (this.newPassword !== this.newPassword2) {
        // this.passwordErr = 'รหัสผ่านไม่ตรงกัน'
      // } else {
      this.passwordErr = ''
      // }
    }
  },

  methods: {
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
    save (date) {
      this.$refs.menu.save(date)
    },
    hide () {
      this.dialog = false
      this.clearData()
      this.loading = false
    },

    clearData () {
      this.citizeIDErr = ''
      this.id = ''
      this.username = ''
      this.password = ''
      this.password2 = ''
      this.firstname = ''
      this.lastname = ''
      this.citizen_id = ''
      this.phone = ''
      this.role = ''
      this.dialog = false
    },

    addStaff () {
      this.readonly = false
      this.id = ''
      this.username = ''
      this.password = ''
      this.password2 = ''
      this.firstname = ''
      this.lastname = ''
      this.citizen_id = ''
      this.phone = ''
      this.role = ''
      this.type = 'add'
      this.dialog = true
    },
    editPassword (item) {
      this.id = item.id
      this.newPassword = ''
      this.newPassword2 = ''
      this.editPasswordDialog = true
    },
    editStatus (item) {
      this.readonly = true
      this.id = item.id
      this.username = item.username
      this.firstname = item.firstname
      this.lastname = item.lastname
      this.citizen_id = item.citizen_id
      this.address = item.address
      this.phone = item.phone
      this.role = item.role
      this.type = 'edit'
      this.dialog = true
    },
    setNewPassword () {
      if (this.newPassword !== this.newPassword2) {
        this.passwordErr = 'รหัสผ่านไม่ตรงกัน'
      } else {
        this.passwordErr = ''
        this.$swal({
          title: 'แก้ไขรหัสผ่านของผู้ใช้นี้ ?',
          text: 'กด "ยืนยัน" เพื่อแก้ไขหรือกด "ยกเลิก"',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'ยกเลิก',
          confirmButtonText: 'ยืนยัน'
        }).then(result => {
          if (result) {
            this.passwordLoading = true
            this.axios.post(process.env.API + '/update_password', {data: {id: this.id, password: this.newPassword}}).then(response => {
              if (response.data === 'success') {
                this.passwordLoading = false
                this.editPasswordDialog = false
                this.$swal('แก้ไขรหัสผ่านสำเร็จ', '', 'success')
              } else {
                this.passwordLoading = false
                this.editPasswordDialog = false
                this.$swal('แก้ไขรหัสผ่านไม่สำเร็จ', 'เกิดข้อผิดพลาดในการแก้ไข กรุณาลองใหม่', 'error')
              }
            }).catch(er => {
              console.log(er)
              this.passwordLoading = false
              this.editPasswordDialog = false
              this.$swal('เกิดข้อผิดพลาดในการเชื่อ', 'กรุณาลองใหม่ในภายหลัง', 'error')
            })
          }
        })
      }
    },
    getListStaff () {
      this.axios.post(process.env.API + '/showstaff').then((response) => {
        var result = response.data
        this.listStaff = []
        for (var i = 0; i < result.length; i++) {
          var status2 = result[i]['status']
          if (status2 === 0) {
            this.listStaff.push({
              number: i + 1,
              id: result[i]['id'],
              username: result[i]['username'],
              fullname: result[i]['firstname'] + ' ' + result[i]['lastname'],
              firstname: result[i]['firstname'],
              lastname: result[i]['lastname'],
              citizen_id: result[i]['citizen_id'],
              date: result[i]['date_of_birth'],
              address: result[i]['address'],
              phone: result[i]['phone'],
              role: result[i]['role'],
              status: status2
            })
          } else if (status2 === 1) {
            this.listStaff2.push({
              number: i + 1,
              id: result[i]['id'],
              username: result[i]['username'],
              fullname: result[i]['firstname'] + ' ' + result[i]['lastname'],
              firstname: result[i]['firstname'],
              lastname: result[i]['lastname'],
              citizen_id: result[i]['citizen_id'],
              date: result[i]['date_of_birth'],
              address: result[i]['address'],
              phone: result[i]['phone'],
              role: result[i]['role'],
              status: status2
            })
          }
        }
      })
    },

    checkStaff () {
      this.citizenIDLoading = true
      var source = {citizen_id: this.citizen_id}
      this.axios.post(process.env.API + '/check_staff', {source: source}).then((response) => {
        this.citizenIDLoading = false
        var result = response.data
        if (result.length > 0) {
          this.id = result[0]['id']
          this.username = result[0]['username']
          this.firstname = result[0]['firstname']
          this.lastname = result[0]['lastname']
          this.citizen_id = result[0]['citizen_id']
          this.phone = result[0]['phone']
          this.role = result[0]['role']
        } else {
          this.citizenIDLoading = false
          this.$swal('สามารถใช้เลขบัตรประชาชนนี้ได้', '', 'success')
        }
      }).catch(er => {
        console.log(er)
        this.citizenIDLoading = false
        this.$swal('การเชื่อมต่อผิดพลาด', '', 'error')
      })
    },

    saveStaff () {
      var source = ''

      if (this.username === '') {
        this.$swal('กรุณากรอกชื่อผู้ใช้งาน', '', 'warning')
      } else if (this.password === '' && this.type === 'add') {
        this.$swal('กรุณากรอกรหัสผ่าน', '', 'warning')
      } else if ((this.password2 !== this.password) && this.type === 'add') {
        this.$swal('กรุณากรอกรหัสผ่านให้ตรงกัน', '', 'warning')
      } else if (this.firstname === '') {
        this.$swal('กรุณากรอกชื่อจริง', '', 'warning')
      } else if (this.lastname === '') {
        this.$swal('กรุณากรอกนามสกุล', '', 'warning')
      } else if (this.citizen_id === '' || this.citizen_id.length < 13) {
        this.$swal('กรุณากรอกรหัสบัตรประชาชน', '', 'warning')
      } else if (this.phone === '' || this.phone.length < 10) {
        this.$swal('กรุณากรอกเบอร์โทรศัพท์', '', 'warning')
      } else if (this.role === '') {
        this.$swal('กรุณาเลือกสิทธิ์ผู้ใช้งาน', '', 'warning')
      } else if (this.type === 'edit') {
        this.loading = true
        source = {id: this.id, username: this.username, firstname: this.firstname, lastname: this.lastname, citizen_id: this.citizen_id, phone: this.phone, role: this.role, status: this.status}
        this.axios.post(process.env.API + '/update_staff', {source: source}).then((response) => {
          console.log(response.data)
          if (response.data === 'success') {
            this.$swal('แก้ไขข้อมูลเรียบร้อยแล้ว', '', 'success')
            this.getListStaff()
            this.hide()
          }
        }).catch(er => {
          this.loading = false
          console.log(er)
          this.$swal('การเชื่อมต่อผิดพลาด', 'กรุณาลองใหม่ภายหลัง', 'error')
        })
      } else if (this.type === 'add') {
        this.loading = true
        if (this.form.role === 'Admin') {
          this.form.role = 0
        } else if (this.form.role === 'Staff') {
          this.form.role = 1
        }
        source = {username: this.username, password: this.password, firstname: this.firstname, lastname: this.lastname, citizen_id: this.citizen_id, phone: this.phone, role: this.role, status: this.status}
        this.axios.post(process.env.API + '/regis_staff', {source: source}).then((response) => {
          if (response.data === 'success') {
            this.$swal('ลงทะเบียนเจ้าหน้าที่ใหม่เรียบร้อย', '', 'success')
            this.getListStaff()
            this.hide()
          } else if (response.data === 'fail') {
            this.$swal('เจ้าหน้าที่คนนี้เคยลงทะเบียนแล้ว', '', 'warning')
            this.getListStaff()
            this.hide()
          }
        }).catch(er => {
          this.loading = false
          console.log(er)
          this.$swal('การเชื่อมต่อผิดพลาด', 'กรุณาลองใหม่ภายหลัง', 'error')
        })
      }
    },

    deleteItem (item) {
      var me = this
      this.$swal({title: 'คุณแน่ใจหรือไม่ ?',
        text: 'ลบ ' + item.username,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result) {
          var source = { id: item.id, citizen_id: item.citizen_id }
          this.axios.post(process.env.API + '/delete_staff', {source: source}).then((response) => {
            console.log(response.data)
            if (response.data === 'success') {
              this.getListStaff()
              me.$swal('ลบเจ้าหน้าที่เรียบร้อย', '', 'success')
            } else {
              me.$swal('ลบเจ้าหน้าที่ไม่สำเร็จ', '', 'error')
            }
          })
        }
      }).catch(this.$swal.noop)
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    }
  }
}
</script>
