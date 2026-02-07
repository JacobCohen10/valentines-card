/**
 * Valentine's Day Card - Interactive No Button (cursor avoidance)
 * The No button detects cursor proximity and jumps away in the opposite
 * direction, always staying within the viewport.
 */

(function () {
  const noBtn = document.getElementById('no-btn');
  const yesBtn = document.getElementById('yes-btn');
  const noBtnSpacer = document.getElementById('no-btn-spacer');
  const initialContent = document.getElementById('initial-content');
  const successContent = document.getElementById('success-content');
  const heartsBg = document.querySelector('.hearts-bg');

  // Cursor avoidance: when cursor enters this radius (px), button moves away
  const AVOID_RADIUS = 120;
  // How far the button jumps when avoiding (px)
  const JUMP_DISTANCE = 80;
  // Padding from viewport edges to keep button fully visible
  const VIEWPORT_PADDING = 16;

  /**
   * Position the No button to align with its spacer in the card.
   * Called on load and resize so the button starts in the right place.
   */
  function syncNoButtonPosition() {
    const spacerRect = noBtnSpacer.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    noBtn.style.left = spacerRect.left + (spacerRect.width - btnRect.width) / 2 + 'px';
    noBtn.style.top = spacerRect.top + 'px';
  }

  /**
   * Clamp a value between min and max
   */
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  /**
   * When cursor is near the No button, move it away from the cursor
   * while keeping it fully inside the viewport.
   */
  function handleMouseMove(e) {
    const cursorX = e.clientX;
    const cursorY = e.clientY;
    const rect = noBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(cursorX - centerX, cursorY - centerY);

    if (distance >= AVOID_RADIUS) return;

    // Unit vector away from cursor
    const dx = centerX - cursorX;
    const dy = centerY - cursorY;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;

    // Target center of button
    let newCenterX = centerX + ux * JUMP_DISTANCE;
    let newCenterY = centerY + uy * JUMP_DISTANCE;

    // Clamp to viewport (button fully visible)
    const halfW = rect.width / 2;
    const halfH = rect.height / 2;
    newCenterX = clamp(newCenterX, VIEWPORT_PADDING + halfW, window.innerWidth - VIEWPORT_PADDING - halfW);
    newCenterY = clamp(newCenterY, VIEWPORT_PADDING + halfH, window.innerHeight - VIEWPORT_PADDING - halfH);

    // Position using top-left (fixed elements use left/top)
    noBtn.style.left = newCenterX - halfW + 'px';
    noBtn.style.top = newCenterY - halfH + 'px';
  }

  document.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('resize', syncNoButtonPosition);

  // Set initial position once DOM is ready
  syncNoButtonPosition();

  /**
   * Show success content and celebration hearts.
   * Called by both Yes button and No button (when caught).
   */
  function showCelebration() {
    initialContent.classList.add('hidden');
    successContent.classList.remove('hidden');

    // Hide No button
    noBtn.style.display = 'none';

    // Dancing polar bears
    const bearsContainer = successContent.querySelector('.dancing-polar-bears');
    bearsContainer.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const bear = document.createElement('span');
      bear.className = 'dancing-bear';
      bear.textContent = '🐻‍❄️';
      bear.style.animationDelay = (i * 0.15) + 's';
      bear.style.left = (20 + i * 15) + '%';
      bearsContainer.appendChild(bear);
    }

    const heartsContainer = successContent.querySelector('.celebration-hearts');
    const heartChars = ['💕', '💖', '💗', '❤️'];

    for (let i = 0; i < 12; i++) {
      const heart = document.createElement('span');
      heart.textContent = heartChars[i % heartChars.length];
      const angle = (Math.random() - 0.5) * 360 * (Math.PI / 180);
      const dist = 80 + Math.random() * 80;
      heart.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
      heart.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
      heart.style.animationDelay = Math.random() * 0.3 + 's';
      heartsContainer.appendChild(heart);
    }

    setTimeout(() => {
      heartsContainer.innerHTML = '';
    }, 2000);

    // Heart fireworks on left and right sides
    createSideFireworks();
  }

  function createSideFireworks() {
    const container = document.createElement('div');
    container.className = 'heart-fireworks';
    document.body.appendChild(container);

    const heartChars = ['💕', '💖', '💗', '❤️', '💖'];
    const particleCount = 12;

    // Left side firework
    const leftBurst = document.createElement('div');
    leftBurst.className = 'firework-burst firework-left';
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.random() * 100 - 30) * (Math.PI / 180); // fan rightward
      const dist = 120 + Math.random() * 150;
      const heart = document.createElement('span');
      heart.className = 'firework-heart';
      heart.textContent = heartChars[i % heartChars.length];
      heart.style.setProperty('--fx', Math.cos(angle) * dist + 'px');
      heart.style.setProperty('--fy', Math.sin(angle) * dist + 'px');
      heart.style.animationDelay = (i * 0.04) + 's';
      leftBurst.appendChild(heart);
    }
    container.appendChild(leftBurst);

    // Right side firework
    const rightBurst = document.createElement('div');
    rightBurst.className = 'firework-burst firework-right';
    for (let i = 0; i < particleCount; i++) {
      const angle = (180 + (Math.random() * 100 - 30)) * (Math.PI / 180); // fan leftward
      const dist = 120 + Math.random() * 150;
      const heart = document.createElement('span');
      heart.className = 'firework-heart';
      heart.textContent = heartChars[i % heartChars.length];
      heart.style.setProperty('--fx', Math.cos(angle) * dist + 'px');
      heart.style.setProperty('--fy', Math.sin(angle) * dist + 'px');
      heart.style.animationDelay = (i * 0.04) + 's';
      rightBurst.appendChild(heart);
    }
    container.appendChild(rightBurst);

    setTimeout(() => container.remove(), 2500);
  }

  yesBtn.addEventListener('click', showCelebration);

  // Sassy messages when No is pressed (rotates through)
  const sassyMessages = [
    'Not a valid choice',
    'Nice try.',
    'Still not valid.',
    'The correct answer starts with Y…',
    'Try the other button.',
    'Nope! ❌',
    'Wrong button! 😅',
    'Not gonna work.',
    'So close... yet so far.',
  ];

  let noClickCount = 0;

  // No button stays "No" — if pressed, show sassy banner
  noBtn.addEventListener('click', () => {
    noClickCount++;
    let msg = document.getElementById('invalid-choice-msg');
    if (!msg) {
      msg = document.createElement('div');
      msg.id = 'invalid-choice-msg';
      msg.className = 'invalid-choice hidden';
      document.body.insertBefore(msg, document.body.firstChild);
    }
    msg.textContent = sassyMessages[(noClickCount - 1) % sassyMessages.length];
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 4500);
  });

  // Create background floating hearts
  const heartChars = ['💖', '💕', '❤️', '💗'];
  for (let i = 0; i < 9; i++) {
    const heart = document.createElement('span');
    heart.textContent = heartChars[i % heartChars.length];
    heart.style.left = (i * 10 + 5) + '%';
    heart.style.top = '100%';
    heartsBg.appendChild(heart);
  }
})();
