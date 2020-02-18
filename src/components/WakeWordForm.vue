<template>
  <form class="wake-word-form" @submit.prevent>
    <text-field
      v-model.trim="firstName.value"
      v-bind="firstName"
      @blur="$v.firstName.$touch()"
      :invalid="$v.firstName.$error"
      errorMessage="required"
    ></text-field>
    <text-field
      v-model.trim="lastName.value"
      v-bind="lastName"
      @blur="$v.lastName.$touch()"
      :invalid="$v.lastName.$error"
      errorMessage="required"
    ></text-field>
    <select-field
      v-model="gender.value"
      v-bind="gender"
      :invalid="$v.gender.$error"
      errorMessage="required"
    ></select-field>
    <select-field
      v-model="noiseLevel.value"
      v-bind="noiseLevel"
      :invalid="$v.noiseLevel.$error"
      errorMessage="required"
    ></select-field>
    <text-field
      v-model.trim="location.value"
      v-bind="location"
      @blur="$v.location.$touch()"
      :invalid="$v.location.$error"
      errorMessage="required"
    ></text-field>
    <select-field
      v-model="tone.value"
      v-bind="tone"
      :invalid="$v.tone.$error"
      errorMessage="required"
    ></select-field>
    <text-field
      v-model.trim="emphasis.value"
      v-bind="emphasis"
      @blur="$v.emphasis.$touch()"
      :invalid="$v.emphasis.$error"
      errorMessage="required"
    ></text-field>
  </form>
</template>

<script>
import TextField from "@/components/TextField";
import SelectField from "@/components/SelectField";
import { required } from "vuelidate/lib/validators";
export default {
  props: {
    script: {
      type: String,
      required: true
    }
  },
  components: {
    TextField,
    SelectField
  },
  data() {
    return {
      firstName: { label: "First Name", value: "" },
      lastName: { label: "Last Name", value: "" },
      gender: {
        label: "Gender",
        choices: [
          { label: "Male", value: "m" },
          { label: "Female", value: "f" },
          { label: "Other", value: "nb" }
        ],
        value: ""
      },
      noiseLevel: {
        label: "Noise Level",
        choices: [
          { label: "Quiet", value: "q" },
          { label: "Medium", value: "m" },
          { label: "Loud", value: "l" }
        ],
        value: ""
      },
      location: { label: "Location", value: "" },
      tone: {
        label: "Tone",
        choices: [
          { label: "Annoyed", value: "annoyed" },
          { label: "Happy", value: "happy" },
          { label: "Inquisitive", value: "inquisitive" },
          { label: "Neutral", value: "neutral" },
          { label: "Serious", value: "serious" }
        ],
        value: ""
      },
      emphasis: {
        label: "Emphasized Syllable",
        value: "",
        maxLength: 3
      }
    };
  },
  computed: {
    isWakeWord() {
      return this.script.toLowerCase().includes("nimbus");
    }
  },
  methods: {
    getData() {
      this.$v.$touch();
      if (this.$v.$error) return false;
      let fieldNames = Object.keys(this.$data);
      let formInfo = fieldNames.reduce((obj, field) => {
        obj[field] = this[field].value;
        return obj;
      }, {});
      formInfo.isWakeWord = this.isWakeWord;
      formInfo.script = this.script;
      return formInfo;
    },

    autofill() {
      let { autofillData } = this.$store.state;
      for (let key in autofillData) {
        if (!this.$data.hasOwnProperty(key)) continue;
        this[key].value = autofillData[key];
      }
      this.$store.commit("updateAutofillData", null);
    }
  },
  validations: {
    firstName: {
      value: {
        required
      }
    },
    lastName: {
      value: {
        required
      }
    },
    gender: {
      value: {
        required
      }
    },
    noiseLevel: {
      value: {
        required
      }
    },
    location: {
      value: {
        required
      }
    },
    tone: {
      value: {
        required
      }
    },
    emphasis: {
      value: {
        required
      }
    }
  },
  mounted() {
    if (this.$store.state.autofillData) this.autofill();
  }
};
</script>

<style lang="scss">
.wake-word-form {
  padding: 20px 10px;

  .text-field,
  .select-field {
    margin: 10px 0;
  }
  .options {
    margin-top: 40px;
  }
}
</style>