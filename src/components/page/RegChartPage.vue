<template lang="html">
  <v-app>
    <!-- <div class=""> -->
    <!-- <my-nav/> -->
    <!-- <v-content> -->
    <!-- <v-container fluid grid-list-md text-xs-center> -->
    <!-- <v-layout row wrap> -->
    <!-- <v-flex xs10 offset-xs1 > -->
    <v-card-title>
      <v-btn dark color="blue-grey darken-1"  @click="back()">back</v-btn>
      <span class="subheading">ผู้เข้าร่วมการประชุม: {{conferenceName}}</span>
      <v-spacer></v-spacer>
    </v-card-title>
    <!-- <v-card class="yellow elevation-0 justify-center"> -->
    <v-card-title primary-title class="headline dark--text">
      <v-layout row wrap justify-center>
        สรุปรายชื่อผู้เข้าร่วมประชุม
      </v-layout>
    </v-card-title>
    <!-- <template> -->
    <v-container fluid grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs10 offset-xs1 >
          <!-- <div id="appp"> -->
          <div id="content">
            <!-- <canvas ref="chart"></canvas> -->
            <my-chart></my-chart>
          </div>
          <!-- </div> -->
        </v-flex>
      </v-layout>
    </v-container>
    <!-- </template> -->
    <!-- <v-card-text>
    <chart @toTop="$vuetify.goTo('.v-content')" @editUser=""/>
  </v-card-text> -->
  <!-- </v-card> -->
  <!-- </v-flex> -->
  <!-- </v-layout> -->
  <!-- </v-container> -->
  <!-- </v-content> -->
  <!-- <my-foot/> -->
  <!-- </div> -->
</v-app>
</template>

<script>
// import Chart from '@/components/reports/Chart'
import MyChart from '@/components/reports/Chart'
import Chart from 'chart.js'
export default {
  props: ['conferenceName', 'users', 'events', 'loading'],
  name: 'appp',
  components: {
    'chart': Chart,
    'my-chart': MyChart
  },
  data () {
    return {
      editDialog: false,
      showList: false
    }
  },
  mounted () {
    var chart = this.$refs.chart
    var ctx = chart.getContext('2d')
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'ผู้ประชุมทั้งหมด',
          'จำนวนคนที่มาประชุม',
          'จำนวนคนที่มาประชุมเพิ่มจากครั้งที่แล้ว',
          'จำนวนคนที่เขาประชุมทุกครั้ง'
        ],
        users: [],
        datasets: [{
          // label: 'คน',
          data: [1000, 852, 67, 756],
          backgroundColor: [
            'rgba(54, 162, 235, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 206, 86, 0.5)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1.5
        }]
      },
      options: {
        // scales: {
        //   yAxes: [{
        //     ticks: {
        //       beginAtZero: true
        //     }
        //   }]
        // },
        onClick: (event) => {
          var activePoints = myChart.getElementsAtEventForMode(event, 'point', myChart.options)
          if (activePoints.length > 0) {
            var firstPoint = activePoints[0]
            var label = myChart.data.labels[firstPoint._index]
            var value = myChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index]
            alert(label + ':' + value)
          }
        }
      }
    })
  },
  methods: {
    back () {
      this.$emit('back')
    }
  }
}
</script>

<style lang="css" scoped>
#appp {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #BBDEFB;
  /* margin-top: 40px; */
}
#content {
  margin: auto;
  width: auto;
  background-color: #FFFFFF;
  padding: 50px;
}
</style>
