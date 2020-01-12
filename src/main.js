import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "@/modules/axios-config";
import Vuelidate from "vuelidate";
Vue.use(Vuelidate);

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/^ion-/];

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
