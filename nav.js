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
    initHaksaModal();
    initApplicationModal();
  });

  // ---------------------------------------------------------------
  // 학사 신청 폼 모달
  // ---------------------------------------------------------------
  function initApplicationModal() {
    // Inject markup
    let modal = document.getElementById('application-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'application-modal';
      modal.className = 'modal application-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-panel">
          <button class="modal-close" aria-label="닫기">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M6 18L18 6"/></svg>
          </button>
          <div class="app-header">
            <div class="eyebrow">학사 신청</div>
            <h2 data-app-title>학사 신청서</h2>
            <p>접수 후 1–2영업일 내에 담당자가 연락드립니다. <span style="color:#d04e4e;">*</span> 표시는 필수 항목입니다.</p>
          </div>
          <form class="app-form" id="application-form" novalidate>
            <div class="app-section">
              <div class="app-section-title">학생 정보</div>
              <div class="app-field">
                <label>이름 <span class="req">*</span></label>
                <input class="app-input" type="text" name="name" required />
              </div>
              <div class="app-row-2">
                <div class="app-field">
                  <label>학교 <span class="req">*</span></label>
                  <input class="app-input" type="text" name="school" required />
                </div>
                <div class="app-field">
                  <label>학년 <span class="req">*</span></label>
                  <select class="app-select" name="grade" required>
                    <option value="">선택</option>
                    <option>고1</option>
                    <option>고2</option>
                    <option>고3</option>
                    <option>N수</option>
                  </select>
                </div>
              </div>
              <div class="app-row-2">
                <div class="app-field">
                  <label>성별 <span class="req">*</span></label>
                  <select class="app-select" name="gender" required>
                    <option value="">선택</option>
                    <option>여자</option>
                    <option>남자</option>
                  </select>
                </div>
                <div class="app-field">
                  <label>시/도 <span class="req">*</span></label>
                  <input class="app-input" type="text" name="region" placeholder="예: 부산광역시" required />
                </div>
              </div>
            </div>

            <div class="app-section">
              <div class="app-section-title">연락처</div>
              <div class="app-field">
                <label>휴대폰번호 <span class="req">*</span></label>
                <input class="app-input" type="tel" name="phone" placeholder="010-0000-0000" required />
              </div>
              <div class="app-field">
                <label>이메일 <span class="req">*</span></label>
                <input class="app-input" type="email" name="email" placeholder="example@email.com" required />
              </div>
            </div>

            <div class="app-section">
              <div class="app-section-title">학습 정보</div>
              <div class="app-field">
                <label>국/영/수/탐/탐 최근 평가원·모의고사 등급 <span class="req">*</span></label>
                <p class="hint">예: 국 2 / 영 1 / 수 3 / 사1 2 / 사2 2 (가장 최근 응시 기준)</p>
                <textarea class="app-textarea" name="grades" required></textarea>
              </div>
              <div class="app-field">
                <label>대치동에 오는 목적 <span class="req">*</span></label>
                <p class="hint">정시 / 논술 / 면접 / 수시 / 현강 등 학습 계획을 자유롭게 적어주세요.</p>
                <textarea class="app-textarea" name="purpose" required></textarea>
              </div>
            </div>

            <div class="app-section">
              <div class="app-section-title">추가 요청 사항 (선택)</div>
              <div class="app-field">
                <label>희망 학사·기타 메모</label>
                <textarea class="app-textarea" name="memo" placeholder="예: 1인실 우선 / 식사 포함 / 대치역 도보 10분 이내 등"></textarea>
              </div>
            </div>
          </form>
          <div class="app-success">
            <div class="ico">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>
            </div>
            <h3>신청이 접수되었습니다</h3>
            <p>담당자가 1–2영업일 내로 연락드립니다.<br/>감사합니다.</p>
            <button type="button" class="btn btn-primary btn-sm" data-app-close>확인</button>
          </div>
          <div class="app-foot">
            <span class="note">접수 후 1–2영업일 내 연락드립니다</span>
            <button type="button" class="btn btn-ghost btn-sm" data-app-cancel>취소</button>
            <button type="submit" form="application-form" class="btn btn-primary btn-sm">제출하기</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const form = modal.querySelector('#application-form');
    const success = modal.querySelector('.app-success');
    const foot = modal.querySelector('.app-foot');
    const titleEl = modal.querySelector('[data-app-title]');

    function open(title) {
      // Reset state
      success.classList.remove('show');
      form.style.display = '';
      foot.style.display = '';
      if (title) titleEl.textContent = title;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      // Reset form for next open
      setTimeout(() => form.reset(), 300);
    }
    window.openApplicationModal = open;
    window.closeApplicationModal = close;

    modal.querySelector('.modal-backdrop').addEventListener('click', close);
    modal.querySelector('.modal-close').addEventListener('click', close);
    modal.querySelector('[data-app-cancel]').addEventListener('click', close);
    modal.querySelector('[data-app-close]').addEventListener('click', close);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw-pj6jg0RqDZd3YwnK_SOFiYRxFJM2vKjHDKaldZ06IP6nrf2Zmu68-JqQ4m5HPiZQkQ/exec';
      const data = Object.fromEntries(new FormData(form).entries());

      // 제출 버튼 비활성화 + 로딩 표시
      const submitBtn = document.querySelector('[form="application-form"]');
      const origLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '전송 중...'; }

      // CORS preflight 회피를 위해 text/plain 으로 전송 (Apps Script가 e.postData.contents 로 받음)
      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data),
      })
        .then(() => {
          form.style.display = 'none';
          foot.style.display = 'none';
          success.classList.add('show');
        })
        .catch(err => {
          console.error('신청서 전송 실패:', err);
          alert('전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        })
        .finally(() => {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = origLabel; }
        });
    });

    // Wire up triggers — event delegation으로 동적 카드도 커버
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open-application]');
      if (!trigger) return;
      e.preventDefault();
      e.stopPropagation();

      // 학사 모달이 열려 있으면 먼저 닫기 (모달 갈아타기)
      const haksaModal = document.getElementById('haksa-modal');
      if (haksaModal && haksaModal.classList.contains('open')) {
        haksaModal.classList.remove('open');
      }

      const t = trigger.dataset.openApplication || '학사 신청서';
      open(t);
    });
  }

  // ---------------------------------------------------------------
  // 학사 상세 모달 (이미지 갤러리 + 정보 + 상담 신청)
  // ---------------------------------------------------------------
  function initHaksaModal() {
    if (!document.querySelector('.grid')) return;

    // CSS 캐시 이슈 방어 — 모달 핵심 스타일을 JS로 직접 주입
    if (!document.getElementById('haksa-modal-styles')) {
      const css = document.createElement('style');
      css.id = 'haksa-modal-styles';
      css.textContent = `
        #haksa-modal .modal-panel {
          aspect-ratio: 4 / 5;
          height: min(88vh, 820px);
          width: auto;
          max-width: calc(100vw - 32px);
          padding: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        #haksa-modal .haksa-gallery {
          position: relative !important;
          flex: 1 1 auto;
          min-height: 0;
          background: #1a1a1a;
          overflow: hidden;
        }
        #haksa-modal .haksa-gallery .slide {
          position: absolute !important;
          inset: 0 !important;
          opacity: 0;
          transition: opacity 280ms ease;
          pointer-events: none;
        }
        #haksa-modal .haksa-gallery .slide.active {
          opacity: 1 !important;
          pointer-events: auto;
        }
        #haksa-modal .haksa-gallery img {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
          object-position: center;
          display: block;
        }
      `;
      document.head.appendChild(css);
    }

    // Inject modal markup once
    let modal = document.getElementById('haksa-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'haksa-modal';
      modal.className = 'modal haksa-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-panel">
          <button class="modal-close" aria-label="닫기">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M6 18L18 6"/></svg>
          </button>
          <div class="haksa-gallery" id="haksa-gallery"></div>
          <div class="haksa-info">
            <div class="haksa-info-tag" data-info="tag">여학사</div>
            <h3 data-info="name">학사 이름</h3>
            <div class="attrs" data-info="attrs"></div>
            <div class="meta" data-info="meta"></div>
          </div>
          <div class="haksa-foot">
            <div class="price-block">
              <span class="from">월 이용료</span>
              <span class="val" data-info="price">00<small>만원~</small></span>
            </div>
            <div class="actions">
              <a href="#" class="btn btn-primary btn-sm" data-haksa-cta data-open-application="학사 신청서">상담 신청</a>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const gallery = modal.querySelector('#haksa-gallery');
    const closeBtn = modal.querySelector('.modal-close');
    const backdrop = modal.querySelector('.modal-backdrop');

    let images = [];
    let idx = 0;

    function renderSlides() {
      gallery.innerHTML = '';
      if (!images.length) {
        gallery.innerHTML = `<div class="slide active"><div class="placeholder">이미지 준비중</div></div>`;
        return;
      }
      images.forEach((src, i) => {
        const slide = document.createElement('div');
        slide.className = 'slide' + (i === 0 ? ' active' : '');
        slide.innerHTML = `<img src="${src}" alt="학사 사진 ${i+1}" onerror="this.parentNode.innerHTML='<div class=&quot;placeholder&quot;>이미지를 불러올 수 없어요</div>'" />`;
        gallery.appendChild(slide);
      });
      if (images.length > 1) {
        gallery.insertAdjacentHTML('beforeend', `
          <button class="haksa-nav haksa-prev" aria-label="이전">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button class="haksa-nav haksa-next" aria-label="다음">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          <div class="haksa-counter"><span id="haksa-cur">1</span> / ${images.length}</div>
        `);
        gallery.querySelector('.haksa-prev').addEventListener('click', () => goTo(idx - 1));
        gallery.querySelector('.haksa-next').addEventListener('click', () => goTo(idx + 1));
      }
    }

    function goTo(n) {
      if (!images.length) return;
      idx = (n + images.length) % images.length;
      gallery.querySelectorAll('.slide').forEach((s, i) => s.classList.toggle('active', i === idx));
      const cur = gallery.querySelector('#haksa-cur');
      if (cur) cur.textContent = idx + 1;
    }

    function openHaksa(card) {
      // Gather images
      const raw = card.dataset.images || '';
      images = raw.split('|').map(s => s.trim()).filter(Boolean);
      if (!images.length) {
        const img = card.querySelector('.card-media img');
        if (img && img.src) images = [img.src];
      }
      idx = 0;
      renderSlides();

      // Populate info
      const tagEl = card.querySelector('.card-tag');
      const nameEl = card.querySelector('.card-name');
      const attrsEl = card.querySelector('.card-attrs');
      const metaEl = card.querySelector('.card-meta');
      const priceEl = card.querySelector('.price .val');

      modal.querySelector('[data-info="tag"]').textContent = tagEl ? tagEl.textContent.trim() : '';
      modal.querySelector('[data-info="name"]').textContent = nameEl ? nameEl.textContent.trim() : '';
      modal.querySelector('[data-info="attrs"]').innerHTML = attrsEl ? attrsEl.innerHTML : '';
      modal.querySelector('[data-info="meta"]').innerHTML = metaEl ? metaEl.innerHTML : '';
      modal.querySelector('[data-info="price"]').innerHTML = priceEl ? priceEl.innerHTML : '';

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeHaksa() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    // Event delegation — works for static AND dynamically rendered cards
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.grid .card');
      if (!card) return;
      if (e.target.closest('.btn')) return;       // 상담 신청 등 버튼 클릭은 무시
      if (e.target.closest('[data-open-application]')) return;
      openHaksa(card);
    });

    closeBtn.addEventListener('click', closeHaksa);
    backdrop.addEventListener('click', closeHaksa);

    // 모달 안의 "상담 신청" 누르면 학사 모달을 먼저 닫고 신청서 모달이 열림
    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-haksa-cta]')) {
        closeHaksa();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') closeHaksa();
      if (e.key === 'ArrowLeft') goTo(idx - 1);
      if (e.key === 'ArrowRight') goTo(idx + 1);
    });
  }
})();
