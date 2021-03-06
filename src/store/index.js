import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import Recorder from "recorder-js";
import storage from "@/modules/storage";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    /**Blob of recording */
    recording: null,
    /**Recorder-js class for recording audio data */
    recorder: null,
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
    /** Takes all cached samples in local IndexedDB storage and uploads them to the CSAI server*/
    cacheRecording(_, recording) {
      //TODO: Use index db to cache data

      let cacheData = Object.fromEntries(Array.from(recording));
      storage.addRecording(cacheData);
    },
    /**Sends all cached data to the server and erases it in local storage */
    async uploadCache({ dispatch }) {
      let recording = await storage.getRecording();
      while (recording) {
        let fd = new FormData();
        for (let key in recording) {
          fd.append(key, recording[key]);
        }
        await dispatch("uploadAudioSample", fd);
        console.log(fd);
        await storage.deleteRecording(recording);
        recording = await storage.getRecording();
      }
    },
    /**
     * Uploads Wake Word audio data to the CSAI server
     * @param {FormData} payload The audio sample bundled with its metadata
     */
    async uploadAudioSample(_, payload) {
      let config = {
        headers: { "content-type": "multipart/form-data" }
      };
      try {
        await axios.post("/new_data/wakeword", payload, config);
      } catch (err) {
        console.log(err);
        return;
      }
      console.log("Posted sample to the CSAI Database!");
    },
    async setUpRecorder({ state }) {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });
      } catch (err) {
        console.log(err);
        return false;
      }
      const isFirefox =
        navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      let options = {};
      if (!isFirefox) options.sampleRate = 16000;
      let context = new (window.AudioContext || window.webkitAudioContext)(
        options
      );
      state.recorder = new Recorder(context);
      state.recorder.init(stream);
      return true;
    }
  }
});
