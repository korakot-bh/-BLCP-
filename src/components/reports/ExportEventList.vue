<template lang="html">
  <v-card>
    <v-card v-if="!showList">
      <!-- <v-card class="white-08opa"> -->
      <!-- <v-card-title primary-title class="headline dark--text">
        <v-layout row wrap justify-center>
          รายงานการประชุม
        </v-layout>
      </v-card-title> -->
  <!-- </v-card> -->
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
        v-model="search"
        append-icon="search"
        label="Search ชื่อการประชุม / วันที่จัดงาน"
        single-line
        hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
      v-if="!showList"
      :headers="headers"
      :items="listEvent"
      :search="search"
      :rows-per-page-items="[{ text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }, 10, 50]"
      >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.row }}</td>
        <td class="text-xs-center">{{ props.item.name_event}}</td>
        <td class="text-xs-center">{{ props.item.date }}</td>
        <td class="text-xs-center">{{ props.item.time }}</td>
        <td class="text-xs-center">{{ props.item.count_user }}</td>
        <td class="text-xs-center">{{ props.item.new_user }}</td>
        <td class="text-xs-center"><v-btn dark color="blue lighten-1" @click="showChart(props.item)" small title="สรุปรายชื่อผู้เข้าร่วมประชุม"><v-text>สถิติข้อมูลการประชุม</v-text></v-btn></td>
        <td class="text-xs-center"><v-btn dark color="green lighten-1" @click="downloadReport(props.item)" icon title="กดเพื่อดาวน์โหลด"><v-icon>get_app</v-icon></v-btn><iframe ref="iFramDownload" style="display:none;"></iframe></td>
      </template>
      <v-alert slot="no-results" outline :value="true" color="error" icon="warning">
        ไม่พบข้อมูล "{{ search }}" ที่คุณค้นหา.
      </v-alert>
    </v-data-table>
  </v-card>
  <chart-list @getUsersList="getListEvent(eventId)" @getTotaluserr="getTotalUser(eventId)" v-if="showList" :count_user="users" :new_user='newusers' :totalReg="totalReg" :conferenceName="conName" @back="back()"/>
</v-card>
</template>
<script>
import Chart from '@/components/reports/Chart'
export default {
  props: ['events', 'users', 'loading'],
  components: {
    'chart-list': Chart
  },
  data () {
    return {
      usersList: [],
      showList: false,
      search: '',
      headers: [
        {
          text: 'การประชุม',
          align: 'center',
          value: 'row'
        },
        {
          text: 'ชื่อการประชุม',
          align: 'center',
          value: 'name_event'
        },
        {
          text: 'วันที่จัดงาน',
          align: 'center',
          value: 'date'
        },
        {
          text: 'เวลาที่จัดงาน',
          align: 'center',
          value: 'time'
        },
        {
          text: 'ผู้เข้าร่วมทั้งหมด',
          align: 'center',
          value: 'count_user'
        },
        {
          text: 'ผู้เข้าร่วมใหม่',
          align: 'center',
          value: 'new_user'
        },
        {
          text: 'รายชื่อผู้เข้าร่วมประชุม',
          align: 'center',
          value: 'chart_report'
        },
        {
          text: 'ดาวน์โหลดเอกสาร',
          align: 'center',
          value: 'report'
        }
      ],
      listEvent: [],
      id: '',
      name_event: '',
      time: null,
      date: null,
      count_user: '',
      totalReg: '',
      new_user: '',
      conName: ''
    }
  },

  created () {
    this.getListEvent()
    this.getTotalUser()
  },

  methods: {
    // showRegList (event) {
    //   this.conName = event
    //   this.showList = true
    //   this.$emit('toTop')
    // },
    back () {
      // this.conName = ''
      this.showList = false
      this.conName = ''
    },
    getUsersList () {
      this.$emit('getUsersList')
    },
    getTotaluserr () {
      this.$emit('getTotaluserr')
    },
    getTotalUser () {
      this.axios.post(process.env.API + '/get_count_TotalUser').then(res => {
        if (res.data.length > 0) {
          this.totalReg = res.data[0].count
        }
      })
    },
    getListEvent () {
      this.axios.post(process.env.API + '/getEventList').then((response) => {
        var moment = require('moment')
        var result = response.data
        this.listEvent = []
        for (var i = 0; i < result.length; i++) {
          if (result[i]['newReg'] === null) {
            result[i]['newReg'] = '-'
          }
          if (result[i]['totalReg'] === null) {
            result[i]['totalReg'] = '-'
          }
          this.listEvent.push({
            row: i + 1,
            id: result[i]['event_id'],
            name_event: result[i]['name_event'],
            time: moment(result[i]['start_time'], 'HH:mm:ss').format('HH:mm') + ' - ' + moment(result[i]['end_time'], 'HH:mm:ss').format('HH:mm'),
            date: result[i]['start_date'],
            count_user: result[i]['totalReg'],
            new_user: result[i]['newReg']
          })
        }
      })
    },
    async downloadReport (item) {
      var source = {event_id: item.id, name_event: item.name_event}
      this.axios.post(process.env.API + '/exportExcelUser', {source: source}).then((response) => {
        this.filename = response.data.filename
        this.$refs.iFramDownload.src = process.env.API + '/downloadfile/' + this.filename[1]
      })
    },
    showChart (event) {
      this.getTotalUser()
      this.showList = true
      this.conName = event.name_event
      this.users = event.count_user
      this.newusers = event.new_user
      this.total_Reg = event.totalReg
    }
  }
}
</script>

<style lang="css">
</style>
