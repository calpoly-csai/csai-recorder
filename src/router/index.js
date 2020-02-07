import Vue from "vue";
import VueRouter from "vue-router";
import Record from "../views/Record.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/record",
    name: "record",
    component: Record
  },
  {
    path: "/classify/:isWakeWord",
    name: "classify",
    props: true,
    component: () =>
      import(/* webpackChunkName: "classify" */ "../views/Classify.vue")
  },
  {
    path: "/recents",
    name: "recents",
    component: () =>
      import(/* webpackChunkName: "recents" */ "../views/Recents.vue")
  },
  {
    path: "/phrases",
    name: "phrases",
    component: () =>
      import(/* webpackChunkName: "recents" */ "../views/Phrases.vue")
  },
  {
    path: "*",
    name: "default",
    component: Record
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
