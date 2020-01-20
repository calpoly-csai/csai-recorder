<template>
  <div class="phrases page">
    <div class="content">
      <h1 class="title">Phrases</h1>
      <h3 class="tokenizer-label">Question</h3>
      <tokenizer :state="tokenizerState" v-model="question" :label="label" @split="label = ''"></tokenizer>
      <h3 class="tokenizer-label">Answer</h3>
      <tokenizer :state="tokenizerState" v-model="answer" :label="label" @split="label = ''"></tokenizer>
      <transition-group name="fase">
        <button v-if="!isTokenizing" @click="tokenize" key="tokenize">Tokenize</button>
        <button v-if="isTokenizing" @click="uploadPhrase" key="submit">Submit</button>
        <button v-if="isTokenizing" @click="editText" key="edit">Edit</button>
      </transition-group>
    </div>
    <div class="classifier" v-if="tokenizerState == 'token' ">
      <div class="label" v-for="label in labels" :key="label" @click="setLabel(label)">{{label}}</div>
    </div>
  </div>
</template>

<script>
import Tokenizer from "@/components/Tokenizer";
import { animateEl } from "@/modules/animation";
export default {
  components: {
    Tokenizer
  },
  data() {
    return {
      label: "",
      tokenizerState: "edit",
      question: { text: "", tokens: [] },
      answer: { text: "" },
      labels: ["Office Hours", "Professor", "Classrooms"]
    };
  },
  computed: {
    isTokenizing() {
      return this.tokenizerState == "token";
    }
  },
  methods: {
    tokenize() {
      this.tokenizerState = "token";
      this.$emit("showMenu", false);
    },
    editText() {
      this.tokenizerState = "edit";
      this.$emit("showMenu", true);
    },
    uploadPhrase() {
      let payload = { quesiton: this.question, answer: this.answer };
      this.tokenizerState = "edit";
      this.$emit("showMenu", true);
    },
    setLabel(label) {
      this.label = label;
    }
  }
};
</script>

<style lang="scss">
.phrases {
  .content {
    .title {
      margin: 20px 0;
    }

    h3 {
      font-size: 15px;
    }
  }

  .classifier {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: flex-start;
    height: 50px;
    width: 100%;
    padding: 15px 0;
    background: var(--accent);
    overflow-x: scroll;

    .label {
      cursor: pointer;
      margin: 0 20px;
      white-space: nowrap;
      flex: 0 0 auto;
      color: white;
      transition: transform 0.5s;
      &:active {
        transform: scale(0.95);
      }
    }
  }
}
</style>