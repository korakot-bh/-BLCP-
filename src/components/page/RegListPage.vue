<template lang="html">
  <v-app>
    <div class="bgg">
      <my-nav/>
      <v-content>
        <v-container fluid grid-list-xl text-xs-center>
          <v-layout row wrap justify-center>
            <v-flex xs12>
              <v-card class="white-08opa">
                <v-card-title primary-title class="headline dark--text">
                  <v-layout row wrap justify-center>
                    รายชื่อการประชุมและผู้เข้าร่วม
                  </v-layout>
                </v-card-title>
                <v-card-text>
                  <event-list @getUsersList="getUserJoinEvent(eventId)" @refreshEvent="getAllEvents()" :loading="loading" :users="usersList" :events="eventsList" @showRegList="getUserJoinEvent($event), $vuetify.goTo('.v-content')" @editUser="editUser($event)"/>
                  <!-- <v-progress-circular v-else indeterminate size="100" color="white"></v-progress-circular> -->
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
        <v-dialog max-width="900px" persistent v-model="editDialog" :overlay="false" transition="dialog-transition" >
          <edit-form :user="userInfo" :loading="loadingUser" @edited="getUserJoinEvent(eventId)" @close="editDialog = false"/>
        </v-dialog>
      </v-content>
      <my-foot/>
    </div>
  </v-app>
</template>

<script>
import Nav from '@/components/index/Navbar'
import Foot from '@/components/index/Footer'
import EventList from '@/components/reports/EventList'
import EditForm from '@/components/checkin/EditForm'
export default {
  components: {
    'my-nav': Nav,
    'my-foot': Foot,
    'event-list': EventList,
    'edit-form': EditForm
  },
  data () {
    return {
      loadingUser: false,
      loading: false,
      editDialog: false,
      eventsList: [],
      usersList: [],
      userInfo: '',
      eventId: ''
    }
  },
  created () {
    this.getAllEvents()
  },
  methods: {
    editUser (blcp) {
      // alert(blcp)
      this.editDialog = true
      this.getUserInfo(blcp)
    },
    getUserInfo (blcp) {
      this.loadingUser = true
      this.axios.post(process.env.API + '/get_userby_blcp', {data: {blcp_code: blcp}}).then(res => {
        if (res.data.length > 0) {
          // console.log(res.data)
          this.userInfo = res.data[0]
          this.loadingUser = false
        }
      }).catch(er => {
        console.log(er)
        this.loadingUser = false
        this.$swal('เกิดข้อผิดพลาดการเชื่อมต่อ', 'กรุณาลองใหม่ภายหลัง', 'error')
      })
    },
    setUserList () {
      var temp = this.usersList
      var moment = require('moment')
      // console.log(temp)
      this.usersList = []
      for (var i = 0; i < temp.length; i++) {
        var userTemp = {}
        userTemp.id = temp[i].id
        userTemp.joinID = temp[i].joinID
        userTemp.blcp_code = temp[i].blcp_code
        userTemp.code = i + 1
        userTemp.citizenID = temp[i].citizen_id
        userTemp.fullname = temp[i].firstname + ' ' + temp[i].lastname
        if (temp[i].checkin_datetime === null) {
          userTemp.checkin = '-'
        } else {
          userTemp.checkin = moment(temp[i].checkin_datetime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')
        }
        if (temp[i].checkout_datetime === null) {
          userTemp.checkout = '-'
        } else {
          userTemp.checkout = moment(temp[i].checkout_datetime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')
        }
        if (temp[i].times === null) {
          userTemp.time = '-'
        } else {
          userTemp.time = moment(temp[i].times, 'HH:mm:ss').format('HH:mm')
        }
        if (temp[i].address === '' || temp[i].city === '' || temp[i].district === '') {
          userTemp.info = ''
        } else {
          userTemp.info = '-'
        }
        userTemp.payment = temp[i].received_money
        userTemp.card = temp[i].received_card
        this.usersList.push(userTemp)
      }
    },
    getUserJoinEvent (event) {
      this.loading = true
      this.eventId = event
      this.usersList = []
      this.axios.post(process.env.API + '/getUserByEvent', {event_id: event}).then(res => {
        if (res.data.length > 0) {
          this.usersList = res.data
          this.setUserList()
          this.loading = false
        }
      }).catch(er => {
        console.log(er)
        this.loading = false
        this.$swal('เกิดข้อผิดพลาดการเชื่อมต่อ', 'กรุณาลองใหม่ภายหลัง', 'error')
      })
    },
    setEventList () {
      var moment = require('moment')
      var temp = this.eventsList
      for (var i = 0; i < temp.length; i++) {
        this.eventsList[i].event_id = temp[i].id
        this.eventsList[i].id = i + 1
        this.eventsList[i].name = temp[i].name_event
        this.eventsList[i].date = moment(temp[i].start_date, 'YYYY-MM-DD').format('DD/MM/YYYY')
        this.eventsList[i].time = moment(temp[i].start_time, 'HH:mm:ss').format('HH:mm') + ' - ' + moment(temp[i].end_time, 'HH:mm:ss').format('HH:mm')
        if (temp[i].totalReg === null) {
          this.eventsList[i].totalReg = '-'
        } else {
          this.eventsList[i].totalReg = temp[i].totalReg
        }
        if (temp[i].newReg === null) {
          this.eventsList[i].newReg = '-'
        } else {
          this.eventsList[i].newReg = temp[i].newReg
        }
      }
    },
    getAllEvents () {
      this.eventsList = []
      this.loading = true
      this.axios.post(process.env.API + '/getEventList').then(response => {
        if (response.data.length > 0) {
          this.eventsList = response.data
          this.setEventList()
          this.loading = false
        }
      }).catch(error => {
        console.log(error)
        this.$swal('การเชื่อมต่อผิดพลาด', 'กรุกรุณาลองใหม่ภายหลัง', 'error')
        this.loading = false
      })
    }
  }
}
</script>

<style lang="css">
</style>
