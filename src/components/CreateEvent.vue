<template lang="html">
  <v-container>
    <div style="background-color:white">
      <v-snackbar
        v-model="snackbar"
        absolute
        top
        right
        color="success"
      >
        <span>Registration successful!</span>
        <v-icon dark>check_circle</v-icon>
      </v-snackbar>
      <h1>ลงทะเบียนงานสัมมนา</h1><br>
      <v-form ref="form" @submit.prevent="submit">
        <v-layout row wrap>
          <v-flex xs12 lg6>
            <v-subheader>ชื่อสัมมนา</v-subheader>
            </v-flex>
            <v-flex xs12 lg5>
              <v-text-field
              prepend-icon="assignment"
              label="Name"
              :rules="rules.name_event"
              v-model="form.name_event"
              required
            ></v-text-field>
            </v-flex>

            <v-flex xs12 lg6>
              <v-subheader>เวลาเริ่มงาน</v-subheader>
            </v-flex>
            <v-flex xs12 lg5>
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
              :rules="rules.time"
              required
              slot="activator"
              v-model="form.time"
              label="Start Time"
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

          <v-flex xs12 lg6>
            <v-subheader>เวลาเลิกงาน</v-subheader>
          </v-flex>
          <v-flex xs12 lg5>
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
            :rules="rules.time"
            required
            slot="activator"
            v-model="form.time2"
            label="End Time"
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

        <v-flex xs12 lg6>
          <v-subheader>วันที่จัดงานสัมมนา</v-subheader>
        </v-flex>
        <v-flex xs12 lg5>
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
            :rules="rules.date"
            required
            slot="activator"
            v-model="dateFormatted"
            label="Date"
            hint="DD/MM/YYYY format"
            persistent-hint
            prepend-icon="event"
            @blur="date = parseDate(dateFormatted)"
            ></v-text-field>
            <v-date-picker v-model="date" no-title @input="menu1 = false"></v-date-picker>
          </v-menu>
          </v-flex>
        </v-layout><br>
        <v-layout>
          <v-spacer></v-spacer>
          <v-flex>
            <v-btn
            :disabled="!formIsValid"
            type="submit"
            color="primary"
            style="float:right"
            @click="createEvent"
            >บันทึก</v-btn>
            <v-btn
            outline color="primary"
            style="float:right"
            @click="resetForm"
            >ยกเลิก</v-btn>
          </v-flex>
        </v-layout>
      </v-form>
    </div>
  </v-container>
</template>

<script>
export default {
  data () {
    const defaultForm = Object.freeze({
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
      rules: {
        name_event: [val => (val || '').length > 0 || 'This field is required'],
        time: [val => val != null || 'This field is required'],
        date: [val => val != null || 'This field is required']
      }
    }
  },

  computed: {
    computedDateFormatted () {
      return this.formatDate(this.date)
    },
    formIsValid () {
      return (
        this.form.name_event &&
        this.form.time &&
        this.form.time2 &&
        this.date
      )
    }
  },

  watch: {
    date (val) {
      this.dateFormatted = this.formatDate(this.date)
    }
  },

  methods: {
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate (date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    createEvent () {
      var source = {name_event: this.form.name_event, start_time: this.date + ' ' + this.form.time, end_time: this.date + ' ' + this.form.time2, start_date: this.date}
      this.axios.post(process.env.API + '/create_event', {source: source}).then((response) => {
        console.log(response.data)
      })
    },
    resetForm () {
      this.form = Object.assign({}, this.defaultForm)
      this.$refs.form.reset()
    },
    submit () {
      this.snackbar = true
      this.resetForm()
    }
  }
}
</script>

<style lang="css">
</style>
