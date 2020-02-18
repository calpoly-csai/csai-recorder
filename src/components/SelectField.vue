<template>
  <div class="select-field">
    <p class="label">{{ label }}</p>
    <div class="choices" :class="{error: invalid}">
      <button
        class="choice"
        v-for="choice in choices"
        :key="choice.value"
        @click="selectChoice(choice.value)"
        :class="{ selected: choice.value === value }"
      >{{ choice.label }}</button>
    </div>
    <p class="label error" :class="{shown: invalid}">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    choices: {
      type: Array,
      required: true
    },
    value: String,
    invalid: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ""
    }
  },
  methods: {
    selectChoice(value) {
      this.$emit("input", value);
    }
  }
};
</script>

<style lang="scss">
.select-field {
  .label {
    margin-left: 5px;
    font-size: 12px;
    font-weight: 700;

    &.error {
      transition: all 0.7s;
      //Defaults to hidden state
      opacity: 0;
      transform: translateY(-100%);
      pointer-events: none;
      clip-path: inset(100% 0 0 0);
      font-weight: 500;
      color: red;

      &.shown {
        pointer-events: all;
        transform: translateY(0%);
        clip-path: inset(0 0 0 0);
        opacity: 1;
      }
    }
  }
  .choices {
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    overflow-y: scroll;

    &.error {
      background: #fdeded;
    }
    .choice {
      flex: 0 0 auto;
      color: var(--secondary);
      font-weight: 500;
      margin: 0;
      border: none;
      background: transparent;

      margin-right: 20px;
      cursor: pointer;
      padding: 10px;
      border-radius: 7px;
      transition: all 0.3s;

      &.selected {
        color: var(--dark);
      }
      &:active {
        transform: scale(0.99);
        background: whitesmoke;
      }
    }
  }
}
</style>
