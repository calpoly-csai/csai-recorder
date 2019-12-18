<template>
  <div class="page record-view">
    <canvas ref="canvas"></canvas>
    <div v-if="state === 'countdown'" class="countdown-container" key="countdown">
      <h2 class="countdown">{{counter}}</h2>
    </div>
    <div v-else-if="state === 'recording'" class="progress-container"></div>
    <div v-else-if="state === 'transition'" class="transition"></div>
    <div v-else class="microphone-box" key="mic">
      <img @click="getAudioSample" class="mic" src="@/assets/microphone.svg" alt="Record" />
      <p class="recording-count">{{ recordingCountLabel }}</p>
    </div>
  </div>
</template>

<script>
import { CanvasBlob, ProgressRing } from "@/modules/canvas";
import { Recorder } from "@/modules/Recorder";
import { tween, delay } from "@/modules/animation";
export default {
  data() {
    return {
      recorder: new Recorder(),
      canvasBlob: null,
      progressRing: null,
      state: "standby",
      counter: 3
    };
  },
  computed: {
    recordingCountLabel() {
      let { recordingCount } = this.$store.state;
      if (recordingCount > 1) return `${recordingCount} Recordings`;
      else if (recordingCount === 1) return `${recordingCount} Recording`;
      else return "";
    }
  },
  methods: {
    async getAudioSample() {
      await this.countDown();
      await this.record();
      this.goToClassify();
    },
    async countDown() {
      this.state = "countdown";
      let numbers = [3, 2, 1];
      for (let num of numbers) {
        this.counter = num;
        await delay(1000);
      }
    },
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
      tween([0, 1], 3000, val => {
        this.progressRing.progress = val;
        let opacity = Math.min((0.5 - Math.abs(val - 0.5)) * 4, 1);
        this.progressRing.opacity = opacity;
      });
      this.recorder.start();
      await delay(3000);
      let blob = await this.recorder.stop();
      this.$store.commit("updateRecording", blob);
      this.progressRing.hide();
      await tween([blobRadius / 10, 0], 500, val => (this.canvasBlob.dr = val));

      await this.canvasBlob.stop();
    },
    async goToClassify() {
      this.state = "transition";
      await delay(1000);
      this.$router.push("classify");
    },
    onResize() {
      let blobRadius =
        (Math.min(window.innerWidth, window.innerHeight) * 0.4) / 2;
      let ringRadius = blobRadius * 1.4;
      this.canvasBlob.radius = blobRadius;
      this.progressRing.radius = ringRadius;
    }
  },
  mounted() {
    let { canvas } = this.$refs;
    let blobRadius =
      (Math.min(window.innerWidth, window.innerHeight) * 0.4) / 2;
    let ringRadius = blobRadius * 1.4;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.canvasBlob = new CanvasBlob(canvas, blobRadius);
    this.progressRing = new ProgressRing(canvas, ringRadius);
    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  }
};
</script>

<style lang="scss">
.record-view {
  $circle-diameter: min(40vh, 40vw);
  background: var(--accent);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  canvas {
    position: absolute;
    width: 100%;
    height: 100vh;
    pointer-events: none;
  }

  .mic {
    display: block;
    margin: 0 auto;
    cursor: pointer;
  }

  .recording-count {
    color: white;
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
      color: var(--accent);
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
