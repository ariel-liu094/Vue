// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import "bootstrap";
import Loading from "vue-loading-overlay";
// Import stylesheet
import "vue-loading-overlay/dist/vue-loading.css";
import VeeValidate from "vee-validate";
import zhTW_VeeValidate from "vee-validate/dist/locale/zh_TW";

import App from "./App";
import router from "./router";
import currencyFilters from "./filters/currency";
import date from "./filters/date";

import "./bus";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.component("Loading", Loading);
Vue.filter("currency", currencyFilters);
Vue.filter("date", date);
Vue.use(VeeValidate);
VeeValidate.Validator.localize("zh_TW", zhTW_VeeValidate);

axios.defaults.withCredentials = true;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  components: { App },
  template: "<App/>",
  router
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // console.log("這裡需要驗証");
    const api = `${process.env.APIPATH}/api/user/check`;
    axios.post(api).then(response => {
      console.log(response.data);
      if (response.data.success) {
        next();
      } else {
        next({
          path: `/login`
        });
      }
    });
  } else {
    next();
  }
});
