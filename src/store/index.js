import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    /**Blob of recording */
    recording: null,
    /**Number of recordings taken in the current session */
    recordingCount: 0,
    /**Information of recent participants (cleared when app exits)*/
    participants: [],
    /**Data to autofill the Classify page */
    autofillData: null,
    /**System based notifications to the user*/
    infoBar: {
      text: "Hi there",
      isShown: false
    }
  },
  mutations: {
    updateParticipant(state, data) {
      let match = ({ firstName, lastName }) =>
        firstName === data.firstName && lastName === data.lastName;
      let index = state.participants.findIndex(match);
      if (index === -1) state.participants.unshift(data);
      else state.participants[index] = data;
    },
    eraseRecording(state) {
      state.recordingURL = null;
    },
    updateRecording(state, blob) {
      state.recording = blob;
    },
    updateAutofillData(state, data) {
      state.autofillData = data;
    },
    updateInfoBar(state, { text, isShown }) {
      if (text) state.infoBar.text = text;
      if (isShown !== undefined) state.infoBar.isShown = isShown;
    }
  },
  actions: {
    /** Takes all cached samples in local IndexDB storage and uploads them to the CSAI server*/
    cacheData() {
      //TODO: Use index db to cache data
      console.log("Since you aren't online, I'll cache the data");
    },
    /**
     * Uploads Wake Word audio data to the CSAI server
     * @param {FormData} payload The audio sample bundled with its metadata
     */
    uploadAudioSample(_, payload) {
      let config = {
        headers: { "content-type": "multipart/form-data" }
      };
      axios
        .post("/new_data/ww_temp_storage", payload, config)
        .catch(err => console.error(err));
      console.log("Posted sample to the CSAI Database!");
    }
  }
});
