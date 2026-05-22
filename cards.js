/* =========================================================
   학사 카드 — Google Sheets 연동
   시트 URL: https://docs.google.com/spreadsheets/d/1acS_kAnJTNyB83nGDejd-1sLVHrbtAsiJ2mGLidVa6Y/

   페이지에서 사용:
     <script src="cards.js" data-gender="women"></script>   ← female.html
     <script src="cards.js" data-gender="men"></script>     ← male.html
   ========================================================= */
(function () {
  const SHEET_ID = '1acS_kAnJTNyB83nGDejd-1sLVHrbtAsiJ2mGLidVa6Y';
  const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

  // ---------- CSV 파서 (quoted fields, commas inside quotes 처리) ----------
  function parseCSV(text) {
    const rows = [];
    let row = [], cell = '', inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i], n = text[i+1];
      if (inQuotes) {
        if (c === '"' && n === '"') { cell += '"'; i++; }
        else if (c === '"') { inQuotes = false; }
        else cell += c;
      } else {
        if (c === '"') inQuotes = true;
        else if (c === ',') { row.push(cell); cell = ''; }
        else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
        else if (c === '\r') {/* skip */}
        else cell += c;
      }
    }
    if (cell.length || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }

  function csvToObjects(text) {
    const rows = parseCSV(text).filter(r => r.some(c => c && c.trim()));
    if (!rows.length) return [];
    const header = rows[0].map(h => h.trim());
    return rows.slice(1).map(r => {
      const o = {};
      header.forEach((h, i) => { o[h] = (r[i] || '').trim(); });
      return o;
    });
  }

  // ---------- 구글드라이브 링크 자동 변환 ----------
  // 지원 형식:
  //   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  //   https://drive.google.com/open?id=FILE_ID
  //   https://drive.google.com/uc?id=FILE_ID
  //   https://docs.google.com/uc?id=FILE_ID
  // → https://lh3.googleusercontent.com/d/FILE_ID=w1200  (CORS·핫링크 안정성 OK)
  function convertImageUrl(url) {
    if (!url) return '';
    const u = url.trim();
    // 이미 lh3.googleusercontent.com 이면 그대로
    if (/lh3\.googleusercontent\.com/.test(u)) return u;

    // /file/d/<ID>/ 패턴
    let m = u.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{20,})/);
    if (m) return `https://lh3.googleusercontent.com/d/${m[1]}=w1200`;

    // ?id=<ID> 패턴 (open?id= / uc?id= 모두 커버)
    m = u.match(/[?&]id=([a-zA-Z0-9_-]{20,})/);
    if (m) return `https://lh3.googleusercontent.com/d/${m[1]}=w1200`;

    return u;
  }

  // ---------- 헬퍼 ----------
  const isTrue = v => /^(true|1|y|yes|✓|o|on)$/i.test(String(v).trim());
  const esc = s => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  // location 텍스트로부터 필터 태그 추출
  function locationTags(text) {
    const t = String(text || '');
    const out = [];
    if (/대치/.test(t)) out.push('daechi');
    if (/한티/.test(t)) out.push('hanti');
    return out;
  }

  function roomTypeTag(s) {
    const t = String(s || '');
    if (/1\s*인/.test(t)) return '1';
    if (/2\s*인/.test(t)) return '2';
    return '';
  }

  function buildAttrs(row) {
    // 1인실만 표시 (다른 태그는 숨김)
    const attrs = [];
    if (row.room_type && /1\s*인/.test(row.room_type)) attrs.push('1인실');
    return attrs;
  }

  function buildTags(row) {
    const tags = [];
    const rt = roomTypeTag(row.room_type);
    if (rt) tags.push(rt);
    if (isTrue(row.meal)) tags.push('meal');
    if (isTrue(row.study_room)) tags.push('study');
    if (isTrue(row.short_term)) tags.push('short');
    tags.push(...locationTags(row.location));
    return tags.join(' ');
  }

  function buildImages(row) {
   return [row.image1, row.image2, row.image3, row.image4, row.image5,
        row.image6, row.image7, row.image8, row.image9, row.image10,
        row.image11, row.image12, row.image13, row.image14, row.image15,
        row.image16, row.image17, row.image18, row.image19, row.image20]

      .map(s => convertImageUrl((s || '').trim()))
      .filter(Boolean);
  }

  function cardHTML(row, genderLabel) {
    const images = buildImages(row);
    const attrs = buildAttrs(row);
    const tags = buildTags(row);
    const imagesAttr = images.length ? ` data-images="${esc(images.join('|'))}"` : '';
    const subtitle = row.subtitle || genderLabel;

    const mediaInner = images.length
      ? `<img src="${esc(images[0])}" alt="${esc(row.title)} 사진" onerror="this.parentNode.innerHTML='<div class=&quot;img-fallback&quot;>이미지 준비중</div>'" />`
      : `<div class="img-fallback" role="img" aria-label="${esc(row.title)} 사진 준비중">이미지 준비중</div>`;

    const rankBadge = row.rank ? `<span class="card-rank">추천 ${esc(row.rank)}위</span>` : '';

    return `
    <article class="card" data-tags="${esc(tags)}"${imagesAttr}>
      <div class="card-media">
        ${mediaInner}
        ${rankBadge}
      </div>
      <div class="card-body">
        <div class="card-tag">${esc(subtitle)}</div>
        <h3 class="card-name">${esc(row.title)}</h3>
        <div class="card-attrs">
          ${attrs.map(a => `<span>${esc(a)}</span>`).join('')}
        </div>
        <div class="card-meta">${esc(row.location || '')}${row.tag_text ? ` <span class="sep">·</span> ${esc(row.tag_text)}` : ''}</div>
      </div>
      <div class="card-foot">
        <div class="price">
          <span class="from">월 이용료</span>
          <span class="val">가격 문의</span>
        </div>
        <a href="#" class="btn btn-primary btn-sm" data-open-application="학사 신청서">상담 신청</a>
      </div>
    </article>`;
  }

  // ---------- 렌더 ----------
  async function render() {
    const grid = document.querySelector('.grid');
    if (!grid) return;

    const script = document.currentScript || [...document.scripts].find(s => /cards\.js/.test(s.src));
    const gender = (script && script.dataset.gender) || 'women';
    const genderLabel = gender === 'men' ? '남학사' : '여학사';

    // Loading state
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted);font-size:14px;">학사 정보를 불러오는 중...</div>`;

    let rows = [];
    try {
      const res = await fetch(CSV_URL, { redirect: 'follow' });
      if (!res.ok) throw new Error('네트워크 오류: ' + res.status);
      const text = await res.text();
      rows = csvToObjects(text);
    } catch (err) {
      console.error(err);
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted);font-size:14px;">학사 정보를 불러올 수 없습니다.<br/><span style="font-size:12px;color:var(--faint);">시트 권한을 "링크가 있는 모든 사용자 - 뷰어"로 설정해주세요.</span></div>`;
      return;
    }

    // 필터: visible TRUE + 해당 성별 컬럼 TRUE
    const filtered = rows.filter(r => {
      if (r.visible !== '' && r.visible !== undefined && !isTrue(r.visible)) return false;
      return isTrue(r[gender]);
    });

    // 정렬: rank 오름차순 (없으면 뒤)
    filtered.sort((a, b) => {
      const ra = parseFloat(a.rank), rb = parseFloat(b.rank);
      const aHas = !isNaN(ra), bHas = !isNaN(rb);
      if (aHas && bHas) return ra - rb;
      if (aHas) return -1;
      if (bHas) return 1;
      return 0;
    });

    // 카운트 업데이트
    const countH1 = document.querySelector('.intro-row h1 .count');
    if (countH1) countH1.textContent = filtered.length;
    const countFilter = document.querySelector('.filter-count strong');
    if (countFilter) countFilter.textContent = filtered.length;

    if (!filtered.length) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted);font-size:14px;">등록된 학사가 없습니다.</div>`;
      return;
    }

    grid.innerHTML = filtered.map(r => cardHTML(r, genderLabel)).join('');

    // 카드 렌더 후 필터 적용 (페이지의 applyFilter 호출)
    if (window.applyFilter) window.applyFilter();
  }

  document.addEventListener('DOMContentLoaded', render);
})();
