<template lang="html">
  <v-app>
    <div class="bgg">
      <my-nav/>
      <v-content>
        <v-container fluid grid-list-xl text-xs-center>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card class="white-08opa">
                <v-card-title primary-title class="headline dark--text">
                  <v-layout row wrap justify-center>
                    รายงานการประชุม
                  </v-layout>
                </v-card-title>
                <v-card-text>
                  <cont-event/>
                  <export-list/>
                  </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
        <v-dialog max-width="90%" persistent v-model="chartDialog" :overlay="false" transition="dialog-transition" >
          <v-card>
            <v-btn @click="chartDialog = false" color="red" icon outline class="right"><v-icon>close</v-icon></v-btn>
            <v-card-text>
              <!-- <chart @getUsersList="getUserJoinEvent(eventId)" @refreshEvent="getAllEvents()" :loading="loading" :users="usersList" :events="eventsList" @showRegList="getUserJoinEvent($event),$vuetify.goTo('.v-content')" /> -->
            </v-card-text>
            <v-card-actions>
              <v-layout row wrap justify-center>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-content>
      <my-foot/>
    </div>
  </v-app>
</template>

<script>
import Nav from '@/components/index/Navbar'
import Foot from '@/components/index/Footer'
import ExportList from '@/components/reports/ExportEventList'
// import Chart from '@/components/reports/Chart'
export default {
  components: {
    'my-nav': Nav,
    'my-foot': Foot,
    // 'chart': Chart,
    'export-list': ExportList
  }
  // data () {
  //   return {
  //     chartDialog: false
  //   }
  // }
}
</script>

<style lang="css">

</style>
