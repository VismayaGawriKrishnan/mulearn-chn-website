const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let w, h;
const particles = [];
const COUNT = Math.min(120, window.innerWidth / 8);

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.radius = Math.random() * 2 + 0.6;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 0.15 + 0.05;
    this.orbit = Math.random() * 60 + 20;
    this.centerX = this.x;
    this.centerY = this.y;
  }

  update() {
    this.angle += this.speed;
    this.x = this.centerX + Math.cos(this.angle) * this.orbit;
    this.y = this.centerY + Math.sin(this.angle) * this.orbit;

    // slow drift
    this.centerX += Math.sin(this.angle) * 0.05;
    this.centerY += Math.cos(this.angle) * 0.05;

    if (
      this.x < -100 || this.x > w + 100 ||
      this.y < -100 || this.y > h + 100
    ) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(124,77,255,0.45)";
    ctx.fill();
  }
}

for (let i = 0; i < COUNT; i++) {
  particles.push(new Particle());
}

function connect() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.strokeStyle = `rgba(124,77,255,${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, w, h);

  for (const p of particles) {
    p.update();
    p.draw();
  }

  connect();
  requestAnimationFrame(animate);
}

animate();
