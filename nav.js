/* Shared nav + modal logic for 대치학사닷컴 */

(function () {
  // ----- Dropdown toggles (click to open, click outside to close)
  function initDropdowns() {
    const triggers = document.querySelectorAll('.nav-trigger');
    triggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const li = btn.closest('li');
        const wasOpen = li.classList.contains('open');
        // close siblings
        document.querySelectorAll('.nav-links li.open').forEach(o => o.classList.remove('open'));
        if (!wasOpen) li.classList.add('open');
      });
    });
    document.addEventListener('click', () => {
      document.querySelectorAll('.nav-links li.open').forEach(o => o.classList.remove('open'));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.nav-links li.open').forEach(o => o.classList.remove('open'));
        closeModal();
      }
    });
  }

  // ----- Hamburger toggle
  function initHamburger() {
    const hdr = document.getElementById('hdr');
    const tog = document.querySelector('.nav-toggle');
    if (!tog || !hdr) return;
    tog.addEventListener('click', (e) => {
      e.stopPropagation();
      hdr.classList.toggle('open');
    });
  }

  // ----- Membership / inquiry modal
  function openModal(title) {
    const m = document.getElementById('inquiry-modal');
    if (!m) return;
    const t = m.querySelector('[data-modal-title]');
    if (t && title) t.textContent = title;
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    const m = document.getElementById('inquiry-modal');
    if (!m) return;
    m.classList.remove('open');
    document.body.style.overflow = '';
  }
  window.openInquiryModal = openModal;
  window.closeInquiryModal = closeModal;

  function initModal() {
    const m = document.getElementById('inquiry-modal');
    if (!m) return;
    m.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);
    m.querySelector('.modal-close')?.addEventListener('click', closeModal);
    document.querySelectorAll('[data-open-inquiry]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal(el.dataset.openInquiry || el.textContent.trim());
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initDropdowns();
    initHamburger();
    initModal();
  });
})();
