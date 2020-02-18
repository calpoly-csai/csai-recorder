<template>
  <div class="page classify-view">
    <div class="content">
      <nav>
        <ion-icon name="arrow-back" @click="exit"></ion-icon>
        <ion-icon name="book" @click="$router.push({name: 'recents'})"></ion-icon>
      </nav>
      <div class="title">
        <h1>Classify</h1>
        <div v-if="audioBlob" class="audio" @click="playAudio">
          <img src="@/assets/play.svg" alt="play" />
        </div>
        <audio ref="audio"></audio>
      </div>
      <wake-word-form ref="form" :script="script"></wake-word-form>
      <div class="options">
        <button class="primary" @click="postAudio(true)" ref="anotherButton">Record Again</button>
        <button class="secondary" @click="postAudio(false)" ref="doneButton">Done</button>
      </div>
    </div>
  </div>
</template>

<script>
import WakeWordForm from "@/components/WakeWordForm";
import { textFromCamelCase, textToCamelCase } from "@/modules/parser";
import { animateEl } from "@/modules/animation";
export default {
  components: {
    WakeWordForm
  },
  props: {
    script: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      audio: {
        url: null,
        controller: null,
        isPlaying: false
      }
    };
  },
  computed: {
    audioBlob() {
      return this.$store.state.recording;
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
      let data = this.$refs.form.getData();
      if (!data) {
        let { anotherButton, doneButton } = this.$refs;
        let buttonToShake = additionalTakes ? anotherButton : doneButton;
        return animateEl(buttonToShake, "shake");
      }
      debugger;
      let { commit, dispatch } = this.$store;
      commit("updateParticipant", data);
      this.$store.state.recordingCount++;
      //Send Audio
      let payload = this.aggregatePayload(data);
      // if (navigator.onLine) dispatch("uploadAudioSample", payload);
      // else dispatch("cacheRecording", payload);
      //Queue autofill if taking another recording.
      let autofillData = null;
      if (additionalTakes) {
        data.tone = "";
        data.emphasis = "";
        autofillData = data;
      }
      commit("updateAutofillData", autofillData);
      this.$router.push("/record");
    },
    aggregatePayload(data) {
      //Create clone of data object so we don't mutate the original.
      data.timestamp = parseInt(Date.now() / 1000);
      let formData = new FormData();
      formData.append("wav_file", this.audioBlob);
      for (let key in data) {
        formData.append(key, data[key]);
      }
      return formData;
    },
    exit(event) {
      event.target.disabled = true;
      this.$store.commit("eraseRecording");
      this.$router.push("/record");
    }
  },

  mounted() {
    this.$emit("showMenu", false);
    this.setupAudio();
  },
  beforeDestroy() {
    this.$refs.audio.src = "";
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
}
</style>
