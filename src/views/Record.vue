<template>
  <div class="page record-view">
    <div class="centered">
      <img @click="record" src="@/assets/microphone.svg" alt="Record" />
    </div>
    <p class="recording-count">{{ recordingLabel }}</p>
  </div>
</template>

<script>
import { CanvasBlob } from "@/modules/CanvasBlob";
import { Recorder } from "@/modules/Recorder";
export default {
  data() {
    return {
      recorder: new Recorder(),
      canvasBlob: null
    };
  },
  computed: {
    recordingLabel() {
      let { recordingCount } = this.$store.state;
      if (recordingCount > 1) return `${recordingCount} Recordings`;
      else if (recordingCount === 1) `${recordingCount} Recording`;
      else return "";
    }
  },
  methods: {
    record() {
      console.log("record");
    }
  },
  mounted() {
    this.canvasBlob = new CanvasBlob(this.$refs.blob);
  }
};
</script>

<style lang="scss">
.record-view {
  background: var(--accent);

  .centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  img {
    margin: 0 auto;
    cursor: pointer;
  }

  .recording-count {
    font-size: 20px;
    color: white;
    text-align: center;
  }
}
</style>
