<template lang="html">
  <div>
    <div>
      <!-- <transition name="fade-transition"> -->
      <v-alert
      type="warning"
      :value="loginAlert"
      icon="warning"
      color="red"
      outline
      transition="scale-transition"
      >
      <!-- v-if="loginAlert" -->
      <!-- transition="scale-transition" -->
      {{loginAlertMsg}}
    </v-alert>
    <!-- </transition> -->
  </div>
  <v-spacer></v-spacer>
  <v-form >
    <!-- @submit.prevent="" -->
    <v-text-field
    :disabled="loading"
    name="userName"
    label="Username"
    id="userName"
    ref="username"
    v-model="userName"
    @keyup.enter="checkLogin()"
    required
    >
  </v-text-field>
  <v-text-field
  :disabled="loading"
  type="password"
  name="password"
  label="Password"
  id="password"
  ref="password"
  v-model="password"
  @keyup.enter="checkLogin()"
  required
  >
</v-text-field>
<v-spacer></v-spacer>
<v-btn outline  @click="checkLogin()" :disabled="loading">
  <div v-if="!loading">
    Login
  </div>
  <div v-else>
    <v-progress-circular indeterminate color="grey">

    </v-progress-circular>
  </div>
</v-btn>
</v-form>
</div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      loginAlertMsg: 'Invalid username and password!',
      loginAlert: false,
      isLogin: false,
      userName: '',
      password: ''
    }
  },
  methods: {
    checkLogin () {
      this.loading = true
      var source = ''
      source = {username: this.userName, password: this.password}
      this.loginAlert = false
      this.axios.post(process.env.API + '/login', {source: source}).then((response) => {
        var user = response.data
        if (user === 'fail') {
          this.loginAlert = true
          this.loginAlertMsg = 'Wrong username or password! Please try again.'
        } else {
          this.$cookies.set('isLogin', true)
          // console.log(user.data)
          this.$cookies.set('user', JSON.stringify(user[0]))
          this.checkDevice()
        }
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loginAlert = true
        this.loginAlertMsg = 'Login failed! No response from server.'
        this.loading = false
      })
    },
    checkDevice () {
      if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)) {
        this.$root.redirectTo('/mobile-reg-home')
      } else {
        this.$root.redirectTo('/reg')
      }
    }
  },
  computed: {

  },
  watch: {
    // userName () {
    //   this.loginAlert = false
    // },
    // password () {
    //   this.loginAlert = false
    // }
  }
}
</script>

<style lang="css">
</style>
