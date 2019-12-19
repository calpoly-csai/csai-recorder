export class Recorder {
  constructor() {
    this.stream;
    this.mediaRecorder;
    this.streamData = [];
    this.hasPermission = false;

    this.onDataAvaliable = this.onDataAvaliable.bind(this);
  }

  async requestAccess() {
    //Get permissions
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      return false;
    }
    this.hasPermission = true;
    //Create MediaRecorder
    this.mediaRecorder = new MediaRecorder(this.stream);
    this.mediaRecorder.addEventListener("dataavaliable", this.onDataAvaliable);
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
        const blob = new Blob(this.streamData, { type: "audio/wav" });
        resolve(blob);
        this.streamData = [];
      });
    });

    this.mediaRecorder.stop();
    return await recording;
  }

  onDataAvaliable({ data }) {
    console.log("recieved data:", data);
    this.streamData.push(data);
  }

  destroy() {
    if (this.stream)
      this.mediaRecorder.removeEventListener(
        "dataavaliable",
        this.onDataAvaliable
      );
  }
}
