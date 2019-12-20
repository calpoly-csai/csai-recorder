<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

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
  --accent: #419bc6;
  --light: white;
  --secondary: #a3a3a3;

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
    background: whitesmoke;
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

@keyframes shake {
  25% {
    transform: translateX(20px);
  }
  75% {
    transform: translateX(-20px);
  }
}
</style>
