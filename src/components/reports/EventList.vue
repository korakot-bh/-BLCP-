<template lang="html">
  <v-card>
    <v-card v-if="!showList">
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
        v-model="search"
        append-icon="search"
        label="Search ชื่อการประชุม / วันที่จัดงาน"
        single-line
        hide-details
        ></v-text-field>
        <v-btn color="primary" flat icon @click="refresh()"><v-icon>refresh</v-icon></v-btn>
      </v-card-title>
      <v-data-table
      v-if="!showList"
      :headers="headers"
      :items="events"
      :search="search"
      :loading="loading"
      no-data-text="ไม่มีข้อมูลการประชุม"
      :rows-per-page-items="[{ text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }, 10, 50]"
      >
      <v-progress-circular size="50" slot="progress" indeterminate></v-progress-circular>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.name}}</td>
        <td class="text-xs-center">{{ props.item.date }}</td>
        <td class="text-xs-center">{{ props.item.time}}</td>
        <td class="text-xs-center">{{ props.item.totalReg }}</td>
        <td class="text-xs-center">{{ props.item.newReg }}</td>
        <td class="text-xs-center"><v-btn dark color="cyan lighten-8" @click="showRegList(props.item)">รายชื่อผู้เข้าร่วมประชุม</v-btn></td>
      </template>

      <v-alert slot="no-results" outline :value="true" color="error" icon="warning">
        ไม่พบข้อมูล "{{ search }}" ที่คุณค้นหา.
      </v-alert>
    </v-data-table>
  </v-card>
  <reg-list @getUsersList="getUsersList()" :loading="loading" v-if="showList" :users="users" @editUser="editUser($event)" :conferenceName="conName" @back="back()"/>
</v-card>
</template>

<script>
import RegList from '@/components/reports/RegListTab'
export default {
  props: ['events', 'users', 'loading'],
  components: {
    'reg-list': RegList
  },
  data () {
    return {
      showList: false,
      conName: '',
      search: '',
      headers: [
        {
          text: 'การประชุม',
          align: 'center',
          value: 'id'
        },
        {
          text: 'ชื่อการประชุม',
          align: 'center',
          value: 'name'
        },
        {
          text: 'วันที่จัดงาน',
          align: 'center',
          value: 'date'
        },
        {
          text: 'เวลาจัดงาน',
          align: 'center',
          value: 'time',
          sortable: false,
          width: '200'
        },
        {
          text: 'ผู้เข้าร่วมทั้งหมด',
          align: 'center',
          value: 'event_totalReg',
          sortable: false,
          width: '20'
        },
        {
          text: 'ผู้ลงทะเบียนใหม่',
          align: 'center',
          value: 'event_newReg',
          sortable: false,
          width: '20'
        },
        {
          text: 'รายงาน',
          align: 'center',
          value: 'report',
          sortable: false
        }
      ],
      users: []
    }
  },
  methods: {
    getUsersList () {
      this.$emit('getUsersList')
    },
    refresh () {
      this.$emit('refreshEvent')
    },
    showRegList (event) {
      this.conName = event.name
      this.showList = true
      this.$emit('showRegList', event.event_id)
    },
    back () {
      this.conName = ''
      this.showList = false
      this.refresh()
    },
    editUser (blcp) {
      this.$emit('editUser', blcp)
    }
  }
}
</script>

<style lang="css">
</style>
