// TIMESTAMP
(function () {
  setInterval(function () {
    var now, timestamp;
    timestamp = new Date(1987, 5, 30); // Fixed timestamp
    now = new Date(); // Current time
    $("#time").text(((now - timestamp) / 1000).toFixed(0)); // Updates #time element
  }, 1000); // Runs every second
}).call(this);

// CANVAS ANIMATION
$(function () {
  var canvas = document.querySelector("canvas"),
    ctx = canvas.getContext("2d"),
    primaryColor = "#6a1b9a", // Purple for dots
    accentColor = "#26c6da"; // Teal for dots and lines

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = "block";

  ctx.lineWidth = 0.1;

  // Mouse position
  var mousePosition = {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };

  // Dots configuration
  var dots = {
    nb: 250, // Number of dots
    distance: 100, // Max distance between dots for a line
    d_radius: 100, // Mouse interaction radius
    array: [],
  };

  // Dot Constructor
  function Dot() {
    this.x = Math.random() * canvas.width; // Random X position
    this.y = Math.random() * canvas.height; // Random Y position
    this.vx = (-0.5 + Math.random()) * 0.2; // Slower horizontal velocity
    this.vy = (-0.5 + Math.random()) * 0.2; // Slower vertical velocity
    this.radius = Math.random() * 2 + 1; // Dot size between 1px and 3px

    // Randomly assign color (50% chance for primary or accent color)
    this.color = Math.random() > 0.5 ? primaryColor : accentColor;
  }

  // Dot Prototypes
  Dot.prototype = {
    // Create a dot
    create: function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color; // Dot color
      ctx.fill();
    },

    // Animate dots (move and bounce)
    animate: function () {
      dots.array.forEach((dot) => {
        if (dot.y < 0 || dot.y > canvas.height) dot.vy = -dot.vy;
        if (dot.x < 0 || dot.x > canvas.width) dot.vx = -dot.vx;

        dot.x += dot.vx; // Update X position
        dot.y += dot.vy; // Update Y position
      });
    },

    // Draw lines between nearby dots
    line: function () {
      for (let i = 0; i < dots.array.length; i++) {
        for (let j = i + 1; j < dots.array.length; j++) {
          let i_dot = dots.array[i];
          let j_dot = dots.array[j];

          // Check distance between dots
          if (
            Math.abs(i_dot.x - j_dot.x) < dots.distance &&
            Math.abs(i_dot.y - j_dot.y) < dots.distance
          ) {
            // Check mouse proximity
            if (
              Math.abs(i_dot.x - mousePosition.x) < dots.d_radius &&
              Math.abs(i_dot.y - mousePosition.y) < dots.d_radius
            ) {
              // Create a gradient line between the two dots
              let gradient = ctx.createLinearGradient(
                i_dot.x,
                i_dot.y,
                j_dot.x,
                j_dot.y
              );
              gradient.addColorStop(0, i_dot.color); // Start color is the first dot's color
              gradient.addColorStop(1, j_dot.color); // End color is the second dot's color

              ctx.beginPath();
              ctx.moveTo(i_dot.x, i_dot.y);
              ctx.lineTo(j_dot.x, j_dot.y);
              ctx.strokeStyle = gradient; // Use gradient for line
              ctx.stroke();
              ctx.closePath();
            }
          }
        }
      }
    },
  };

  // Initialize dots
  function initializeDots() {
    dots.array = [];
    for (let i = 0; i < dots.nb; i++) {
      dots.array.push(new Dot());
    }
  }

  // Draw and animate dots
  function animateDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.array.forEach((dot) => dot.create());
    dots.array[0]?.line();
    dots.array[0]?.animate();
  }

  // Mouse event listeners
  $("canvas").on("mousemove mouseleave", function (e) {
    if (e.type === "mousemove") {
      mousePosition.x = e.pageX;
      mousePosition.y = e.pageY;
    } else if (e.type === "mouseleave") {
      mousePosition.x = canvas.width / 2;
      mousePosition.y = canvas.height / 2;
    }
  });

  // Resize canvas and reinitialize dots
  $(window).on("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mousePosition.x = canvas.width / 2;
    mousePosition.y = canvas.height / 2;
    initializeDots();
  });

  // Start animation
  initializeDots();
  setInterval(animateDots, 1000 / 30); // 30 FPS
});
