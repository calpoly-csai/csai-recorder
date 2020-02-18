<template>
  <div class="text-field">
    <p class="label" :class="{ shown: showLabel }">{{ label }}</p>
    <input
      :value="value"
      :maxlength="maxLength"
      @input="$emit('input', $event.target.value)"
      @blur="$emit('blur', $event)"
      :placeholder="label"
      :type="type"
      :class="{ invalid }"
    />
    <p class="label error" :class="{ shown: invalid }">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: "text"
    },
    invalid: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number
    },
    errorMessage: String,
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
  width: min-content;
  transition: transform 0.5s, background 0.5s;
  border-radius: 7px;
  background: transparent;

  .label {
    margin-left: 5px;
    font-size: 12px;
    font-weight: 700;
    transition: all 0.7s;
    //Defaults to hidden state
    opacity: 0;
    transform: translateY(100%);
    pointer-events: none;
    clip-path: inset(0 0 100% 0);
    text-align: left;

    &.shown,
    &.error.shown {
      opacity: 1;
      transform: translateY(0%);
      clip-path: inset(0 0 0% 0);
      pointer-events: all;
    }

    &.error {
      font-weight: 500;
      transform: translateY(-100%);
      clip-path: inset(100% 0 0 0);
      color: red;
    }
  }
  input {
    text-align: left;
    font-family: inherit;
    font-size: inherit;
    font-weight: 500;
    border: none;
    background: white;
    border-radius: 7px;
    margin: 0;
    padding: 7px;
    color: var(--dark);

    &.invalid {
      background: #fdeded;
    }
  }
  ::placeholder {
    color: rgba(44, 44, 44, 0.486);
    font-weight: 500;
  }
}
</style>
