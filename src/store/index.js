import Vue from "vue";
import Vuex from "vuex";

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
    /**
     * Takes all cached samples in local IndexDB storage and uploads them to the CSAI server
     */
    uploadCachedSamples() {}
  }
});
