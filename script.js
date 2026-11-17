/* ==========================================================================
   KRINA & MAYUR WEDDING INVITATION — JAVASCRIPT
   Preloader, Intro Video Curtain, Audio Player, Countdown, RSVP & Petals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. PRELOADER LOGIC
  // ------------------------------------------------------------------------
  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloader-bar');
  const preloaderPercent = document.getElementById('preloader-percent');

  let loadProgress = 0;
  const loadInterval = setInterval(() => {
    loadProgress += Math.floor(Math.random() * 15) + 8;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(loadInterval);
      if (preloaderBar) preloaderBar.style.width = '100%';
      if (preloaderPercent) preloaderPercent.textContent = '100%';

      setTimeout(() => {
        if (preloader) preloader.classList.add('fade-out');
      }, 400);
    } else {
      if (preloaderBar) preloaderBar.style.width = `${loadProgress}%`;
      if (preloaderPercent) preloaderPercent.textContent = `${loadProgress}%`;
    }
  }, 120);

  // ------------------------------------------------------------------------
  // 2. INTRO VIDEO CURTAIN & AUDIO PLAYER
  // ------------------------------------------------------------------------
  const introCurtain = document.getElementById('intro-curtain');
  const introVideo = document.getElementById('intro-video');
  const openInviteBtn = document.getElementById('open-invitation-btn');
  const bgAudio = document.getElementById('bg-audio');
  const musicToggle = document.getElementById('music-toggle');
  const iconPlay = document.getElementById('music-icon-play');
  const iconMute = document.getElementById('music-icon-mute');

  let audioPlaying = false;
  let curtainClosed = true;

  // Set initial audio volume
  if (bgAudio) {
    bgAudio.volume = 0.45;
  }

  function startExperience() {
    if (!curtainClosed) return;

    // Start video playback
    if (introVideo) {
      introVideo.play().catch(err => console.log('Video autoplay error:', err));
    }

    // Start background music
    if (bgAudio) {
      bgAudio.play().then(() => {
        audioPlaying = true;
        updateAudioIcons();
      }).catch(err => console.log('Audio autoplay prevented:', err));
    }

    // When video is almost finished or ends, fade out curtain smoothly
    if (introVideo) {
      introVideo.addEventListener('timeupdate', () => {
        if (introVideo.duration && (introVideo.duration - introVideo.currentTime <= 0.6)) {
          dismissCurtain();
        }
      });
      introVideo.addEventListener('ended', dismissCurtain);
    }

    // Safety fallback: if video stalls or user taps again, open curtain after 6s
    setTimeout(dismissCurtain, 6500);
  }

  function dismissCurtain() {
    if (!curtainClosed) return;
    curtainClosed = false;
    if (introCurtain) {
      introCurtain.classList.add('curtain-opened');
      setTimeout(() => {
        introCurtain.style.display = 'none';
      }, 1700);
    }
  }

  if (openInviteBtn) {
    openInviteBtn.addEventListener('click', startExperience);
  }

  // ------------------------------------------------------------------------
  // 3. FLOATING MUSIC TOGGLE BUTTON
  // ------------------------------------------------------------------------
  function updateAudioIcons() {
    if (audioPlaying) {
      iconPlay.classList.remove('hidden');
      iconMute.classList.add('hidden');
    } else {
      iconPlay.classList.add('hidden');
      iconMute.classList.remove('hidden');
    }
  }

  if (musicToggle && bgAudio) {
    musicToggle.addEventListener('click', () => {
      if (audioPlaying) {
        bgAudio.pause();
        audioPlaying = false;
      } else {
        bgAudio.play().then(() => {
          audioPlaying = true;
        }).catch(err => console.log('Audio play error:', err));
      }
      updateAudioIcons();
    });
  }

  // ------------------------------------------------------------------------
  // 4. LIVE COUNTDOWN TIMER
  // Target: December 9, 2026, 14:30:00 IST
  // ------------------------------------------------------------------------
  const targetDate = new Date('2026-12-09T14:30:00+05:30').getTime();
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // ------------------------------------------------------------------------
  // 5. RSVP BY EVENTS (INTERACTIVE PRESETS & TOGGLES)
  // ------------------------------------------------------------------------
  const presetButtons = document.querySelectorAll('.btn-preset');
  const eventCards = document.querySelectorAll('.rsvp-toggle-card');

  const presetsMap = {
    all: ['mehendi', 'haldi', 'sangeet', 'wedding', 'afterparty'],
    day1: ['mehendi'],
    day2: ['haldi', 'sangeet'],
    wedding: ['wedding', 'afterparty'],
    decline: []
  };

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const preset = btn.dataset.preset;
      const activeEvents = presetsMap[preset] || [];

      eventCards.forEach(card => {
        const ev = card.dataset.event;
        if (activeEvents.includes(ev)) {
          card.classList.add('selected');
        } else {
          card.classList.remove('selected');
        }
      });
    });
  });

  eventCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      // Remove active from preset buttons when user manually customizes
      presetButtons.forEach(b => b.classList.remove('active'));
    });
  });

  // ------------------------------------------------------------------------
  // 6. RSVP FORM LOGIC
  // ------------------------------------------------------------------------
  const rsvpForm = document.getElementById('rsvp-form');
  const teamButtons = document.querySelectorAll('.btn-team');
  const selectedTeamInput = document.getElementById('selected-team');
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
  const guestCountGroup = document.getElementById('guest-count-group');
  const excitementGroup = document.getElementById('excitement-group');
  const stylingGroup = document.getElementById('styling-group');
  const rsvpSuccessCard = document.getElementById('rsvp-success-card');
  const btnUpdateRsvp = document.getElementById('btn-update-rsvp');

  // Team Selection
  teamButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      teamButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (selectedTeamInput) selectedTeamInput.value = btn.dataset.team;
    });
  });

  // Attendance Toggle (hide extra questions if declining)
  attendanceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const isAttending = e.target.value === 'yes';
      if (guestCountGroup) guestCountGroup.style.display = isAttending ? 'block' : 'none';
      if (excitementGroup) excitementGroup.style.display = isAttending ? 'block' : 'none';
      if (stylingGroup) stylingGroup.style.display = isAttending ? 'block' : 'none';
    });
  });

  // Form Submit Handler
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!selectedTeamInput.value) {
        alert("Please select either Krina's Side or Mayur's Side to celebrate with!");
        return;
      }

      const formData = new FormData(rsvpForm);
      const guestName = formData.get('name');
      const team = formData.get('team');
      const attendance = formData.get('attendance');
      const guestCount = attendance === 'yes' ? formData.get('guestCount') : '0';
      const message = formData.get('message');

      const excitements = [];
      document.querySelectorAll('input[name="excitement"]:checked').forEach(c => excitements.push(c.value));

      const stylings = [];
      document.querySelectorAll('input[name="styling"]:checked').forEach(c => stylings.push(c.value));

      const selectedEvents = [];
      document.querySelectorAll('.rsvp-toggle-card.selected').forEach(c => selectedEvents.push(c.dataset.event));

      const rsvpData = {
        name: guestName,
        team,
        attendance,
        guestCount,
        events: selectedEvents,
        excitements,
        stylings,
        message,
        timestamp: new Date().toISOString()
      };

      // Store locally in browser storage
      try {
        const stored = JSON.parse(localStorage.getItem('krina_mayur_rsvps') || '[]');
        stored.unshift(rsvpData);
        localStorage.setItem('krina_mayur_rsvps', JSON.stringify(stored));
      } catch (err) {
        console.error('LocalStorage error:', err);
      }

      // Show Success View
      rsvpForm.classList.add('hidden');
      if (rsvpSuccessCard) rsvpSuccessCard.classList.remove('hidden');
    });
  }

  // Update RSVP Button
  if (btnUpdateRsvp) {
    btnUpdateRsvp.addEventListener('click', () => {
      if (rsvpSuccessCard) rsvpSuccessCard.classList.add('hidden');
      if (rsvpForm) rsvpForm.classList.remove('hidden');
    });
  }

  // ------------------------------------------------------------------------
  // 7. FLOATING FALLING PETALS ANIMATION
  // ------------------------------------------------------------------------
  const petalsContainer = document.getElementById('petals-container');
  if (petalsContainer) {
    const totalPetals = 16;
    for (let i = 0; i < totalPetals; i++) {
      const petal = document.createElement('div');
      petal.classList.add('falling-petal');
      if (i % 2 === 0) petal.classList.add('marigold');

      const left = Math.random() * 95;
      const duration = Math.random() * 8 + 8; // 8-16s
      const delay = Math.random() * 12;
      const swayDuration = Math.random() * 2 + 3; // 3-5s
      const size = Math.random() * 8 + 14; // 14-22px

      petal.style.left = `${left}%`;
      petal.style.width = `${size}px`;
      petal.style.height = `${size * 1.25}px`;
      petal.style.animationDuration = `${duration}s, ${swayDuration}s`;
      petal.style.animationDelay = `${delay}s, ${delay * 0.5}s`;

      petalsContainer.appendChild(petal);
    }
  }

});
