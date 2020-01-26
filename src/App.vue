<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view @showMenu="toggleMenu" />
    </transition>
    <transition name="hide" mode="out-in">
      <app-menu v-if="menuShown"></app-menu>
    </transition>

    <info-bar></info-bar>
  </div>
</template>
<script>
import InfoBar from "@/components/InfoBar";
import AppMenu from "@/components/Menu";
export default {
  components: {
    AppMenu,
    InfoBar
  },
  data() {
    return {
      menuShown: true
    };
  },
  methods: {
    toggleMenu(show) {
      this.menuShown = show;
    }
  }
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
}

#app {
  /*COLOR GUIDE*/
  --dark: #3b3b3b;
  --accent: #22a7e6;
  --light: white;
  --secondary: #a3a3a3;
  --menu-height: 65px;

  font-family: "Karla", Helvetica, Arial, sans-serif;
  font-size: 20px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--dark);
  height: 100%;
}

.page {
  display: block;
  width: 100%;
  height: 100%;
}

.with-menu {
  padding-bottom: var(--menu-height);
}

.content {
  background: white;
  width: 100%;
  max-width: 750px;
  min-height: 100%;
  padding: 15px 30px;
  margin: 0 auto;
}

h1 {
  font-size: 43px;
}

button {
  display: block;
  border: none;
  color: white;
  background: var(--dark);
  padding: 7px 67px;
  border-radius: 10px;
  font-family: inherit;
  font-size: inherit;
  margin: 20px auto;
  cursor: pointer;
  transition: transform 0.3s;

  &.shake {
    animation: shake 0.5s ease-in-out;
  }

  &:active {
    transform: scale(0.97);
  }
}

ion-icon {
  font-size: 40px;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 7px;

  &:active {
    transform: scale(0.95);
  }
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  margin-bottom: 30px;
  border-bottom: 1px solid var(--secondary);
}

.menu-icon {
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 15px;
  width: 70px;
  height: 70px;
  background: white;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.226);
  border-radius: 50%;
  transform: scale(0.8);
  opacity: 0;
  transition: all 0.5s;
  pointer-events: none;

  &.show {
    pointer-events: all;
    opacity: 1;
    transform: scale(1);
  }
}

//Responsive Queries
//=====================================================

@media screen and (min-width: 700px) {
  .menu-icon {
    bottom: auto;
    right: auto;
    top: 20px;
    left: 20px;
  }
}

//ANIMATIONS
//=====================================================
.fade {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.5s;
    pointer-events: none;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
  }
}

.hide {
  &-enter-active,
  &-leave-active {
    transition: transform 0.5s;
  }

  &-enter,
  &-leave-to {
    transform: translateY(100%);
  }
}

@keyframes shake {
  25% {
    transform: translateX(20px);
  }
  75% {
    transform: translateX(-20px);
  }
}
</style>
