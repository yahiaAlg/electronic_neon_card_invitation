document.addEventListener("DOMContentLoaded", () => {
  // Initialize particle system
  initParticles();

  // Animate grid lines
  animateGridLines();

  // Handle card flip
  const card = document.querySelector(".card");
  const cardFront = document.querySelector(".card-front");
  const cardBack = document.querySelector(".card-back");
  const flipBtn = document.getElementById("flip-btn");
  const flipBackBtn = document.getElementById("flip-back");

  // Make the entire card clickable
  cardFront.addEventListener("click", (e) => {
    // Don't flip if clicking on the form inputs or buttons
    if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;

    card.classList.add("flipped");
    setTimeout(() => {
      animateBackContent();
    }, 500);
  });
  // Still keep the button functionality
  flipBtn.addEventListener("click", () => {
    card.classList.add("flipped");
    setTimeout(() => {
      animateBackContent();
    }, 500);
  });

  flipBackBtn.addEventListener("click", () => {
    card.classList.remove("flipped");
  });

  // Allow clicking anywhere on the back to flip back
  cardBack.addEventListener("click", (e) => {
    // Don't flip if clicking on the form inputs or buttons
    if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;
    card.classList.remove("flipped");
  });

  // Handle RSVP form submission
  const rsvpForm = document.getElementById("rsvp-form");
  rsvpForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    // In a real application, you would send this data to a server
    console.log(`RSVP submitted: ${name}, ${email}`);

    // Visual feedback
    gsap.to(rsvpForm, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      onComplete: () => {
        rsvpForm.innerHTML = `
                    <h3 class="form-title neon-text">Thank You!</h3>
                    <p style="text-align: center; margin-top: 1rem;">
                        Your RSVP has been received. We'll be in touch with more details soon.
                    </p>
                `;
        gsap.to(rsvpForm, {
          opacity: 1,
          y: 0,
          duration: 0.5,
        });
      },
    });
  });

  // Initial animations
  animateCardFront();
});

// Initialize particle system
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas dimensions
  const resizeCanvas = () => {
    const cardFront = document.querySelector(".card-front");
    canvas.width = cardFront.offsetWidth;
    canvas.height = cardFront.offsetHeight;
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Particle system
  const particles = [];
  const particleCount = Math.min(Math.floor(canvas.width / 15), 60);

  // Particle colors
  const colors = [
    "#cc11f0", // neon-purple
    "#6300ff", // neon-violet
    "#ff008d", // neon-pink
    "#d14eea", // neon-magenta
    "#f96363", // neon-red
  ];

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.alpha = Math.random() * 0.5 + 0.2;
      this.glowSize = Math.random() * 15 + 5;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around screen
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = this.glowSize;
      ctx.shadowColor = this.color;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Connect particles with lines
  function connectParticles() {
    const maxDistance = 70;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = 1 - distance / maxDistance;
          ctx.strokeStyle = particles[i].color;
          ctx.globalAlpha = opacity * 0.2;
          ctx.lineWidth = 0.5;

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  function animate() {
    // Clear canvas with semi-transparent layer for trail effect
    ctx.fillStyle = "rgba(3, 2, 8, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    for (const particle of particles) {
      particle.update();
      particle.draw();
    }

    // Connect particles
    connectParticles();

    requestAnimationFrame(animate);
  }

  animate();
}

// Animate grid lines
function animateGridLines() {
  const horizontalLines = document.querySelectorAll(".grid-line.horizontal");
  const verticalLines = document.querySelectorAll(".grid-line.vertical");

  // Animate horizontal lines
  gsap.to(horizontalLines, {
    scaleX: 1,
    duration: 1.5,
    ease: "power2.inOut",
    stagger: 0.2,
  });

  // Animate vertical lines
  gsap.to(verticalLines, {
    scaleY: 1,
    duration: 1.5,
    ease: "power2.inOut",
    stagger: 0.2,
    delay: 0.5,
  });

  // Create pulse animation for grid lines
  gsap.to(".grid-line", {
    opacity: 0.3,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}

// Animate card front content
function animateCardFront() {
  const logo = document.querySelector(".logo");
  const cardContent = document.querySelector(".card-content");
  const cardChip = document.querySelector(".card-chip");
  const cardNumber = document.querySelector(".card-number");

  const tl = gsap.timeline();

  tl.from(logo, {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: "power2.out",
  })
    .from(
      cardContent.children,
      {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.4"
    )
    .from(
      [cardChip, cardNumber],
      {
        opacity: 0,
        y: 20,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.4"
    );
}

// Animate back content
// Animate back content
function animateBackContent() {
  const backContent = document.querySelector(".back-content");
  const securityCode = document.querySelector(".security-code");
  const cardFooter = document.querySelector(".card-footer");

  const tl = gsap.timeline();

  tl.from(backContent.children, {
    opacity: 0,
    y: 30,
    stagger: 0.15,
    duration: 0.6,
    ease: "power2.out",
  })
    .from(
      securityCode,
      {
        opacity: 0,
        x: 20,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.3"
    )
    .from(
      cardFooter,
      {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.3"
    );
}
