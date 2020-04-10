import Vue from "vue";
import VueRouter from "vue-router";
import Record from "../views/Record.vue";
import store from "@/store/index.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/record",
    name: "record",
    component: Record
  },
  {
    path: "/classify/:script",
    name: "classify",
    props: true,
    component: () =>
      import(/* webpackChunkName: "classify" */ "../views/Classify.vue"),
    beforeEnter: (to, from, next) => {
      if (!store.state.recording) next("/record");
      else next();
    }
  },
  {
    path: "/classify/:script/recents/",
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
    path: "/help",
    name: "help",
    component: () =>
      import(/* webpackChunkName: "recents" */ "../views/Help.vue")
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
