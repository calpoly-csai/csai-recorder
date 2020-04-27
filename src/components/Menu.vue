<template>
  <div class="menu">
    <router-link to="record" class="choice">
      <div class="iconBox">
        <ion-icon name="mic"></ion-icon>
      </div>
    </router-link>
    <router-link to="phrases" class="choice">
      <div class="iconBox">
        <ion-icon name="quote"></ion-icon>
      </div>
    </router-link>
    <router-link to="help" class="choice">
      <div class="iconBox">
        <ion-icon name="help"></ion-icon>
      </div>
    </router-link>
  </div>
</template>

<script>

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

  .iconBox {
    height: var(--menu-height);
    width: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;

    ion-icon {
      height: 40px;
      margin: auto;
      padding: 0;
      fill: white;
    }

    @media(hover: hover) and (pointer: fine) {
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .choice {
    text-align: center;
    text-decoration: none;
    display: block;
    color: white;
    transition: opacity 0.5s, transform 0.5s;
    padding: 0;

    &:active {
      transform: scale(0.95);
      opacity: 0.7;
    }
  }
}
</style>
