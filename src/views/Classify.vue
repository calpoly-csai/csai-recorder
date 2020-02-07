<template>
  <div class="page classify-view">
    <div class="content">
      <nav>
        <ion-icon name="arrow-back" @click="exit"></ion-icon>
        <ion-icon name="book" @click="$router.push('/recents')"></ion-icon>
      </nav>
      <div class="title">
        <h1>Classify</h1>
        <div v-if="audioBlob" class="audio" @click="playAudio">
          <img src="@/assets/play.svg" alt="play" />
        </div>
        <audio ref="audio"></audio>
      </div>

      <form @submit.prevent>
        <div class="field" v-for="field in fields" :key="field.label">
          <text-field
            v-if="field.type === 'text'"
            v-model="field.value"
            :label="field.label"
            v-bind="field.options"
          ></text-field>
          <select-field
            v-else-if="field.type === 'select'"
            v-model="field.value"
            :label="field.label"
            :choices="field.choices"
          ></select-field>
        </div>
        <div class="options">
          <button @click="postAudio(true)" ref="anotherButton">Another</button>
          <button @click="postAudio(false)" ref="doneButton">Done</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import TextField from "@/components/TextField";
import SelectField from "@/components/SelectField";
import { textFromCamelCase, textToCamelCase } from "@/modules/parser";
import { animateEl } from "@/modules/animation";
export default {
  components: {
    TextField,
    SelectField
  },
  props: {
    isWakeWord: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      audio: {
        url: null,
        controller: null,
        isPlaying: false
      },
      wasAutofilled: false,

      fields: [
        { label: "First Name", type: "text", value: "" },
        { label: "Last Name", type: "text", value: "" },
        {
          label: "Gender",
          type: "select",
          choices: [
            { label: "Male", value: "m" },
            { label: "Female", value: "f" },
            { label: "Other", value: "nb" }
          ],
          value: ""
        },
        {
          label: "Noise Level",
          type: "select",
          choices: [
            { label: "Quiet", value: "q" },
            { label: "Medium", value: "m" },
            { label: "Loud", value: "l" }
          ],
          value: ""
        },
        { label: "Location", type: "text", value: "" },
        {
          label: "Tone",
          type: "select",
          choices: [
            { label: "Annoyed", value: "annoyed" },
            { label: "Happy", value: "happy" },
            { label: "Inquisitive", value: "inquisitive" },
            { label: "Neutral", value: "neutral" },
            { label: "Serious", value: "serious" },
            { label: "Stern", value: "stern" }
          ],
          value: ""
        },
        {
          label: "Emphasized Syllable",
          type: "text",
          value: "",
          options: {
            maxLength: 3
          }
        }
      ]
    };
  },
  computed: {
    audioBlob() {
      return this.$store.state.recording;
    },
    fieldsAreValid() {
      return this.fields.every(field => field.value.length);
    }
  },
  methods: {
    setupAudio() {
      if (!this.audioBlob) return;
      this.audio.url = URL.createObjectURL(this.audioBlob);
      this.$refs.audio.src = this.audio.url;
    },
    playAudio() {
      if (this.audio.isPlaying) return;
      this.$refs.audio.play();
      setTimeout(() => {
        this.audio.isPlaying = false;
      }, 3000);
    },

    async postAudio(additionalTakes) {
      //Validate inputs.
      if (!this.fieldsAreValid) {
        let { anotherButton, doneButton } = this.$refs;
        let buttonToShake = additionalTakes ? anotherButton : doneButton;
        return animateEl(buttonToShake, "shake");
      }
      let { commit, dispatch } = this.$store;
      let data = this.getAudioMetadata();
      commit("updateParticipant", data);
      this.$store.state.recordingCount++;
      //Send Audio
      let payload = this.aggregatePayload(data);
      if (navigator.onLine) dispatch("uploadAudioSample", payload);
      else dispatch("cacheData", payload);
      //Queue autofill if taking another recording.
      if (additionalTakes) {
        data.tone = "";
        data.emphasis = "";
        commit("updateAutofillData", data);
      }
      this.$router.push("/");
    },
    getAudioMetadata() {
      return this.fields.reduce((obj, field) => {
        obj[textToCamelCase(field.label)] = field.value;
        return obj;
      }, {});
    },
    aggregatePayload(data) {
      //Create clone of data object so we don't mutate the original.
      data = { ...data };
      data.isWakeWord = this.isWakeWord;
      data.emphasis = data["Emphasized Syllable"];
      data.timestamp = parseInt(Date.now() / 1000);
      delete data.category;
      let formData = new FormData();
      formData.append("wav_file", this.audioBlob);
      for (let key in data) {
        formData.append(key, data[key]);
      }
      return formData;
    },
    exit() {
      this.$router.push("/");
    },
    autofill() {
      let { autofillData } = this.$store.state;
      for (let key in autofillData) {
        let label = textFromCamelCase(key);
        let field = this.fields.find(field => field.label === label);
        field.value = autofillData[key];
      }

      this.wasAutofilled = true;
      this.$store.commit("updateAutofillData", null);
    }
  },

  mounted() {
    this.$emit("showMenu", false);
    if (this.$store.state.autofillData) this.autofill();
    this.setupAudio();
  },
  beforeDestroy() {
    this.$refs.audio.src = "";
    this.$store.commit("eraseRecording");
    if (this.audio.url) URL.revokeObjectURL(this.audio.url);
  }
};
</script>

<style lang="scss">
.classify-view {
  background: whitesmoke;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .audio {
      position: relative;
      cursor: pointer;
      background: var(--dark);
      padding: 20px;
      border-radius: 50%;
      transition: transform 0.3s;

      &:active {
        transform: scale(0.97);
      }

      img {
        display: block;
        pointer-events: none;
      }
    }
  }
  form {
    padding: 20px 10px;

    .field {
      margin: 10px 0;
    }
    .options {
      margin-top: 40px;
    }
  }
}
</style>
