<template>
  <div class="tokenizer">
    <div v-for="(token, index) in tokens" class="token">
      <h4 class="label">{{ token.label }}</h4>
      <p
        class="text"
        @click="selectToken(index)"
        :class="{ selected: selectedIndicies.includes(index) }"
      >{{ token.text }}</p>
    </div>
  </div>
</template>

<script>
import tokens from "@/modules/classification-tokens";
export default {
  props: {
    /**
     * Current label being applied. Triggered on label change
     */
    label: String,
    /**
     * Text to tokenize
     */
    text: String
  },
  data() {
    return {
      tokens: [],
      selectedIndicies: []
    };
  },
  watch: {
    label(val) {
      if (val) this.labelToken(val);
    }
  },
  methods: {
    tokenizeText() {
      let hasValue = val => /[\w]/.test(val);
      this.tokens = this.text
        .replace(/[\n]/g, " ")
        .split(" ")
        .filter(hasValue)
        .map(word => ({
          text: word.trim(),
          label: ""
        }));
    },
    selectToken(index) {
      this.selectedIndicies.push(index);
      if (this.selectedIndicies.length > 1) this.editTokens();
    },
    editTokens() {
      this.selectedIndicies = this.selectedIndicies.sort();
      let [start, end] = this.selectedIndicies;
      if (start === end) this.splitToken(start);
      else this.combineTokensBetween(start, end);
      this.selectedIndicies = [];
      this.updateState();
    },
    updateState() {
      let payload = this.tokens.reduce(
        (payload, token) => {
          if (token.label) {
            let tokenId = tokens[token.label] || token.label;
            payload.format += `[${tokenId}] `;
            payload.variables.push(token.text);
          } else payload.format += token.text + " ";
          return payload;
        },
        { format: "", variables: [] }
      );
      payload.format = payload.format.trim();
      this.$emit("input", payload);
    },
    combineTokensBetween(start, end) {
      let combinedToken = this.tokens.slice(start, end + 1).reduce(
        (combined, token) => {
          combined.text += " " + token.text;
          if (token.label) combined.label = token.label;
          return combined;
        },
        { label: "", text: "" }
      );
      combinedToken.text = combinedToken.text.trim();
      this.tokens.splice(start, end - start + 1, combinedToken);
    },
    splitToken(index) {
      let splitTokens = this.tokens[index].text
        .split(" ")
        .filter(Boolean)
        .map(text => ({
          text,
          label: ""
        }));
      this.tokens.splice(index, 1, ...splitTokens);
      this.$emit("split");
    },
    labelToken(label) {
      for (let index of this.selectedIndicies) {
        this.tokens[index].label = label;
      }
      this.selectedIndicies = [];
      this.updateState();
    }
  },
  mounted() {
    this.tokenizeText();
  }
};
</script>

<style lang="scss">
.tokenizer {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding: 3px 15px;
  flex-wrap: wrap;

  .token {
    cursor: pointer;
    width: min-content;
    margin: 5px 15px;
    margin-block-start: auto;
    .label {
      font-size: 12px;
      white-space: nowrap;
      color: #696969;
      margin-left: 7px;
    }
    .text {
      text-align: center;
      padding: 10px;
      border-radius: 7px;
      border: 1px solid var(--dark);
      white-space: nowrap;

      &.selected {
        background: var(--dark);
        color: white;
      }
    }
  }
}

.swap {
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
