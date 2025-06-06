const touchArrow = document.getElementById('touchArrow');
const heart = document.getElementById('heart');
let currentBeatClass = '';

function calculateDistance(mouseX, mouseY, heartRect) {
  const heartCenterX = heartRect.left + heartRect.width / 2;
  const heartCenterY = heartRect.top + heartRect.height / 2;
  const dx = mouseX - heartCenterX;
  const dy = mouseY - heartCenterY;
  return Math.sqrt(dx * dx + dy * dy);
}

function updateHeartbeat(distance) {
  let newBeatClass = '';
  if (distance < 100) {
    newBeatClass = 'beating-very-fast';
  } else if (distance < 200) {
    newBeatClass = 'beating-fast';
  } else if (distance < 350) {
    newBeatClass = 'beating-medium';
  } else if (distance < 500) {
    newBeatClass = 'beating-slow';
  }

  if (newBeatClass !== currentBeatClass) {
    if (currentBeatClass) heart.classList.remove(currentBeatClass);
    if (newBeatClass) heart.classList.add(newBeatClass);
    currentBeatClass = newBeatClass;
  }
}

document.addEventListener('mousemove', (e) => {
  const heartRect = heart.getBoundingClientRect();
  const distance = calculateDistance(e.clientX, e.clientY, heartRect);
  updateHeartbeat(distance);
  updateApproachTextOpacity(distance); // EKLENDİ
});

document.addEventListener('mouseleave', () => {
  if (currentBeatClass) {
    heart.classList.remove(currentBeatClass);
    currentBeatClass = '';
  }
});

// Touch destekleri
document.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const heartRect = heart.getBoundingClientRect();
  const distance = calculateDistance(touch.clientX, touch.clientY, heartRect);
  updateHeartbeat(distance);
  updateApproachTextOpacity(distance); // EKLENDİ
}, { passive: false });

document.addEventListener('touchend', (e) => {
  e.preventDefault();
  if (currentBeatClass) {
    heart.classList.remove(currentBeatClass);
    currentBeatClass = '';
  }
}, { passive: false });

// Butona tıklanınca mesajı göster
document.getElementById('showMessageBtn').addEventListener('click', () => {
  const message = document.getElementById('heartMessage');
  message.style.display = 'block';

  const audio = document.getElementById('heartSong');
  audio.play();
});

// Mesafeye göre ışık/parlaklık ayarla
const maxGlow = 30;  // en yakında gölge boyutu
const minGlow = 5;   // en uzakta gölge boyutu
const maxDistance = 500; // etki mesafesi

// Mesafeyi oranla
let glowStrength = Math.max(0, 1 - distance / maxDistance);

// Glow değeri hesapla
let glow1 = minGlow + (maxGlow - minGlow) * glowStrength;
let glow2 = glow1 * 1.5;

heart.style.filter = `drop-shadow(0 0 ${glow1}px rgba(255, 0, 0, ${0.6 + 0.4 * glowStrength})) drop-shadow(0 0 ${glow2}px rgba(255, 0, 0, ${0.4 + 0.3 * glowStrength}))`;

const approachText = document.getElementById('approachText');

if (distance < 150) {
  approachText.style.opacity = '0';
} else {
  approachText.style.opacity = '1';
}

function updateApproachTextOpacity(distance) {
  const maxDistance = 400; // Bu mesafeden sonra tamamen görünür
  const minDistance = 80;  // Bu mesafede tamamen kaybolur
  const text = document.getElementById('approachText');

  if (distance <= minDistance) {
    text.style.opacity = 0;
  } else if (distance >= maxDistance) {
    text.style.opacity = 1;
  } else {
    const opacity = (distance - minDistance) / (maxDistance - minDistance);
    text.style.opacity = opacity;
  }
}

document.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const touch = e.touches[0];

  const heartRect = heart.getBoundingClientRect();
  const distance = calculateDistance(touch.clientX, touch.clientY, heartRect);
  updateHeartbeat(distance);
  updateApproachTextOpacity(distance);

  // Oku göster ve pozisyonla
  touchArrow.style.display = 'block';
  touchArrow.style.left = `${touch.clientX}px`;
  touchArrow.style.top = `${touch.clientY}px`;
}, { passive: false });

document.addEventListener('touchend', (e) => {
  e.preventDefault();
  if (currentBeatClass) {
    heart.classList.remove(currentBeatClass);
    currentBeatClass = '';
  }

  // Oku gizle
  touchArrow.style.display = 'none';
}, { passive: false });

// Mobil uyarı göster (ilk yüklemede)
function showTouchHint() {
  const hint = document.createElement('div');
  hint.textContent = 'Emojiyi hareket ettir';
  hint.style.position = 'absolute';
  hint.style.top = '60%';
  hint.style.left = '50%';
  hint.style.transform = 'translate(-50%, -50%)';
  hint.style.color = 'white';
  hint.style.fontSize = '18px';
  hint.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
  hint.style.padding = '10px 15px';
  hint.style.borderRadius = '10px';
  hint.style.zIndex = '20';
  hint.style.pointerEvents = 'none';
  hint.style.opacity = '0';
  hint.style.transition = 'opacity 0.5s ease';

  document.body.appendChild(hint);

  // Görünür yap
  setTimeout(() => {
    hint.style.opacity = '1';
  }, 100);

  // 5 saniye sonra kaybolur
  setTimeout(() => {
    hint.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(hint);
    }, 500); // animasyon sonrası DOM'dan kaldır
  }, 5000);
}

// Sadece mobil/touch destekli cihazlarda çalıştır
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  window.addEventListener('load', showTouchHint);
}

