<template lang="html">
  <v-container grid-list-xs>
    <span>xxx</span>
    <v-layout row wrap>
      <v-dialog v-model="camDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span>Dialog 3</span>
            <v-spacer></v-spacer>
            <v-menu bottom left>

            </v-menu>
          </v-card-title>
          <v-card-actions>
            <v-btn color="primary" flat @click.stop="dialog3=false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'take-photo',
  props: ['value'],
  data () {
    return {
      camDialog: false
    }
  },
  methods: {
    toggleCamDialog () {
      camDialog = !camDialog
    }
  }
}
</script>

<style lang="css">
</style>
