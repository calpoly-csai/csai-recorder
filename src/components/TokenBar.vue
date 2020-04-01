<template>
  <div class="token-bar">
    <div
      v-if="inputShown"
      class="text-field"
      contenteditable="true"
      @input="updateLabelInput"
      @keyup.enter="addLabel"
      @keydown.enter="$event.preventDefault()"
      @paste="pasteText"
      @blur="hideInput"
      ref="labelInput"
    ></div>
    <img
      class="add-button"
      :class="{active: inputShown}"
      @click="addLabel"
      src="@/assets/add-icon.svg"
      alt="add-label"
    />
    <div
      class="label"
      v-for="label in filteredLabels"
      :key="label"
      @click="$emit('update', label)"
    >{{ label }}</div>
  </div>
</template>

<script>
import tokens from "@/modules/classification-tokens";
export default {
  data() {
    return {
      labels: Object.keys(tokens),
      inputShown: false,
      labelInput: ""
    };
  },
  computed: {
    filteredLabels() {
      let lowercasedInput = this.labelInput.toLowerCase();
      return this.labels.filter(label =>
        label.toLowerCase().includes(lowercasedInput)
      );
    }
  },
  methods: {
    updateLabelInput(e) {
      this.labelInput = e.target.innerText;
    },
    addLabel() {
      let hasContent = /[a-zA-Z]/;
      if (this.inputShown && hasContent.test(this.labelInput)) {
        this.labels.unshift(this.labelInput);
        this.$emit("update", this.labelInput);
        this.labelInput = this.$refs.labelInput.innerText = "";
      } else if (!this.inputShown) {
        setTimeout(() => {
          this.$refs.labelInput.focus();
        }, 100);
      }
      this.inputShown = !this.inputShown;
    },
    pasteText(e) {
      e.preventDefault();
      let text = (e.originalEvent || e).clipboardData.getData("text/plain");
      e.target.innerText = text;
    },
    hideInput() {
      if (this.labelInput.length) return;
      this.inputShown = false;
    }
  }
};
</script>

<style lang="scss">
.token-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
  width: 100%;
  background: var(--accent);
  overflow-x: scroll;

  .add-button {
    display: block;
    height: 30px;
    margin: 0 20px;
    fill: white;
    opacity: 0.5;

    &.active {
      opacity: 1;
    }
  }

  .text-field {
    color: white;
    padding: 0 20px;
    margin-left: 40px;
  }

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
</style>