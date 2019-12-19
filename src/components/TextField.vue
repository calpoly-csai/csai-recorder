<template>
  <div class="text-field" :class="{ drift: !value.length }">
    <p class="label" :class="{ shown: showLabel }">{{ label }}</p>
    <input
      :value="value"
      @input="$emit('input', $event.target.value)"
      :placeholder="label"
      type="text"
    />
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    value: String
  },
  computed: {
    showLabel() {
      return this.value.length;
    }
  }
};
</script>

<style lang="scss">
.text-field {
  transition: transform 0.5s;
  &.drift {
    transform: translateY(-14px);
  }
  .label {
    font-size: 12px;
    font-weight: 700;
    transition: all 0.7s;
    //Defaults to hidden state
    opacity: 0;
    transform: translateY(100%);
    pointer-events: none;
    clip-path: inset(0 0 100% 0);

    &.shown {
      opacity: 1;
      transform: translateY(0%);
      clip-path: inset(0 0 0% 0);
      pointer-events: all;
    }
  }
  input {
    font-family: inherit;
    font-size: inherit;
    border: none;
    padding: 5px;
  }
  ::placeholder {
    color: var(--secondary);
    font-weight: 700;
  }
}
</style>
