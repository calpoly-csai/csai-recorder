<template>
  <div class="page recents-view">
    <div class="content">
      <nav>
        <ion-icon name="arrow-back" @click="$router.push('classify')"></ion-icon>
      </nav>
      <h1>Recents</h1>
      <ul class="participants">
        <li
          class="participant"
          v-for="({ firstName, lastName }, index) in participants"
          :key="index"
          @click="queueAutofill(index)"
        >{{ firstName }} {{ lastName }}</li>
      </ul>
      <p
        v-if="!participants.length"
        class="empty-message"
      >People who you record during this session will appear here.</p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    participants() {
      return this.$store.state.participants;
    }
  },
  methods: {
    queueAutofill(index) {
      this.$store.commit("updateAutofillData", this.participants[index]);
      this.$router.push("/classify");
    }
  },
  mounted() {
    this.$emit("showMenu", false);
  }
};
</script>

<style lang="scss">
.recents-view {
  background: whitesmoke;
  .participants {
    padding: 20px 10px;
    list-style: none;
    .participant {
      cursor: pointer;
      padding: 5px 0;
      margin: 10px 0;
      transition: border-left 0.7s;
      border-left: 5px solid transparent;
      padding-left: 10px;

      &:hover {
        border-left: 5px solid var(--dark);
      }
    }
  }
}
</style>
