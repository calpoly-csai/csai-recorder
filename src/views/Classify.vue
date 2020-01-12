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
          <text-field v-if="field.type === 'text'" v-model="field.value" :label="field.label"></text-field>
          <select-field
            v-else-if="field.type === 'select'"
            v-model="field.value"
            :label="field.label"
            :choices="field.choices"
          ></select-field>
        </div>
        <button @click="postAudio(true)" ref="anotherButton">Another</button>
        <button @click="postAudio(false)" ref="doneButton">Done</button>
      </form>
    </div>
  </div>
</template>

<script>
import TextField from "@/components/TextField";
import SelectField from "@/components/SelectField";
import axios from "axios";
import { textFromCamelCase, textToCamelCase } from "@/modules/parser";
import { animateEl } from "@/modules/animation";
export default {
  components: {
    TextField,
    SelectField
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
        {
          label: "Category",
          type: "select",
          choices: [
            { label: "Wake Word", value: "ww" },
            { label: "Not Wake Word", value: "nww" }
          ],
          value: ""
        },
        { label: "First Name", type: "text", value: "" },
        { label: "Last Name", type: "text", value: "" },
        {
          label: "Gender",
          type: "select",
          choices: [
            { label: "Male", value: "m" },
            { label: "Female", value: "f" }
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
        { label: "Tone", type: "text", value: "" },
        { label: "Emphasis", type: "text", value: "" }
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
      let data = this.getAudioMetadata();
      this.$store.commit("updateParticipant", data);
      this.$store.state.recordingCount++;
      //Send Audio
      let payload = this.aggregatePayload(data);
      let config = {
        headers: { "content-type": "multipart/form-data" }
      };
      let res = await axios.post("/examples/wakeword", payload, config);
      console.log(res);
      //Queue autofill if taking another recording.
      if (additionalTakes) {
        data.tone = "";
        this.$store.commit("updateAutofillData", data);
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
      data.isWakeWord = data.category === "ww";
      data.timestamp = parseInt(Date.now() / 1000);
      delete data.category;
      let formData = new FormData();
      formData.append("audio", this.audioBlob);
      for (let key in data) {
        formData.append(key, data[key]);
      }
      return formData;
    },
    exit() {
      this.$store.commit("eraseRecording");
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
    if (this.$store.state.autofillData) this.autofill();
    this.setupAudio();
  },
  beforeDestroy() {
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
  }
}
</style>
