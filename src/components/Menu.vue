<template>
  <div class="menu">
    <router-link to="record" class="choice">
      <ion-icon name="mic"></ion-icon>
    </router-link>
    <router-link to="phrases" class="choice">
      <ion-icon name="quote"></ion-icon>
    </router-link>
    <router-link to="help" class="choice">
      <ion-icon name="help" @click="openTutorial"></ion-icon>
    </router-link>
  </div>
</template>

<script>
export default {
  methods: {
    openTutorial() {
      window.open("https://youtu.be/3lczVrzJcEg", "_blank");
    }
  }
};
</script>

<style lang="scss">
.menu {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: var(--menu-height);
  background: var(--dark);
  box-shadow: 0px 0 30px rgba(0, 0, 0, 0.164);
  padding: 10px 20px;

  ion-icon {
    height: 40px;
    margin: auto;
    padding: 0;
    fill: white;
  }

  .choice {
    text-align: center;
    text-decoration: none;
    display: block;
    color: white;
    transition: opacity 0.5s, transform 0.5s;
    padding: 0 20px;

    &:active {
      transform: scale(0.95);
      opacity: 0.7;
    }
  }
}
</style>
