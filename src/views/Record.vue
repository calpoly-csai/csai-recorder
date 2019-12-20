<template>
  <div class="page record-view" @touchmove.prevent>
    <canvas ref="canvas"></canvas>
    <div v-if="state === 'countdown'" class="countdown-container">
      <h2 class="countdown">{{counter}}</h2>
    </div>
    <div v-else-if="state === 'recording'" class="progress-container"></div>
    <div v-else-if="state === 'transition'" class="transition"></div>
    <div v-else-if="state === 'error'" class="error-container">
      <h2>🔇</h2>
      <p>Please provide mic access. If you didn't deny audio access, your browser might not support audio recording. Try reloading the page.</p>
      <button class="reload" @click="reloadPage">Reload</button>
    </div>
    <div v-else class="microphone-container">
      <ion-icon name="mic" class="mic" @click="getAudioSample"></ion-icon>
      <p class="recording-count">{{ recordingCountLabel }}</p>
    </div>
  </div>
</template>

<script>
import { CanvasBlob, ProgressRing } from "@/modules/canvas";
import { Recorder } from "@/modules/Recorder";
import { tween, delay, animateEl } from "@/modules/animation";
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
      if (!this.recorder.hasPermission) {
        let granted = await this.recorder.requestAccess();
        if (!granted) return (this.state = "error");
      }
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
    this.recorder.destroy();
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

  .mic {
    margin: 0 auto;
    color: white;
    font-size: 90px;
    &:active {
      background: transparent;
      opacity: 0.8;
    }
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
      font-size: 20vmin;
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
