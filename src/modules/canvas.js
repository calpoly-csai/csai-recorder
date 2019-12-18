import SimplexNoise from "simplex-noise";

export class CanvasLinks {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.links = [];
    this.isAnimating = false;
  }

  addLink() {
    let angle = Math.random() * 2 * Math.PI;
    const link = {
      movementAngle: angle,
      nodes: this.generateNodes()
    };
  }

  generateNodes() {}
}

export class ProgressRing {
  constructor(canvas, radius = 250) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.radius = radius;
    this.isAnimating;
    this.progress = 0;
    this.opacity = 1;
    this.animate = this.animate.bind(this);
  }

  show() {
    this.isAnimating = true;
    this.animate();
  }

  hide() {
    this.isAnimating = false;
  }
  animate() {
    if (this.isAnimating) requestAnimationFrame(this.animate);
    this.ctx.beginPath();
    this.ctx.lineCap = "round";
    let startAngle = (3 * Math.PI) / 2;
    this.ctx.arc(
      0,
      0,
      this.radius,
      startAngle,
      startAngle + 2 * Math.PI * this.progress + 0.1
    );
    this.ctx.strokeStyle = `rgba(255,255,255, ${this.opacity})`;
    this.ctx.lineWidth = 10;
    this.ctx.stroke();
  }
}

export class CanvasBlob {
  constructor(canvas, radius = 100) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.simplex = new SimplexNoise();
    this.speed = 7;
    this.isAnimating = false;
    this.radius = radius;
    this.dr = radius / 6;
    this.opacity = 1;
    this.animate = this.animate.bind(this);
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
  }

  start() {
    this.isAnimating = true;
    this.animate();
  }

  stop() {
    this.isAnimating = false;
    setTimeout(() => {
      this.ctx.clearRect(
        -this.canvas.width / 2,
        -this.canvas.height / 2,
        this.canvas.width,
        this.canvas.height
      );
    }, 100);
  }

  generateBlob([x, y], rad, dr, time) {
    const vertices = [];
    const pointsCount = 420;
    for (let i = 0; i <= pointsCount; i++) {
      let angle = (Math.PI * 2 * i) / pointsCount;
      let noise = this.simplex.noise3D(Math.cos(angle), Math.sin(angle), time);
      let vertex = polar(rad + dr * noise, angle, [x, y]);
      vertices.push(vertex);
    }
    return vertices;
  }

  drawBlob(vertices, color) {
    this.ctx.beginPath();
    this.ctx.moveTo(vertices[0][0], vertices[0][1]);

    for (let [x, y] of vertices) {
      this.ctx.lineTo(x, y);
    }
    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  animate(t) {
    if (this.isAnimating) requestAnimationFrame(this.animate);
    let time = t * 0.0001 * this.speed;
    this.ctx.clearRect(
      -this.canvas.width / 2,
      -this.canvas.height / 2,
      this.canvas.width,
      this.canvas.height
    );
    let blob = this.generateBlob([0, 0], this.radius, this.dr, time);
    this.drawBlob(blob, `rgba(255,255,255,${this.opacity})`);
  }
}

function polar(rad, angle, center = [0, 0]) {
  const y = rad * Math.sin(angle) + center[1];
  const x = rad * Math.cos(angle) + center[0];
  return [x, y];
}
