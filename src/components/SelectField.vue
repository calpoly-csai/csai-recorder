<template>
  <div class="select-field">
    <p class="label">{{ label }}</p>
    <div class="choices">
      <button
        class="choice"
        v-for="choice in choices"
        :key="choice.value"
        @click="selectChoice(choice.value)"
        :class="{ selected: choice.value === value }"
      >{{ choice.label }}</button>
    </div>
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
    value: String
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
    font-size: 12px;
    font-weight: 700;
  }
  .choices {
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
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
