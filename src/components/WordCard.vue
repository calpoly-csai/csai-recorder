<template>
  <div class="word-card">
    <span class="text">Say </span
    ><span class="word" ref="word" contenteditable="true" @blur="updateWord"
      >Nimbus</span
    >
    <ion-icon
      @click="randomizeWord"
      ref="shuffle"
      class="shuffle-icon"
      name="sync"
    ></ion-icon>
  </div>
</template>

<script>
import words from "@/modules/nimbus-rhymes";
import { animateEl } from "@/modules/animation";
export default {
  methods: {
    updateWord(event) {
      if (!event.target.innerText) event.target.innerText = "Nimbus";
      this.$emit("update", event.target.innerText);
    },
    randomizeWord() {
      let index = (words.length * Math.random()) >> 0;
      this.$refs.word.innerText = words[index];
      animateEl(this.$refs.shuffle, "spin");
    }
  }
};
</script>

<style lang="scss">
.word-card {
  max-width: 90%;
  width: 400px;
  background: white;
  padding: 20px;
  text-align: center;
  border-radius: 10px;
  margin: auto;

  span {
    font-size: 25px;
  }

  .word {
    color: var(--accent);
    font-weight: 700;
  }

  .shuffle-icon {
    display: block;
    fill: var(--accent);
    margin: 0px auto;
    margin-top: 20px;
    margin-bottom: 0;

    &.spin {
      animation: spin 0.7s;

      @keyframes spin {
        to {
          transform: rotate(-360deg);
        }
      }
    }
  }
}
</style>
