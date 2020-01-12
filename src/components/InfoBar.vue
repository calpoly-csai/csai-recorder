<template>
  <transition name="info-bar" mode="out-in">
    <div v-if="isShown" class="info-bar">
      <p class="info">{{text}}</p>
    </div>
  </transition>
</template>
<script>
export default {
  computed: {
    text() {
      return this.$store.state.infoBar.text;
    },
    isShown() {
      return this.$store.state.infoBar.isShown;
    }
  }
};
</script>

<style lang="scss">
.info-bar {
  background: white;

  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  .info {
    text-align: center;
    width: 100%;
  }

  &-enter-active,
  &-leave-active {
    transition: all 0.7s;
  }

  &-enter,
  &-leave-to {
    transform: translateY(100%);
    opacity: 0;
  }
}
</style>