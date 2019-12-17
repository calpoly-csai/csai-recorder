import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    /**Number of recordings taken in the current session */
    recordingCount: 0,
    /**Information of recent participants (cleared when app exits)*/
    participants: []
  },
  mutations: {
    addParticipant(state, participant) {
      state.participants.push(participant);
    }
  },
  actions: {
    async sendRecording() {
      await new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
      console.log("recording sent");
    }
  },
  modules: {}
});
