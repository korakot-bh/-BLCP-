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
                    จัดการรายการประชุม
                  </v-layout>
                </v-card-title>
                <v-card-text>
                  <cont-event/>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
      <my-foot/>
    </div>
  </v-app>
</template>
<script>
import Nav from '@/components/index/Navbar'
import Foot from '@/components/index/Footer'
import ContentEvent from '@/components/managements/EventContent'
export default {
  components: {
    'my-nav': Nav,
    'my-foot': Foot,
    'cont-event': ContentEvent
  }
}
</script>
<style lang="css">
</style>
