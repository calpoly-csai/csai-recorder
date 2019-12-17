<template>
  <div id="app">
    <transition name="fade">
      <router-view />
    </transition>
  </div>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
  margin: 0;
}

#app {
  /*COLOR GUIDE*/
  --dark: #3b3b3b;
  --accent: #419bc6;
  --light: white;
  --secondary: #a3a3a3;

  font-family: "Karla", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #3b3b3b;
}

.page {
  width: 100%;
  height: 100vh;
}

//ANIMATIONS
//=====================================================
.fade {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.5s;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
  }
}
</style>
