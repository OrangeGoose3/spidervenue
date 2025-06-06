function checkTech() {
  const pass = document.getElementById('tech-pass').value;
  if (pass === 'skulladmin') {
    document.getElementById('tech-controls').style.display = 'block';
    document.getElementById('tech-login').style.display = 'none';
  } else {
    alert('Wrong password.');
  }
}

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function flashScreen() {
  document.body.style.backgroundColor = 'white';
  setTimeout(() => {
    document.body.style.backgroundColor = 'hsl(var(--led-hue), var(--led-saturation), var(--led-lightness))';
  }, 100);
}

// Converts hex color to HSL
function hexToHSL(hex) {
  let r = 0, g = 0, b = 0;
  if (hex.length == 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length == 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  r /= 255; g /= 255; b /= 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// Set CSS variables based on picked color
function setHueFromColor(hex) {
  const hsl = hexToHSL(hex);
  document.body.style.setProperty('--led-hue', hsl.h);
  document.body.style.setProperty('--led-saturation', hsl.s + '%');
  document.body.style.setProperty('--led-lightness', hsl.l + '%');
}