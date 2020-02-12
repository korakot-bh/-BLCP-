<template lang="html">
  <v-app style="background-color:#EEEEEE">
  <div class="bgg">
    <my-nav/>
    <v-container fill-height class="widthfull">
      <v-layout align-center row wrap>
        <v-flex xs12 sm6 md4 offset-sm1 offset-md1>
          <!-- <v-card class="elevation-12"> -->
          <div class="display-2 text-lg-center">
            BLCP Conference Registration
            <!-- ระบบลงทะเบียนเข้าร่วมประชุม -->
          </div>
          <!-- </v-card> -->
        </v-flex>
        <v-flex xs12 sm4 md4 offset-sm1 offset-md1>
          <div><login-form/></div>
        </v-flex>
      </v-layout>
    </v-container>
    <my-footer/>
</div>
  </v-app>
</template>

<script>
import LoginForm from '@/components/index/LoginForm'
import Footer from '@/components/index/Footer'
import Navbar from '@/components/index/Navbar'
export default {
  components: {
    'login-form': LoginForm,
    'my-footer': Footer,
    'my-nav': Navbar
  },
  created () {
    if (this.$cookies.isKey('isLogin')) {
      if (this.$cookies.get('isLogin') === 'true') {
        this.$root.redirectTo('/reg')
      }
    }
  }
}
</script>

<style lang="css" scoped>
.op{
  opacity: 0.7;
}
.bgg {
  background-image: url('../../assets/confer12.jpg');
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
