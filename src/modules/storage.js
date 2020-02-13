//Source: https://www.raymondcamden.com/2019/10/16/using-indexeddb-with-vuejs

const DB_NAME = "recorderdb";
const DB_VERSION = 1;
let DB;

export default {
  async getDb() {
    return new Promise((resolve, reject) => {
      if (DB) {
        return resolve(DB);
      }
      console.log("Opening a new database:", DB);
      let request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = e => {
        console.log("Error opening db", e);
        reject("Error");
      };

      request.onsuccess = e => {
        DB = e.target.result;
        resolve(DB);
      };

      request.onupgradeneeded = e => {
        console.log("upgrading the database");
        let db = e.target.result;
        db.createObjectStore("recordings", {
          autoIncrement: true,
          keyPath: "id"
        });
      };
    });
  },
  async deleteRecording(recording) {
    let db = await this.getDb();

    return new Promise(resolve => {
      let trans = db.transaction(["recordings"], "readwrite");
      trans.oncomplete = () => {
        resolve();
      };

      let store = trans.objectStore("recordings");
      store.delete(recording.id);
    });
  },

  async getRecording() {
    let db = await this.getDb();

    return new Promise(resolve => {
      let recording = null;
      let trans = db.transaction(["recordings"], "readonly");
      trans.oncomplete = () => {
        resolve(recording);
      };

      let store = trans.objectStore("recordings");

      store.openCursor().onsuccess = e => {
        let cursor = e.target.result;
        if (cursor) {
          recording = cursor.value;
        }
      };
    });
  },

  async addRecording(recording) {
    let db = await this.getDb();

    return new Promise(resolve => {
      let trans = db.transaction(["recordings"], "readwrite");
      trans.oncomplete = () => {
        resolve();
      };

      let store = trans.objectStore("recordings");
      store.add(recording);
    });
  }
};
