<template>
  <div class="phrases page">
    <div class="content">
      <h1 class="title">Phrases</h1>
      <div class="text-editor" v-if="isEditing">
        <h3 class="field-label">Question</h3>
        <div
          class="text-input"
          ref="questionInput"
          contenteditable="true"
          @input="question = $event.target.innerText"
        ></div>
        <h3 class="field-label">Answer</h3>
        <div
          class="text-input"
          ref="answerInput"
          contenteditable="true"
          @input="answer = $event.target.innerText"
        ></div>
        <button class="primary" @click="tokenize">Tokenize</button>
      </div>
      <div v-else class="tokenizers">
        <h3 class="field-label">Question</h3>
        <tokenizer :text="question" :label="label" @input="tokenizedQuestion = $event"></tokenizer>
        <h3 class="field-label">Answer</h3>
        <tokenizer :text="answer" :label="label" @input="tokenizedAnswer = $event"></tokenizer>
        <button class="primary" @click="uploadPhrase" key="submit">Submit</button>
        <button class="secondary" @click="editText" key="edit">Edit</button>
      </div>
    </div>
    <div class="classifier" v-if="!isEditing">
      <div class="label" v-for="label in labels" :key="label" @click="setLabel(label)">{{ label }}</div>
    </div>
  </div>
</template>

<script>
import Tokenizer from "@/components/Tokenizer";
import { animateEl } from "@/modules/animation";
import tokens from "@/modules/classification-tokens";
import axios from "axios";
export default {
  components: {
    Tokenizer
  },
  data() {
    return {
      label: "",
      isEditing: true,
      question: "",
      answer: "",
      tokenizedQuestion: { format: "", variables: [] },
      tokenizedAnswer: { format: "", variables: [] },
      labels: Object.keys(tokens)
    };
  },
  methods: {
    tokenize() {
      this.isEditing = false;
      this.$emit("showMenu", false);
    },
    editText() {
      this.isEditing = true;
      this.$emit("showMenu", true);
      //TODO: build better solution for responsively replacing text
      setTimeout(() => {
        let { questionInput, answerInput } = this.$refs;
        questionInput.innerText = this.question;
        answerInput.innerText = this.answer;
      }, 100);
    },
    uploadPhrase() {
      let payload = {
        question: this.tokenizedQuestion,
        answer: this.tokenizedAnswer
      };
      axios.post("/new_data/phrase", payload).catch(err => console.error(err));
      this.question = "";
      this.answer = "";
      this.isEditing = true;
      this.$emit("showMenu", true);
    },
    setLabel(label) {
      this.label = label;
      //Clear the token in case it is selected again. Watchers don't update unless the value is different.
      setTimeout(() => {
        this.label = "";
      }, 100);
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
    .text-editor {
      .text-input {
        min-height: 54px;
        padding: 15px;
        border-radius: 7px;
        background: whitesmoke;
        max-height: 200px;
        overflow-y: scroll;
      }
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
