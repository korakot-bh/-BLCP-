<template>
  <!-- <v-content> -->
    <!-- <v-container fluid fill-height> -->
      <v-layout row wrap justify-center>
        <v-flex lg12 md12 xs12 sm12>
          <div>
            <v-toolbar flat color="white">
              <v-toolbar-title>จัดการงานสัมมนา</v-toolbar-title>
              <v-divider
                class="mx-2"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
              <v-dialog v-model="dialog" max-width="800px">
                <v-btn slot="activator" color="primary" dark class="mb-2" @click="addEvent()">เพิ่มงานสัมมนา</v-btn>
              <v-card>

                  <v-card-text><h2 v-if="type === 'add'">เพิ่มงานสัมมนา</h2><h2 v-if="type === 'edit'">แก้ไขงานสัมมนา</h2>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12 sm6 md6>
                          <v-text-field
                          prepend-icon="assignment"
                          label="ชื่องานสัมมนา *"
                          v-model="form.name_event"
                        ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                          <v-menu
                          ref="menu2"
                          :close-on-content-click="false"
                          v-model="menu2"
                          :nudge-right="40"
                          :return-value.sync="form.time"
                          lazy
                          transition="scale-transition"
                          offset-y
                          full-width
                          max-width="290px"
                          min-width="290px"
                          >
                          <v-text-field
                          slot="activator"
                          v-model="form.time"
                          label="เวาเริ่มงานสัมมนา *"
                          prepend-icon="access_time"
                          readonly
                          ></v-text-field>
                          <v-time-picker
                          v-if="menu2"
                          v-model="form.time"
                          format="24hr"
                          @change="$refs.menu2.save(form.time)"
                          ></v-time-picker>
                        </v-menu>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                          <v-menu
                          ref="menu"
                          :close-on-content-click="false"
                          v-model="modal2"
                          :nudge-right="40"
                          :return-value.sync="form.time2"
                          lazy
                          transition="scale-transition"
                          offset-y
                          full-width
                          max-width="290px"
                          min-width="290px"
                          >
                          <v-text-field
                          slot="activator"
                          v-model="form.time2"
                          label="เวลาเลิกงานสัมมนา *"
                          prepend-icon="access_time"
                          readonly
                          ></v-text-field>
                          <v-time-picker
                          v-if="modal2"
                          v-model="form.time2"
                          format="24hr"
                          @change="$refs.menu.save(form.time2)"
                          ></v-time-picker>
                        </v-menu>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                          <v-menu
                          ref="menu1"
                          :close-on-content-click="false"
                          v-model="menu1"
                          :nudge-right="40"
                          lazy
                          transition="scale-transition"
                          offset-y
                          full-width
                          max-width="290px"
                          min-width="290px"
                          >
                            <v-text-field
                            slot="activator"
                            v-model="dateFormatted"
                            label="วันที่จัดงานสัมมนา *"
                            hint="YYYY/MM/DD format"
                            persistent-hint
                            prepend-icon="event"
                            @blur="date = parseDate(dateFormatted)"
                            ></v-text-field>
                            <v-date-picker v-model="date" no-title @input="menu1 = false"></v-date-picker>
                          </v-menu>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="close">ยกเลิก</v-btn>
                    <v-btn color="primary" depressed @click.native="saveEvent()">บันทึก</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>

            <v-data-table
              :headers="headers"
              :items="listEvent"
              :search="search"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.id }}</td>
                <td class="text-xs-center">{{ props.item.name_event }}</td>
                <td class="text-xs-center">{{ props.item.time }}</td>
                <td class="text-xs-center">{{ props.item.time2 }}</td>
                <td class="text-xs-center">{{ props.item.date }}</td>
                <td class="justify-center layout px-0">
                  <v-icon
                    small
                    class="mr-2"
                    @click="editStatus(props.item)"
                  >
                    edit
                  </v-icon>
                  <v-icon
                    small
                    @click="deleteItem(props.item)"
                  >
                    delete
                  </v-icon>
                </td>
              </template>
              <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your search for "{{ search }}" found no results.
              </v-alert>
            </v-data-table>
          </div>
        </v-flex>
      </v-layout>
    <!-- </v-container> -->
  <!-- </v-content> -->
</template>

<script>
  export default {
    data () {
      const defaultForm = Object.freeze({
        id: '',
        name_event: ''
      })
      return {
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
          { text: 'ลำดับที่', value: 'id' },
          { text: 'รายชื่องานสัมมนา', align: 'centered', value: 'name_event', sortable: false },
          { text: 'เวลาเริ่มงานสัมมนา', align: 'centered', value: 'start_time', sortable: false },
          { text: 'เวลาเลิกงานสัมมนา', align: 'centered', value: 'end_time', sortable: false },
          { text: 'วันที่จัดงานสัมมนา', align: 'centered', value: 'start_date', sortable: false },
          { text: 'Actions', align: 'centered', value: 'name', sortable: false }
        ],
        listEvent: [],
        type: ''
      }
    },
    computed: {
      formIsValid () {
        return (
          this.form.name_event &&
          this.form.time &&
          this.form.time2 &&
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
      date (val) {
        this.dateFormatted = this.formatDate(this.date)
      },
      dialog (val) {
        val || this.close()
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
        this.form.name_event = ''
        this.form.time = null
        this.form.time2 = null
        this.date = null
        this.dateFormatted = null
      },

      addEvent () {
        this.id = ''
        this.form.name_event = ''
        this.form.time = null
        this.form.time2 = null
        this.date = null
        this.dateFormatted = null
        this.type = 'add'
        this.dialog = true
      },

      editStatus (item) {
        this.id = item.id
        this.form.name_event = item.name_event
        this.form.time = item.time
        this.form.time2 = item.time2
        this.date = item.date
        this.type = 'edit'
        this.dialog = true
      },

      getListEvent () {
        this.axios.post(process.env.API + '/showevent').then((response) => {
          var result = response.data
          this.listEvent = []
          for (var i = 0; i < result.length; i++) {
            var starttime = result[i]['start_time']
            var endtime = result[i]['end_time']
            var startdate = result[i]['start_date']
            this.listEvent.push({
              id: result[i]['id'],
              name_event: result[i]['name_event'],
              time: starttime,
              time2: endtime,
              date: startdate
            })
          }
        })
      },

      saveEvent () {
        var source = ''
        if (this.form.name_event === '') {
          this.$swal('กรุณากรอกชื่องานสัมมนา', '', 'warning')
        } else if (this.form.time === null) {
          this.$swal('กรุณากรอกเวลาเริ่มงานสัมมนา', '', 'warning')
        } else if (this.form.time2 === null) {
          this.$swal('กรุณากรอกเวลาเลิกงานสัมมนา', '', 'warning')
        } else if (this.date === null) {
          this.$swal('กรุณากรอกวันที่จัดการงานสัมมนา', '', 'warning')
        } else if (this.type === 'edit') {
          source = {id: this.form.id, name_event: this.form.name_event, start_time: this.form.time, end_time: this.form.time2, start_date: this.date}
          this.axios.post(process.env.API + '/update_event', {source: source}).then((response) => {
            if (response.data === 'success') {
              this.$swal('แก้ไขสถานะแล้ว', '', 'success')
              this.getListEvent()
              this.hide()
            }
          })
        } else if (this.type === 'add') {
          source = {name_event: this.form.name_event, start_time: this.form.time, end_time: this.form.time2, start_date: this.date}
          this.axios.post(process.env.API + '/create_event', {source: source}).then((response) => {
            if (response.data === 'success') {
              this.$swal('เพิ่มงานสัมมนาเรียบร้อย', '', 'success')
              this.getListEvent()
              this.hide()
            } else if (response.data === 'fail') {
              this.$swal('วันนี้มีงานสัมมนาแล้ว', '', 'warning')
              this.getListEvent()
              this.hide()
            }
          })
        }
      },

      deleteItem (item) {
        var me = this
        this.$swal({title: 'คุณแน่ใจหรือไม่ ?',
          text: 'ลบ ' + item.name_event,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'ยืนยัน',
          cancelButtonText: 'ยกเลิก'
        }).then((result) => {
          if (result) {
            var source = { id: item.id }
            this.axios.post(process.env.API + '/delete_event', {source: source}).then((response) => {
              console.log(response.data)
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
