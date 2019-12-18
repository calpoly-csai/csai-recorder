export class Recorder {
  constructor() {
    this.stream;
    this.mediaRecorder;
    this.streamData = [];

    this.onDataAvaliable = this.onDataAvaliable.bind(this);
  }

  async setup() {
    //Get permissions
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      throw Error("Permission Denied");
    }
    //Create MediaRecorder
    this.mediaRecorder = new MediaRecorder(this.stream);
    this.mediaRecorder.addEventListener("dataavaliable", this.onDataAvaliable);
  }

  async start() {
    if (!this.stream) await this.setup();
    this.mediaRecorder.start();
  }

  async stop() {
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
