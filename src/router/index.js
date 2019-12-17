import Vue from "vue";
import VueRouter from "vue-router";
import Record from "../views/Record.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "record",
    component: Record
  },
  {
    path: "/classify",
    name: "classify",
    component: () =>
      import(/* webpackChunkName: "classify" */ "../views/Classify.vue")
  },
  {
    path: "/recents",
    name: "recents",
    component: () =>
      import(/* webpackChunkName: "recents" */ "../views/Recents.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
