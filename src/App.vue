<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
    <!-- <router-view/> -->
  </div>
</template>

<style lang="scss">
body{
  background-color: $colorE;
}
</style>
