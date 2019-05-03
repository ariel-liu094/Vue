<template>
  <div id="app">
    <!-- <HelloWorld/> -->

    <router-view/>
    <router-view name="footer"></router-view>
  </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld";

export default {
  name: "App"
  // components: {
  //   HelloWorld
  // }
};
</script>

<style lang="scss">
@import "./assets/all";
</style>
