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
      <!-- <span class="subheading">ผู้เข้าร่วมการประชุม: {{conferenceName}}</span> -->
      <v-spacer></v-spacer>
    </v-card-title>
    <!-- <v-card class="yellow elevation-0 justify-center"> -->
    <v-card-title primary-title class="headline dark--text">
      <v-layout row wrap justify-center text-xs-center>
        สรุปรายชื่อผู้เข้าร่วมประชุม: {{conferenceName}}
      </v-layout>
      <!-- <v-spacer></v-spacer>
      <div>
      <v-btn dark color="blue"  @click="showchart1 ()">กราฟวงกลม</v-btn>
      <v-btn dark color="blue" @click="showchart2 ()">กราฟแท่ง</v-btn>
    </div> -->
  </v-card-title>
  <!-- <template> -->
  <v-container fluid grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs10 offset-xs1>
        <!-- <div id="appp"> -->
        <div id="content">
          <!-- <my-chart></my-chart> -->
          <vue-chart numberSuffix="%"  type="bar" :data="chartData" :options="options"></vue-chart>
          <!-- <canvas ref="chart"></canvas> -->
        </div>
        <!-- </div> -->
        <br>

        <div>
          <v-card class="elevation-0">
            <v-layout row wrap justify-center text-xs-center>
              <v-flex xs3 md3>
                <h3>สรุปจำนวนผู้เข้าร่วมประชุม :</h3>
              </v-flex>
              <v-flex xs3 md3>
                รายชื่อผู้เข้าร่วมประชุมทั้งหมด : {{totalReg}} คน
              </v-flex>
              <v-flex xs3 md3>
                รายชื่อผู้เข้าร่วมประชุมในครั้งนี้ : {{count_user}} คน
              </v-flex>
              <v-flex xs3 md3>
                รายชื่อผู้เข้าร่วมประชุมรายใหม่ : {{new_user}} คน
              </v-flex>
            </v-layout>
          </v-card>
        </div>
        <!-- <div id="content">
        <vue-chart type="bar" :data="chartData" :options="options"></vue-chart>
      </div> -->
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
// import MyChart from '@/components/reports/Chart'
// import Chart from 'chart.js'
export default {
  props: ['conferenceName', 'count_user', 'new_user', 'totalReg'],
  name: 'appp',
  // mounted () {
  //  this.renderChart(this.count_user, this.new_user)
  // },
  components: {
    // 'my-chart': MyChart
  },
  data () {
    return {
      // chart1: true,
      // chart2: false,
      options: {
        // numberSuffix:'%',
        mode: 'percentege',
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              max: 100,
              steps: 10,
              stepValue: 10
              // numberSuffix:'%
            }
          }]
        }
      }
    }
  },
  computed: {
    typee () {
      return 'bar'
    },
    chartData () {
      return {
        labels: ['ผู้เข้าร่วมประชุมครั้งนี้(จากทั้งหมด)', 'ผู้เข้าร่วมประชุมรายใหม่(จากทั้งหมด)', 'ผู้เข้าร่วมประชุมใหม่(จากครั้งนี้)'],
        datasets: [{
          label: 'คิดเป็นเปอร์เซ็นต์',
          data: [parseInt((this.count_user * 100) / this.totalReg), parseInt((this.new_user * 100) / this.totalReg), parseInt((this.new_user * 100) / this.count_user)],
          backgroundColor: [
            'rgba(70, 191, 189, 0.9)',
            'rgba(239, 83, 80, 0.9)',
            'rgba(253, 180, 92, 0.9)'
          ],
          bordercolor: [
            'rgba(70, 191, 189, 1)',
            'rgba(239, 83, 80, 1)',
            'rgba(253, 180, 92, 1)'
          ],
          // hoverBackgroundColor: ["#EF9A9A", "#2196f3", "#03a9f4"], /*ชี้แล้วเปลี่ยนสี*/
          borderWidth: 2
        }]
      }
    }
  },
  methods: {
    showchart1 () {
      this.chart1 = true
      this.chart2 = false
    },
    showchart2 () {
      this.chart1 = false
      this.chart2 = true
    },
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
  background-color: #FAFAFA;
  padding: 50px;
}
</style>
