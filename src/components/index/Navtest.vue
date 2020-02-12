<template lang="html">
  <div>
    <v-toolbar class="nav" app color="black">
      <v-toolbar-side-icon  @click.stop="drawer = !drawer" v-if="isLogin"></v-toolbar-side-icon>
    </v-toolbar>
  </div>
</template>

<script>
</script>

<style lang="css" scoped>
.logo {
  width: 135px;
  height: 46px;
}
.nav {
  opacity: 0.3
}
</style>
