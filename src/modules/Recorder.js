export class Recorder {
  constructor() {
    this.stream;
    this.mediaRecorder;
    this.streamData = [];
    this.hasPermission = false;

    this.onDataAvaliable = this.onDataAvaliable.bind(this);
  }

  async requestAccess() {
    if (!this.isSupported()) return false;
    //Get permissions
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      return false;
    }
    this.hasPermission = true;
    //Create MediaRecorder
    this.mediaRecorder = new MediaRecorder(this.stream);
    this.mediaRecorder.ondataavailable = this.onDataAvaliable;
    return true;
  }

  async start() {
    if (!this.hasPermission) {
      let success = await this.requestAccess();
      if (!success) return;
    }
    this.mediaRecorder.start();
  }

  async stop() {
    if (!this.hasPermission) return;
    let recording = new Promise(resolve => {
      this.mediaRecorder.addEventListener("stop", () => {
        const blob = new Blob(this.streamData, {
          type: "audio/wav; codecs=0"
        });
        resolve(blob);
        this.streamData = [];
      });
    });

    this.mediaRecorder.stop();
    return await recording;
  }

  onDataAvaliable({ data }) {
    this.streamData.push(data);
  }

  destroy() {
    this.mediaRecorder.ondataavailable = null;
  }
  isSupported() {
    return navigator.mediaDevices.getUserMedia && window.MediaRecorder;
  }
}
