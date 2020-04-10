<template>
  <div class="help page">
    <div class="content">
      <h1 class="title">Tutorial</h1>
        <div class="youtube-media">
          <youtube
            :video-id="videoId"
            :player-width="mediaWidth"
            :player-height="mediaHeight"
            host="https://www.youtube-nocookie.com">
          </youtube>
        </div>
        <div class="description">
          <p>Thanks for taking interest in helping NIMBUS learn.</p>
          <p>{{ recorderDescriptionText }}</p>
          <p>{{ phraseDescriptionText }}</p>
          <p>Thanks for contributing to the CSAI NIMBUS project!</p>
        </div>
    </div>
  </div>
</template>

<script>
import { getIdFromURL } from "vue-youtube-embed";
export default {
  data() {
    return {
      videoId: getIdFromURL("https://youtu.be/3lczVrzJcEg"),
      viewportWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      viewportHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 65,
      recorderDescriptionText: "On the Recorder page, you help NIMBUS learn to recognize its spoken name. Simply press the microphone icon and follow the verbal prompt. Next, type in your information to help Nimbus distinguish different audio contexts. Then you may either press 'Done' or 'Record Again', which will temporarily keep your information for the next recording. Try clicking the refresh icon above the mic to teach NIMBUS words that sound similar to its name!",
      phraseDescriptionText: "On the Phrases page, you help NIMBUS learn to interpret written text. Enter a question/answer pair and click 'Tokenize'. Then combine any related adjacent words into tokens and label them with the categories provided. (Or create your own!)"
    }
  },
  computed: {
    mediaWidth() {
      return this.viewportWidth > 690 ? 690 : this.viewportWidth;
    },
    mediaHeight() {
      return this.viewportHeight > 388.125 ? 388.125 : this.viewportHeight;
    }
  }
};
</script>

<style lang="scss">
.help {
  .content {
    .title {
      margin: 20px 0;
    }
    .youtube-media {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    .description {
      margin-top: 15px;
      margin-bottom: 100px;
      p {
        padding-bottom: 10px;
      }
    }
  }
}
</style>
