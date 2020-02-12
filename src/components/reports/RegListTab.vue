<template lang="html">
  <v-card>
    <v-card-title>
      <v-btn dark color="blue-grey darken-1"  @click="back()">back</v-btn>
      <span class="subheading">ผู้เข้าร่วมการประชุม: {{conferenceName}}</span>
      <v-spacer></v-spacer>
      <v-text-field
      v-model="search"
      append-icon="search"
      label="Search"
      single-line
      hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
    :headers="headers"
    :items="users"
    :search="search"
    :loading="loading"
    no-data-text="ไม่มีข้อมูลผู้เข้าร่วมประชุม"
    :rows-per-page-items="[{ text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }, 10, 50]"
    >
    <v-progress-circular size="50" slot="progress" indeterminate></v-progress-circular>
    <template slot="items" slot-scope="props">
      <td>{{ props.item.code }}</td>
      <td class="text-xs-center">{{ props.item.fullname}}</td>
      <td class="text-xs-center">{{ props.item.checkin }}</td>
      <td class="text-xs-center">{{ props.item.checkout }}</td>
      <td class="text-xs-center">{{ props.item.time }}</td>
      <td class="text-xs-center">
        <div v-if="props.item.info === ''">
          <v-icon title="ข้อมูลยังไม่ครบ">indeterminate_check_box</v-icon>
        </div>
        <div v-else>
          <v-icon title="ข้อมูลครบแล้ว" color="green">check_box</v-icon>
        </div>
      </td>
      <td class="text-xs-center">
        <div v-if="props.item.payment === 0">
          <v-icon title="จ่ายเงินแล้ว" color="green" @click="managePayment(props.item.joinID, 1)">check_box</v-icon>
        </div>
        <div v-else>
          <v-icon title="ไม่ได้รับเงิน" @click="managePayment(props.item.joinID, 0)">indeterminate_check_box</v-icon>
        </div>
      </td>
      <td class="text-xs-center">
        <div v-if="props.item.card === 1">
          <v-icon title="ได้รับบัตรแล้ว" @click="manageCard(props.item.citizenID, 0)" color="green">check_box</v-icon>
        </div>
        <div v-else>
          <v-icon title="ยังไม่ได้รับ" @click="manageCard(props.item.citizenID, 1)">indeterminate_check_box</v-icon>
        </div>
      </td>
      <td class="text-xs-center">
        <v-btn v-if="props.item.info === ''" color="primary" flat @click="editUser(props.item.blcp_code)">
          <v-icon class="mr-1" small>edit</v-icon>แก้ไขข้อมูล
        </v-btn>
        <v-btn v-if="props.item.card !== 1" flat color="primary" @click="print(props.item.blcp_code)">
          <v-icon class="mr-1" small>print</v-icon>พิมพ์บัตร
        </v-btn>
      </td>
    </template>
    <v-alert slot="no-results" outline :value="true" color="error" icon="warning">
      ไม่พบข้อมูล "{{ search }}" ที่คุณค้นหา.
    </v-alert>
  </v-data-table>
</v-card>
</template>

<script>
export default {
  props: ['conferenceName', 'users', 'loading'],
  data () {
    return {
      search: '',
      headers: [
        {
          text: 'ผู้เข้าร่วม',
          align: 'center',
          value: 'user_code'
        },
        {
          text: 'ชื่อ-นามสกุล',
          align: 'center',
          value: 'fullname'
        },
        {
          text: 'เวลาเข้างาน',
          align: 'center',
          value: 'checkIn',
          sortable: false
        },
        {
          text: 'เวลาออกจากงาน',
          align: 'center',
          value: 'checkOut',
          sortable: false
        },
        {
          text: 'ระยะเวลาเข้าร่วมประชุม',
          align: 'center',
          value: 'joinedTime',
          sortable: false
        },
        {
          text: 'ข้อมูลผู้ใช้',
          align: 'center',
          value: 'info',
          width: '20'
        },
        {
          text: 'การจ่ายเงิน',
          align: 'center',
          value: 'payment',
          width: '20'
        },
        {
          text: 'สถานะบัตร',
          align: 'center',
          value: 'card',
          width: '20'
        },
        {
          text: 'จัดการผู้ใช้',
          align: 'center',
          value: 'action',
          sortable: false,
          width: '100'
        }
      ],
      users: []
    }
  },
  methods: {
    managePayment (joinID, receivedMoney) {
      var text = ''
      if (receivedMoney === 0) {
        text = 'กดยืนยันเพื่อเปลี่ยนสถานะเป็น "ได้รับเงินแล้ว"'
      } else {
        text = 'กดยืนยันเพื่อเปลี่ยนสถานะเป็น "ยังไม่ได้รับ"'
      }
      this.$swal({
        title: 'แก้ไขสถานะการจ่ายเงินหรือไม่ ?',
        text: text,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'ยกเลิก',
        confirmButtonText: 'ยืนยัน'
      }).then(result => {
        if (result) {
          this.loading = true
          var manager = JSON.parse(this.$cookies.get('user'))
          var data = {id: joinID, manager_id: manager.id, manager_fullname: (manager.firstname + ' ' + manager.lastname), received_money: receivedMoney}
          this.users = []
          this.axios.post(process.env.API + '/receivedMoney_byID', {data: data}).then(response => {
            if (response.data === 'success') {
              this.loading = false
              this.$emit('getUsersList')
              this.$swal('แก้ไขสำเร็จแล้ว', '', 'success')
            } else {
              this.loading = false
              this.$swal('แก้ไขไม่สำเร็จ', 'แก้ไขผิดพลาด กรุณาลองใหม่ภายหลัง', 'error')
            }
          }).catch(er => {
            this.loading = false
            console.log(er)
            this.$swal('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'กรุณาลองใหม่ในภายหลัง', 'error')
          })
        }
      })
    },
    manageCard (citizenID, recievedCard) {
      var text = ''
      if (recievedCard === 0) {
        text = 'กดยืนยันเพื่อเปลี่ยนสถานะบัตรเป็น "ยังไม่ได้รับบัตร"'
      } else {
        text = 'กดยืนยันเพื่อเปลี่ยนสถานะบัตรเป็น "ได้รับบัตรแล้ว"'
      }
      this.$swal({
        title: 'แก้ไขสถานะบัตรหรือไม่ ?',
        text: text,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'ยกเลิก',
        confirmButtonText: 'ยืนยัน'
      }).then(result => {
        if (result) {
          this.loading = true
          this.users = []
          this.axios.post(process.env.API + '/receive_card', {source: {citizen_id: citizenID, received_card: recievedCard}}).then(response => {
            if (response.data === 'success') {
              this.loading = false
              this.$emit('getUsersList')
              this.$swal('แก้ไขสำเร็จ!', '', 'success')
            } else {
              this.loading = false
              this.$swal('แก้ไขไม่สำเร็จ!', 'กรุณาลองใหม่อีกครั้ง', 'error')
            }
          }).catch(er => {
            this.loading = false
            console.log(er)
            this.$swal('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'กรุณาลองใหม่อีกครั้ง', 'error')
          })
        }
      })
    },
    print (blcp) {
      let routeData = this.$router.resolve({name: 'card-printing', query: {blcp: blcp}})
      window.open(routeData.href, '_blank')
    },
    back () {
      this.$emit('back')
    },
    editUser (blcp) {
      this.$emit('editUser', blcp)
    }
  }
}
</script>

<style lang="css">
</style>
