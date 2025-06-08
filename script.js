const touchArrow = document.getElementById('touchArrow');
const heart = document.getElementById('heart');
const approachText = document.getElementById('approachText');
let currentBeatClass = '';

// Uzaklık hesapla
function calculateDistance(x, y, rect) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = x - centerX;
  const dy = y - centerY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Kalp atış hızını güncelle
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

// Yazı opaklığı güncelle
function updateApproachTextOpacity(distance) {
  const min = 80, max = 400;
  if (distance <= min) {
    approachText.style.opacity = 0;
  } else if (distance >= max) {
    approachText.style.opacity = 1;
  } else {
    approachText.style.opacity = (distance - min) / (max - min);
  }
}

// Kalp parlaması
function updateHeartGlow(distance) {
  const maxGlow = 30, minGlow = 5, maxDistance = 500;
  const glowStrength = Math.max(0, 1 - distance / maxDistance);
  const glow1 = minGlow + (maxGlow - minGlow) * glowStrength;
  const glow2 = glow1 * 1.5;
  heart.style.filter = `drop-shadow(0 0 ${glow1}px rgba(255,0,0,${0.6 + 0.4 * glowStrength})) drop-shadow(0 0 ${glow2}px rgba(255,0,0,${0.4 + 0.3 * glowStrength}))`;
}

// Fare ve dokunma hareketlerini işle
function handleInteraction(x, y) {
  const rect = heart.getBoundingClientRect();
  const distance = calculateDistance(x, y, rect);
  updateHeartbeat(distance);
  updateHeartGlow(distance);
  updateApproachTextOpacity(distance);
}

// Fare hareketi
document.addEventListener('mousemove', e => {
  handleInteraction(e.clientX, e.clientY);
});

document.addEventListener('mouseleave', () => {
  if (currentBeatClass) {
    heart.classList.remove(currentBeatClass);
    currentBeatClass = '';
  }
});

// Dokunmatik hareket
document.addEventListener('touchmove', e => {
  const touch = e.touches[0];
  handleInteraction(touch.clientX, touch.clientY);

  // Oku göster
  touchArrow.style.display = 'block';
  touchArrow.style.left = `${touch.clientX}px`;
  touchArrow.style.top = `${touch.clientY}px`;
}, { passive: true });

document.addEventListener('touchend', () => {
  if (currentBeatClass) {
    heart.classList.remove(currentBeatClass);
    currentBeatClass = '';
  }
  touchArrow.style.display = 'none';
}, { passive: true });

// Butonla mesaj göster ve ses çal
document.getElementById('showMessageBtn').addEventListener('click', () => {
  document.getElementById('heartMessage').style.display = 'block';
  document.getElementById('heartSong').play().catch(e => {
    console.log("Ses engellendi. Kullanıcı etkileşimi gerekli.");
  });
});

// Mobil uyarı göster
function showTouchHint() {
  const hint = document.createElement('div');
  hint.textContent = 'Ekrana dokun ve kalbe yaklaş';
  hint.style.position = 'absolute';
  hint.style.top = '60%';
  hint.style.left = '50%';
  hint.style.transform = 'translate(-50%, -50%)';
  hint.style.color = 'white';
  hint.style.backgroundColor = 'rgba(0,0,0,0.6)';
  hint.style.padding = '10px 15px';
  hint.style.borderRadius = '10px';
  hint.style.zIndex = '20';
  hint.style.opacity = '0';
  hint.style.transition = 'opacity 0.5s ease';
  document.body.appendChild(hint);

  setTimeout(() => { hint.style.opacity = '1'; }, 100);
  setTimeout(() => {
    hint.style.opacity = '0';
    setTimeout(() => hint.remove(), 500);
  }, 5000);
}

if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  window.addEventListener('load', showTouchHint);
}
