<template>
  <div class="page record-view" @touchmove.prevent>
    <canvas ref="canvas"></canvas>
    <div v-if="state === 'countdown'" class="countdown-container">
      <h2 class="countdown">{{ counter }}</h2>
    </div>
    <h3 v-else-if="state === 'recording'" class="recording-prompt">"{{script}}"</h3>
    <div v-else-if="state === 'transition'" class="transition"></div>
    <div v-else-if="state === 'error'" class="error-container">
      <h2>🔇</h2>
      <p>
        Please provide mic access. If you didn't deny audio access, your browser
        might not support audio recording. Try reloading the page.
      </p>
      <button class="reload" @click="reloadPage">Reload</button>
    </div>
    <div v-else class="microphone-container">
      <word-card @update="script = $event"></word-card>
      <ion-icon name="mic" class="mic" @click="getAudioSample"></ion-icon>
      <p class="recording-count">{{ recordingCountLabel }}</p>
    </div>
  </div>
</template>

<script>
import { CanvasBlob, ProgressRing } from "@/modules/canvas";
import { tween, delay, animateEl } from "@/modules/animation";
import WordCard from "@/components/WordCard";
export default {
  components: {
    WordCard
  },
  data() {
    return {
      /** The script that the user will speak into the mic*/
      script: "Nimbus",
      /**Class which controls the amorphous central circle canvas element*/
      canvasBlob: null,
      /**Class which controls the timing ring during the recording*/
      progressRing: null,
      /**
       * Controls animation state on screen
       * @enum {"standby", "countdown", "recording","transition", "error"}
       */
      state: "standby",
      /**Countdown to recording*/
      counter: 3
    };
  },
  computed: {
    /**
     * @type String
     * Displays number of recordings taken in the session
     */
    recordingCountLabel() {
      let { recordingCount } = this.$store.state;
      if (recordingCount > 1) return `${recordingCount} Recordings`;
      else if (recordingCount === 1) return `${recordingCount} Recording`;
      else return "";
    },
    recorder() {
      return this.$store.state.recorder;
    }
  },
  methods: {
    /**Ensures recorder is initialized when component is mounted */
    async prepareAudio() {
      if (this.recorder) return;
      let success = await this.$store.dispatch("setUpRecorder");
      if (!success) this.state = "error";
    },
    /**Performs the recording sequence and then transitions to the Classify page*/
    async getAudioSample() {
      this.$emit("showMenu", false);
      await this.countDown();
      await this.record();
      this.goToClassify();
    },
    /**
     * Plays countdown animation
     * @returns promise
     */
    async countDown() {
      this.state = "countdown";
      let numbers = [3, 2, 1];
      for (let num of numbers) {
        this.counter = num;
        await delay(1000);
      }
    },
    /**
     * Presents the duration animation and records audio
     * @returns promise
     */
    async record() {
      this.state = "recording";
      let blobRadius =
        (Math.min(window.innerWidth, window.innerHeight) * 0.4) / 2;
      let ringRadius = blobRadius * 1.4;
      this.canvasBlob.dr = 0;
      this.canvasBlob.start();
      tween([0, blobRadius / 10], 500, val => (this.canvasBlob.dr = val));
      this.progressRing.opacity = 0;
      this.progressRing.show();
      tween([0, 1], 2432, val => {
        this.progressRing.progress = val;
        let opacity;
        if (val <= 0.25) opacity = 4 * val;
        else if (val > 0.9) opacity = (1 - val) * 10;
        this.progressRing.opacity = opacity;
      });
      await this.recorder.start();
      await delay(2432);
      let payload = await this.recorder.stop();
      this.$store.commit("updateRecording", payload.blob);
      this.progressRing.hide();
      await tween([blobRadius / 10, 0], 500, val => (this.canvasBlob.dr = val));
      await this.canvasBlob.stop();
    },
    /**Plays transition animation and then routes user to the Classify page*/
    async goToClassify() {
      this.state = "transition";
      await delay(1000);
      let script = this.script.toLowerCase().trim();
      this.$router.push({ name: "classify", params: { script } });
    },
    /**Resizes canvas elements when browser window dimensions change*/
    onResize() {
      let { canvas } = this.$refs;
      let blobRadius =
        (Math.min(window.innerWidth, window.innerHeight) * 0.4) / 2;
      let ringRadius = blobRadius * 1.4;
      this.canvasBlob.radius = blobRadius;
      this.progressRing.radius = ringRadius;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.getContext("2d").translate(canvas.width / 2, canvas.height / 2);
    },
    reloadPage() {
      location.reload();
    },
    /**Calculates starting sizes of the the nimbus animation and the progress ring.*/
    prepareCanvasElements() {
      let { canvas } = this.$refs;
      let blobRadius =
        (Math.min(window.innerWidth, window.innerHeight) * 0.4) / 2;
      let ringRadius = blobRadius * 1.4;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.canvasBlob = new CanvasBlob(canvas, blobRadius);
      this.progressRing = new ProgressRing(canvas, ringRadius);
    }
  },
  mounted() {
    this.$emit("showMenu", true);
    this.prepareCanvasElements();
    this.prepareAudio();
    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    //Clear event listeners to recover performance
    window.removeEventListener("resize", this.onResize);
  }
};
</script>

<style lang="scss">
.record-view {
  height: 100%;
  $circle-diameter: 40vmin;
  background: var(--accent);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .microphone-container {
    text-align: center;
    .mic {
      margin: 0 auto;
      color: white;
      font-size: 90px;
      margin-top: 30px;

      line {
        stroke: white;
      }
      &:active {
        background: transparent;
        opacity: 0.8;
      }
    }

    .recording-count {
      color: white;
    }
  }

  .countdown-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: $circle-diameter;
    height: $circle-diameter;
    border-radius: 50%;
    background: white;
    animation: scaleIn 0.5s ease-in forwards;

    @keyframes scaleIn {
      from {
        transform: scale(0.7);
      }
    }

    .countdown {
      font-size: 20vmin;
      color: var(--accent);
    }
  }

  .recording-prompt {
    animation: prompt 3s forwards;
    position: absolute;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 500px;
    text-align: center;
    font-size: 25px;
    color: white;

    @keyframes prompt {
      0%,
      100% {
        opacity: 0;
      }
      5%,
      95% {
        opacity: 1;
      }
    }
  }

  .transition {
    width: $circle-diameter;
    height: $circle-diameter;
    border-radius: 50%;
    background: white;
    animation: fillScreen 0.7s ease-in forwards;

    @keyframes fillScreen {
      30% {
        transform: scale(1.1);
      }
      45% {
        transform: scale(0.9);
      }
      50% {
        transform: scale(0.9);
      }
      100% {
        transform: scale(8);
      }
    }
  }

  .error-container {
    text-align: center;
    max-width: 500px;
    padding: 0 30px;

    h2 {
      font-size: 50px;
    }

    p {
      color: white;
      margin: 30px 0;
    }

    .reload {
      padding: 10px 15px;
      color: var(--accent);
      background: white;
    }
  }

  // Content Animations
  &-enter-active,
  &-leave-active {
    position: absolute;
    transition: all 0.5s;
  }
  &-enter {
    opacity: 0;
    z-index: 1;
  }

  &-leave-to {
    opacity: 0;
    z-index: 0;
  }
}
</style>
