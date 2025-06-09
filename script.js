const heart = document.getElementById('heart');
const approachText = document.getElementById('approachText');
let currentBeatClass = '';

function calculateDistance(x, y, rect) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  return Math.hypot(x - centerX, y - centerY);
}

function updateHeartbeat(distance) {
  let newClass = '';
  if (distance < 100) newClass = 'beating-very-fast';
  else if (distance < 200) newClass = 'beating-fast';
  else if (distance < 350) newClass = 'beating-medium';
  else if (distance < 500) newClass = 'beating-slow';

  if (newClass !== currentBeatClass) {
    if (currentBeatClass) heart.classList.remove(currentBeatClass);
    if (newClass) heart.classList.add(newClass);
    currentBeatClass = newClass;
  }
}

function updateApproachTextOpacity(distance) {
  const opacity = Math.min(Math.max((distance - 80) / (400 - 80), 0), 1);
  approachText.style.opacity = opacity;
}

function updateHeartGlow(distance) {
  const glowStrength = Math.max(0, 1 - distance / 500);
  const glow1 = 5 + 25 * glowStrength;
  const glow2 = glow1 * 1.5;
  heart.style.filter = `drop-shadow(0 0 ${glow1}px rgba(255,0,0,${0.6 + 0.4 * glowStrength})) drop-shadow(0 0 ${glow2}px rgba(255,0,0,${0.4 + 0.3 * glowStrength}))`;
}

function handleInteraction(x, y) {
  const rect = heart.getBoundingClientRect();
  const distance = calculateDistance(x, y, rect);
  updateHeartbeat(distance);
  updateHeartGlow(distance);
  updateApproachTextOpacity(distance);
}

document.addEventListener('mousemove', e => handleInteraction(e.clientX, e.clientY));
document.addEventListener('mouseleave', () => {
  if (currentBeatClass) heart.classList.remove(currentBeatClass);
  currentBeatClass = '';
});

document.addEventListener('touchmove', e => {
  const touch = e.touches[0];
  handleInteraction(touch.clientX, touch.clientY);
}, { passive: true });

document.addEventListener('touchend', () => {
  if (currentBeatClass) heart.classList.remove(currentBeatClass);
  currentBeatClass = '';
}, { passive: true });

document.getElementById('showMessageBtn').addEventListener('click', () => {
  document.getElementById('heartMessage').style.display = 'block';
  document.getElementById('heartSong').play().catch(() => {});
});

function showTouchHint() {
  const hintContainer = document.getElementById('touchHintContainer');
  hintContainer.style.opacity = '1';
  setTimeout(() => {
    hintContainer.style.opacity = '0';
    setTimeout(() => hintContainer.remove(), 500);
  }, 3500);
}

if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  window.addEventListener('load', showTouchHint);
}
