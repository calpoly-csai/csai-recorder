import SimplexNoise from "simplex-noise";

export class CanvasBlob {
  constructor(canvas, radius) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.simplex = new SimplexNoise();
    this.speed = 9;

    this.animate = this.animate.bind(this);
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.animate();
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
    vertices.push(vertices[0]);
    return vertices;
  }

  drawBlob(vertices, color) {
    this.ctx.beginPath();
    this.ctx.moveTo(vertices[0][0], vertices[0][1]);

    for (let [x, y] of vertices) {
      this.ctx.lineTo(x, y);
    }
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  animate(t) {
    requestAnimationFrame(this.animate);
    let time = t * 0.0001 * this.speed;
    this.ctx.clearRect(
      -this.canvas.width / 2,
      -this.canvas.height / 2,
      this.canvas.width / 2,
      this.canvas.height / 2
    );
    let rad = 50;
    let dr = (rad * 1) / 3;
    let blob = this.generateBlob([0, 0], rad, dr, time);
    this.drawBlob(blob, "white");
  }
}

function polar(rad, angle, center = [0, 0]) {
  const y = rad * Math.sin(angle) + center[1];
  const x = rad * Math.cos(angle) + center[0];
  return [x, y];
}
