<template>
  <div>
    <navbar/>
    <Alert/>
    <div class="container-fluid">
      <div class="row">
        <sidebar/>
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>


<script>
import navbar from "./navbar";
import sidebar from "./sidebar";
import Alert from "./AlertMessage";

export default {
  components: {
    navbar,
    sidebar,
    Alert
  }
};
</script>
