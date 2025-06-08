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
  hint.textContent = 'Kalbe yaklaşmak için ekrana dokunabilirsin';
  Object.assign(hint.style, {
    position: 'absolute',
    top: '62%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    zIndex: '20',
    opacity: '0',
    transition: 'opacity 0.5s ease',
    boxShadow: '0 0 10px rgba(255,255,255,0.2)',
    maxWidth: '90%',
    textAlign: 'center'
  });

  document.body.appendChild(hint);

  setTimeout(() => { hint.style.opacity = '1'; }, 100);
  setTimeout(() => {
    hint.style.opacity = '0';
    setTimeout(() => hint.remove(), 500);
  }, 3500);
}

if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  window.addEventListener('load', showTouchHint);
}
