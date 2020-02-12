<template>
  <v-card>
    <v-card-title>
      <!-- <span class="subheading">รายชื่อการประชุม</span> -->
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="search" label="Search รายชื่อการประชุม / วันจัดงาน" single-line hide-details>
      </v-text-field>
      <v-btn color="primary" dark @click="dialog = true, addEvent()">เพิ่มการประชุม</v-btn>
    </v-card-title>
    <v-dialog v-model="dialog" persistent max-width="800px">
      <v-card class="footerbg">
        <v-card-text><h2 v-if="type === 'add'">เพิ่มการประชุม</h2><h2 v-if="type === 'edit'">แก้ไขงานการประชุม</h2>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                <v-text-field prepend-icon="assignment" :error-messages="nameErr" label="ชื่อการประชุม *" v-model="name_event">
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-menu ref="menu1" :close-on-content-click="false" v-model="menu1" :nudge-right="40" lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px">
                  <v-text-field slot="activator" v-model="dateFormatted" label="วันที่จัดงาน *" hint="ปี/เดือน/วัน" persistent-hint prepend-icon="event" @blur="date = parseDate(dateFormatted)">
                  </v-text-field>
                  <v-date-picker v-model="date" no-title @input="menu1 = false"></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <!-- <v-menu ref="menu2" :close-on-content-click="false" v-model="menu2" :nudge-right="40" :return-value.sync="form.time" lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px"> -->
                    <v-text-field slot="activator" :error-messages="timeErr" v-model="time" label="เวลาเริ่มงาน *" max="2359" prepend-icon="access_time" mask="##:##">
                  </v-text-field>
                  <!-- <v-time-picker v-if="menu2" v-model="form.time" format="24hr" @change="$refs.menu2.save(form.time)"> -->
                  <!-- </v-time-picker> -->
                <!-- </v-menu> -->
              </v-flex>
              <v-flex xs12 sm6 md6>
                <!-- <v-menu ref="menu" :close-on-content-click="false" v-model="modal2" :nudge-right="40" :return-value.sync="form.time2" lazy transition="scale-transition" offset--x full-width max-width="290px" min-width="290px"> -->
                  <v-text-field slot="activator" :error-messages="time2Err" v-model="time2" label="เวลาเลิกงาน *" prepend-icon="access_time" mask="##:##">
                  </v-text-field>
                  <!-- <v-time-picker v-if="modal2" v-model="form.time2" @change="$refs.menu.save(form.time2)"> -->
                  <!-- </v-time-picker> -->
                <!-- </v-menu> -->
              </v-flex>

            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions justify-center>
          <v-spacer></v-spacer>
          <v-btn style="border-radius: 0.3em" color="error" :disabled="loading"  @click.native="close">ยกเลิก</v-btn>
          <v-btn style="border-radius: 0.3em" color="primary" :disabled="loading" depressed @click.native="saveEvent()">
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
    <v-data-table :headers="headers" :items="listEvent" :search="search" :rows-per-page-items="[{ text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }, 10, 50]">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.row }}</td>
        <td class="text-xs-center">{{ props.item.name_event }}</td>
        <td class="text-xs-center">{{ props.item.time }}</td>
        <td class="text-xs-center">{{ props.item.time2 }}</td>
        <td class="text-xs-center">{{ props.item.date }}</td>
        <td class="text-xs-center">
          <v-btn style="border-radius: 0.3em" color="blue-grey" flat @click="editStatus(props.item)">
            <v-icon small class="mr-1">
              edit
            </v-icon>
            แก้ไข
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
</template>

<script>
export default {
  data () {
    const defaultForm = Object.freeze({
      id: '',
      name_event: '',
      number: ''
    })
    return {
      nameErr: '',
      name_event: '',
      timeErr: '',
      time2Err: '',
      loading: false,
      form: Object.assign({}, defaultForm),
      date: null,
      dateFormatted: null,
      menu1: false,
      time: null,
      time2: null,
      menu2: false,
      modal2: false,
      snackbar: false,
      dialog: false,
      search: '',
      editedIndex: -1,
      headers: [
        { text: 'ลำดับที่', align: 'centered', value: 'row' },
        { text: 'ชื่อการประชุม', align: 'centered', value: 'name_event', sortable: true, width: '600' },
        { text: 'เวลาเริ่มงาน', align: 'centered', value: 'start_time', sortable: true },
        { text: 'เวลาเลิกงาน', align: 'centered', value: 'end_time', sortable: true },
        { text: 'วันที่จัดงาน', align: 'centered', value: 'date', sortable: true },
        { text: 'จัดการ', align: 'centered', value: 'name', sortable: true }
      ],
      listEvent: [],
      type: ''
    }
  },
  computed: {
    formIsValid () {
      return (
        this.name_event &&
        this.time &&
        this.time2 &&
        this.date
      )
    },
    computedDateFormatted () {
      return this.formatDate(this.date)
    },
    formTitle () {
      return this.editedIndex === -1 ? 'เพิ่มงานสัมมนา' : 'แก้ไขงานสัมมนา'
    }
  },
  created () {
    this.getListEvent()
  },

  watch: {
    name_event () {
      var nameEvent = this.name_event
      for (var i = 0; i < nameEvent.length; i++) {
        if (nameEvent[i] === '/' || nameEvent[i] === '|' || nameEvent[i] === '\\' || nameEvent[i] === '*' || nameEvent[i] === '"' || nameEvent[i] === ':' || nameEvent[i] === '?' || nameEvent[i] === '>' || nameEvent[i] === '<') {
          this.nameErr = 'ไม่สามารถใช้ตัวอักษรดังนี้ / | \\ * > < ? : "'
        } else {
          this.nameErr = ''
        }
      }
    },
    date (val) {
      this.dateFormatted = this.formatDate(this.date)
    },
    dialog (val) {
      val || this.close()
    },
    time () {
      if (this.time > 2359 || this.time.length < 4) {
        this.timeErr = 'รูปแบบเวลาไม่ถูกต้อง'
      } else {
        this.timeErr = ''
      }
    },
    time2 () {
      if (this.time2 > 2359 || this.time2.length < 4) {
        this.time2Err = 'รูปแบบเวลาไม่ถูกต้อง'
      } else {
        this.time2Err = ''
      }
    }
  },

  methods: {
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${year}/${month}/${day}`
    },

    parseDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },

    hide () {
      this.dialog = false
      this.clearData()
    },

    clearData () {
      this.id = ''
      this.name_event = ''
      this.time = null
      this.time2 = null
      this.date = null
      this.dateFormatted = null
    },

    addEvent () {
      this.id = ''
      this.name_event = ''
      this.time = null
      this.time2 = null
      this.date = null
      this.dateFormatted = null
      this.type = 'add'
      this.dialog = true
    },

    editStatus (item) {
      this.id = item.id
      this.name_event = item.name_event
      this.time = item.time
      this.time2 = item.time2
      this.date = item.date
      this.type = 'edit'
      this.dialog = true
    },

    getListEvent () {
      this.axios.post(process.env.API + '/showevent').then((response) => {
        var moment = require('moment')
        var result = response.data
        var num = 1
        this.listEvent = []
        for (var i = 0; i < result.length; i++) {
          this.listEvent.push({
            row: num,
            id: result[i]['id'],
            name_event: result[i]['name_event'],
            time: moment(result[i]['start_time'], 'HH:mm:ss').format('HH:mm'),
            time2: moment(result[i]['end_time'], 'HH:mm:ss').format('HH:mm'),
            date: result[i]['start_date']
          })
          num += 1
        }
      })
    },
    saveEvent () {
      this.loading = true
      this.form.name_event = this.name_event
      this.form.time = this.time + '00'
      this.form.time2 = this.time2 + '00'
      // alert(this.time + ' - ' + this.time2)
      var source = ''
      if (this.form.name_event === '' || this.nameErr !== '') {
        this.$swal('กรุณากรอกชื่องานสัมมนา', '', 'warning')
        this.loading = false
      } else if (this.form.time === null || this.timeErr !== '') {
        this.$swal('กรุณากรอกเวลาเริ่มงานสัมมนา', '', 'warning')
        this.loading = false
      } else if (this.form.time2 === null || this.time2Err !== '') {
        this.$swal('กรุณากรอกเวลาเลิกงานสัมมนา', '', 'warning')
        this.loading = false
      } else if (this.date === null) {
        this.$swal('กรุณากรอกวันที่จัดการงานสัมมนา', '', 'warning')
        this.loading = false
      } else if (this.type === 'edit') {
        source = {id: this.id, name_event: this.form.name_event, start_time: this.form.time, end_time: this.form.time2, start_date: this.date}
        this.axios.post(process.env.API + '/update_event', {source: source}).then((response) => {
          if (response.data === 'success') {
            this.$swal('แก้ไขสำเร็จแล้ว', '', 'success')
            this.getListEvent()
            this.hide()
            this.loading = false
          }
        })
      } else if (this.type === 'add') {
        source = {name_event: this.form.name_event, start_time: this.form.time, end_time: this.form.time2, start_date: this.date}
        this.axios.post(process.env.API + '/create_event', {source: source}).then((response) => {
          if (response.data === 'success') {
            this.$swal('เพิ่มงานประชุมเรียบร้อยแล้ว', '', 'success')
            this.getListEvent()
            this.hide()
            this.loading = false
          } else if (response.data === 'fail') {
            this.$swal('วันนี้มีงานประชุมอยู่แล้ว', '', 'warning')
            this.getListEvent()
            this.hide()
            this.loading = false
          }
        })
      }
    },
    deleteItem (item) {
      var me = this
      this.$swal({
        title: 'คุณต้องการลบ ' + item.name_event + ' หรือไม่ ?',
        text: 'เมื่อคุณลบแล้วจะไม่สามารถกู้คืนหัวข้อนี้กลับมาได้',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        // reverseButtons: true,
        cancelButtonText: 'ยกเลิก',
        confirmButtonText: 'ยืนยัน'
      }).then((result) => {
        if (result) {
          var source = { id: item.id }
          this.axios.post(process.env.API + '/delete_event', {source: source}).then((response) => {
          // console.log(response.data)
            if (response.data === 'success') {
              this.getListEvent()
              me.$swal('ลบงานสัมมนาเรียบร้อย', '', 'success')
            } else {
              me.$swal('ลบงานสัมมนาไม่สำเร็จ', '', 'error')
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
