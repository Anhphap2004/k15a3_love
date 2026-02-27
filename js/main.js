/* ============================================
   K15A3 — MAIN JAVASCRIPT (Shared)
   ============================================ */

// ---- Navbar ----
function toggleNav() {
  document.querySelector('.nav-menu').classList.toggle('open');
}

// Close mobile menu on link click
document.addEventListener('click', (e) => {
  const menu = document.querySelector('.nav-menu');
  const toggle = document.querySelector('.nav-toggle');
  if (menu && !menu.contains(e.target) && !toggle?.contains(e.target)) {
    menu.classList.remove('open');
  }
});

// Toggle dropdown on mobile
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-dropdown > a').forEach(a => {
    a.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        a.closest('.nav-dropdown').classList.toggle('open-sub');
      }
    });
  });

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mark active nav link
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Init fade-in observer
  initFadeObserver();
});

// ---- Fade-in observer ----
function initFadeObserver() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => io.observe(el));
}

// ---- Photo Gallery Builder ----
function buildPhotoGrid(containerId, photos, gridPhotos) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  const data = gridPhotos || photos;
  data.forEach((photo, i) => {
    const card = document.createElement('div');
    card.className = 'photo-card fade-in';
    card.innerHTML = `
      <img src="${photo.src}" alt="${photo.cap}" loading="lazy"
           onerror="this.parentElement.style.display='none'">
      <div class="overlay"><span>${photo.cap}</span></div>
    `;
    card.addEventListener('click', () => openLightbox(data, i));
    grid.appendChild(card);
  });
  // Re-observe new fade-in elements
  setTimeout(initFadeObserver, 100);
}

// ---- Video Grid Builder ----
function buildVideoGrid(containerId, videos) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  videos.forEach((v, i) => {
    const card = document.createElement('div');
    card.className = 'video-card fade-in';
    card.innerHTML = `
      <video src="${v.src}" controls preload="metadata"
             onerror="this.parentElement.style.display='none'"></video>
      <div class="video-label">🎬 ${v.cap}</div>
    `;
    grid.appendChild(card);
  });
  setTimeout(initFadeObserver, 100);
}

// ---- Lightbox ----
let _lbPhotos = [];
let _lbIdx = 0;

function openLightbox(photos, idx) {
  _lbPhotos = photos;
  _lbIdx = idx;
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.add('open');
  updateLightbox();
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxNext() {
  _lbIdx = (_lbIdx + 1) % _lbPhotos.length;
  updateLightbox();
}

function lightboxPrev() {
  _lbIdx = (_lbIdx - 1 + _lbPhotos.length) % _lbPhotos.length;
  updateLightbox();
}

function updateLightbox() {
  const photo = _lbPhotos[_lbIdx];
  if (!photo) return;
  const img = document.getElementById('lb-img');
  const cap = document.getElementById('lb-cap');
  const counter = document.getElementById('lb-counter');
  if (img) { img.src = photo.src; img.alt = photo.cap; }
  if (cap) cap.textContent = photo.cap;
  if (counter) counter.textContent = `${_lbIdx + 1} / ${_lbPhotos.length}`;
}

document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (lb?.classList.contains('open')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lightboxNext();
    if (e.key === 'ArrowLeft') lightboxPrev();
  }
});

// ---- Animated Counter ----
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 30);
  });
}

function animateValue(el, target, isCurrency) {
  if (!el) return;
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 50));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = isCurrency ? current.toLocaleString('vi-VN') + 'đ' : current;
    if (current >= target) clearInterval(timer);
  }, 25);
}

// ---- Hero Orbit (floating photos) ----
function initHeroOrbit() {
  const wrap = document.getElementById('heroOrbit');
  if (!wrap || typeof HERO_PHOTOS === 'undefined') return;
  const positions = [
    { top: '10%',  left: '3%',  w: 80, h: 60 },
    { top: '15%', right: '4%', w: 90, h: 65 },
    { top: '55%', left: '2%',  w: 75, h: 55 },
    { top: '60%', right: '3%', w: 85, h: 60 },
    { top: '30%', left: '8%',  w: 70, h: 50 },
    { top: '35%', right: '8%', w: 75, h: 55 },
    { top: '80%', left: '6%',  w: 65, h: 50 },
    { top: '78%', right: '6%', w: 70, h: 52 },
  ];
  HERO_PHOTOS.slice(0, 8).forEach((src, i) => {
    const pos = positions[i];
    const div = document.createElement('div');
    div.className = 'orbit-img';
    div.style.cssText = `
      width:${pos.w}px;height:${pos.h}px;
      top:${pos.top};${pos.left ? 'left:'+pos.left : 'right:'+pos.right};
      animation-duration:${6 + Math.random()*6}s;
      animation-delay:${Math.random()*3}s;
    `;
    const img = document.createElement('img');
    img.src = src; img.alt = 'K15A3'; img.loading = 'lazy';
    img.onload = () => div.classList.add('loaded');
    img.onerror = () => div.style.display = 'none';
    div.appendChild(img);
    wrap.appendChild(div);
  });
}

// ---- Donation Page ----
const DONATION_GENDER_OVERRIDE = {
  'Anhh Phapp': 'male',
  'Phạm Thị Chuyên': 'female',
};

function initDonation() {
  const container = document.querySelector('.container');
  if (!container) return;

  const donors = buildDonationDataset();

  // Tính toán số liệu tổng quát
  const totalAmount = donors.reduce((s, d) => s + (d.amount || 0), 0);
  const donorCount = donors.filter(d => (d.amount || 0) > 0).length;
  const femaleTotal = donors
    .filter((d) => d.gender === 'female')
    .reduce((s, d) => s + (d.amount || 0), 0);
  const maleTotal = donors
    .filter((d) => d.gender === 'male')
    .reduce((s, d) => s + (d.amount || 0), 0);
  const avgDonation = donorCount ? Math.round(totalAmount / donorCount) : 0;

  setText('grand-total', formatCurrency(totalAmount));
  setText('donor-count', donorCount);
  setText('female-total', formatCurrency(femaleTotal));
  setText('male-total', formatCurrency(maleTotal));
  setText('avg-donation', formatCurrency(avgDonation));

  const target = 15000000;
  const pct = target ? Math.min(100, Math.round((totalAmount / target) * 100)) : 0;
  const pctLabel = document.querySelector('.progress-pct');
  if (pctLabel) pctLabel.textContent = `${pct}%`;
  const fill = document.querySelector('.progress-bar-fill');
  if (fill) fill.style.width = `${pct}%`;

  // Render danh sách theo giới tính
  renderDonationList('female', donors);
  renderDonationList('male', donors);

  // Cập nhật số lượng đầu cột
  const femaleCountEl = document.querySelector('.col-header.female .col-count');
  if (femaleCountEl) femaleCountEl.textContent = donors.filter(d => d.gender === 'female').length;
  const maleCountEl = document.querySelector('.col-header.male .col-count');
  if (maleCountEl) maleCountEl.textContent = donors.filter(d => d.gender === 'male').length;

  // Thêm grid ảnh biên lai bên dưới
  let billGrid = document.getElementById('donation-bills-grid');
  if (!billGrid) {
    const header = document.createElement('div');
    header.className = 'section-header fade-in';
    header.innerHTML = '<span class="section-label">Biên lai</span><h2 class="section-title">Ảnh Biên Lai Quyên Góp</h2>';
    container.appendChild(header);
    billGrid = document.createElement('div');
    billGrid.className = 'photo-grid';
    billGrid.id = 'donation-bills-grid';
    container.appendChild(billGrid);
  }
  if (typeof DONATION_PHOTOS !== 'undefined') {
    buildPhotoGrid('donation-bills-grid', DONATION_PHOTOS);
  }
}

function renderDonationList(gender, donors) {
  const wrap = document.getElementById(`don-list-${gender}`);
  if (!wrap) return;
  // Sort by amount descending (donors who gave more appear first)
  const list = donors
    .filter((d) => d.gender === gender)
    .sort((a, b) => (b.amount || 0) - (a.amount || 0));

  wrap.innerHTML = list
    .map((d, i) => {
      const amt = d.amount || 0;
      const rankIcon = amt > 0 && i === 0 ? '👑' : amt > 0 && i === 1 ? '🥈' : amt > 0 && i === 2 ? '🥉' : (i + 1);
      const rankClass = amt > 0 && i === 0 ? 'rank-1' : amt > 0 && i === 1 ? 'rank-2' : amt > 0 && i === 2 ? 'rank-3' : 'rank-n';
      const amtClass = amt > 0 ? 'amount-text' : 'amount-text zero-val';
      return `
      <div class="member-item">
        <div class="member-rank ${rankClass}">${rankIcon}</div>
        <span class="member-name-don">${d.name}</span>
        <span class="${amtClass}">${amt > 0 ? formatCurrency(amt) : '0đ'}</span>
      </div>`;
    })
    .join('') || '<div class="empty">Chưa có dữ liệu</div>';

  const footer = document.getElementById(`col-footer-${gender}`);
  if (footer) {
    const total = list.reduce((s, d) => s + (d.amount || 0), 0);
    footer.innerHTML = `
      <div class="col-footer-inner">
        <span class="col-footer-label">Tổng cộng</span>
        <span class="col-footer-amount">${formatCurrency(total)}</span>
      </div>`;
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function formatCurrency(num) {
  return (num || 0).toLocaleString('vi-VN') + 'đ';
}

function buildDonationDataset() {
  // Ưu tiên dataset đầy đủ nếu có
  if (typeof DONATION_MEMBERS !== 'undefined') {
    const all = [];
    ['female', 'male'].forEach((g) => {
      (DONATION_MEMBERS[g] || []).forEach((m) => {
        const name = m.name || 'Ẩn danh';
        const amount = typeof m.amount === 'number' ? m.amount : (typeof m.donation === 'number' ? m.donation : 0);
        const gender = g;
        const bill = typeof DONATION_BILL_MAP !== 'undefined' ? DONATION_BILL_MAP[name] : null;
        const photo = MEMBER_PHOTO_MAP?.[name]
          ? 'images/member/' + MEMBER_PHOTO_MAP[name]
          : (gender === 'female' ? 'images/member/member_placeholder.png' : 'images/member/member_placeholder.png');
        const img = bill || photo;
        all.push({ name, gender, amount, bill, photo, img });
      });
    });
    return all;
  }

  // Fallback: lấy từ DONATION_PHOTOS nếu không có dataset mới
  if (typeof DONATION_PHOTOS !== 'undefined') {
    return (DONATION_PHOTOS || []).map((d) => {
      const name = d.cap || 'Ẩn danh';
      const gender = DONATION_GENDER_OVERRIDE[name] || inferGenderFromName(name);
      const photo = MEMBER_PHOTO_MAP?.[name]
        ? 'images/member/' + MEMBER_PHOTO_MAP[name]
        : (gender === 'female' ? 'images/member/member_placeholder.png' : 'images/member/member_placeholder.png');
      const img = d.src || photo;
      return {
        ...d,
        name,
        gender,
        img,
        amount: typeof d.amount === 'number' && !Number.isNaN(d.amount) ? d.amount : null,
      };
    });
  }

  return [];
}

function inferGenderFromName(name) {
  const n = name.toLowerCase();
  if (
    name.includes(' Pháp ') ||
    n.includes('đức') || n.endsWith(' huy') || n.includes('thành') ||
    n.includes('mạnh') || n.includes('khoa') || n.includes('quân') ||
    n.includes('kiểm') || n.includes('nghĩa') || n.includes(' đô') ||
    n.includes('lực') || n.includes('nhất') || n.includes('quyết anh')
  ) {
    return 'male';
  }
  return 'female';
}

// ---- Members Page ----
const MEMBERS_GENDER_OVERRIDE = {
  'Phạm Thị Chuyên': 'female',
  'Anhh Phapp': 'male',
  'Nguyễn Văn Kiểm': 'male',
  'Lê Trọng Nghĩa': 'male',
  'Đặng Việt Đức': 'male',
  'Nguyễn Trung Đô': 'male',
  'Lê Quang Huy': 'male',
  'Trần Văn Lực': 'male',
  'Nguyễn Đình Thành': 'male',
  'Nguyễn Công Nhất': 'male',
  'Nguyễn Đình Mạnh': 'male',
  'Đặng Văn Khoa': 'male',
  'Phan Quyết Anh': 'male',
  'Nguyễn Minh Quân': 'male',
};

let currentGenderFilter = 'all';

function initMembers() {
  renderMembers('all', '');
}

function renderMembers(genderFilter, searchText) {
  const grid = document.querySelector('.members-grid');
  if (!grid || typeof MEMBERS === 'undefined') return;
  grid.innerHTML = '';

  const all = MEMBERS.map(name => {
    const g = MEMBERS_GENDER_OVERRIDE[name] || inferGenderFromName(name);

    return {
      name: name,
      gender: g, 
      photo: MEMBER_PHOTO_MAP?.[name] ? 'images/member/' + MEMBER_PHOTO_MAP[name] : 'images/member/member_placeholder.png',
      social: MEMBER_SOCIAL_MAP?.[name] || {}
    };
  });

  const filtered = all.filter(m => {
    const matchG = genderFilter === 'all' || m.gender === genderFilter;
    const matchS = m.name.toLowerCase().includes(searchText.toLowerCase());
    return matchG && matchS;
  });

  filtered.forEach((m, i) => {
    const genderLabel = m.gender === 'female' ? 'Nữ' : 'Nam';
    const badgeClass = m.gender === 'female' ? 'badge-female' : 'badge-male';
    const icon = m.gender === 'female' ? '🌸' : '⚽';
    
    const card = document.createElement('div');
    card.className = 'member-card fade-in';
    const hasFb = m.social.fb && m.social.fb.trim() !== '';

    const fbFront = hasFb ? `
      <div class="member-social-front">
        <a href="${m.social.fb}" target="_blank" rel="noopener" class="social-link-mini social-fb" title="Facebook" onclick="event.stopPropagation()">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>
      </div>` : '';

    const fbBack = hasFb ? `
      <a href="${m.social.fb}" target="_blank" rel="noopener" class="social-btn social-btn-fb" onclick="event.stopPropagation()">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        Facebook
      </a>` : '';

    card.innerHTML = `
      <div class="member-card-inner">
        <div class="card-front ${m.gender}">
          <div class="member-photo">
            <img src="${m.photo}" alt="${m.name}" loading="lazy"
                 onerror="this.parentElement.innerHTML='<div class=&quot;member-avatar-placeholder&quot;>${icon}</div>'">
          </div>
          <div class="member-full-name">${m.name}</div>
          <span class="member-gender-badge ${badgeClass}">${genderLabel}</span>
          ${fbFront}
        </div>
        <div class="card-back ${m.gender}">
          <div class="back-icon">${icon}</div>
          <div class="back-name">${m.name}</div>
          <div class="back-divider"></div>
          <div class="back-label">K15A3</div>
          <div class="back-val">${genderLabel}</div>
          ${fbBack}
        </div>
      </div>`;
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    grid.appendChild(card);
  });
  
  // Re-init observer
  setTimeout(initFadeObserver, 100);
}

function filterGender(gender) {
  currentGenderFilter = gender;
  document.querySelectorAll('.g-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.g-btn[data-gender="${gender}"]`)?.classList.add('active');
  const search = document.querySelector('.members-toolbar input')?.value || '';
  renderMembers(gender, search);
}

function searchMembers(val) {
  renderMembers(currentGenderFilter, val);
}

// ---- Scroll to content (hero) ----
function scrollToContent() {
  const target = document.querySelector('.container') || document.querySelector('.page-banner');
  target?.scrollIntoView({ behavior: 'smooth' });
}
