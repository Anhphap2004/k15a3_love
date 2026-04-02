const categoryConfig = {
  image: ['bill', 'festival', 'member', 'graduation_photo', 'learning', 'love', 'memory', 'misc'],
  video: ['video']
};

function renderCategoryOptions(type) {
  const categoryEl = document.getElementById('category');
  if (!categoryEl) return;

  categoryEl.innerHTML = '';
  (categoryConfig[type] || []).forEach((cat) => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryEl.appendChild(option);
  });

  toggleAlbumInput();
}

function toggleAlbumInput() {
  const type = document.getElementById('type')?.value;
  const category = document.getElementById('category')?.value;
  const albumWrap = document.getElementById('albumWrap');

  if (!albumWrap) return;
  const shouldShow = type === 'image' && category === 'festival';
  albumWrap.style.display = shouldShow ? 'block' : 'none';
}

function setStatus(message, variant = 'info') {
  const status = document.getElementById('uploadStatus');
  if (!status) return;
  status.className = `upload-status ${variant}`;
  status.textContent = message;
}

function formatBytes(bytes) {
  if (!bytes || bytes < 1024) return `${bytes || 0} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let idx = 0;
  while (value > 1024 && idx < units.length - 1) {
    value /= 1024;
    idx += 1;
  }
  return `${value.toFixed(1)} ${units[idx]}`;
}

async function refreshLatestMedia() {
  const wrap = document.getElementById('latestMedia');
  if (!wrap) return;

  wrap.innerHTML = '<p class="admin-muted">Dang tai danh sach...</p>';
  try {
    const response = await fetch('/api/media', { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Khong tai duoc du lieu media');
    const payload = await response.json();
    const items = Array.isArray(payload.items) ? payload.items.slice(0, 12) : [];

    if (!items.length) {
      wrap.innerHTML = '<p class="admin-muted">Chua co media nao.</p>';
      return;
    }

    wrap.innerHTML = items.map((item) => {
      const preview = item.type === 'image'
        ? `<img src="${item.src}" alt="${item.caption || item.fileName}" loading="lazy">`
        : `<video src="${item.src}" preload="metadata"></video>`;
      return `
        <article class="latest-item">
          <div class="thumb">${preview}</div>
          <div class="meta">
            <div class="line"><strong>${item.category}</strong>${item.album ? ` / ${item.album}` : ''}</div>
            <div class="line">${item.caption || item.fileName || 'Khong co mo ta'}</div>
            <div class="line muted">${formatBytes(item.size)} · ${item.type}</div>
          </div>
        </article>
      `;
    }).join('');
  } catch (error) {
    wrap.innerHTML = '<p class="admin-muted">Khong ket noi duoc API media.</p>';
  }
}

async function handleUploadSubmit(event) {
  event.preventDefault();

  const form = document.getElementById('uploadForm');
  const mediaInput = document.getElementById('media');
  const type = document.getElementById('type')?.value;
  const category = document.getElementById('category')?.value;

  if (!form || !mediaInput || !mediaInput.files?.[0]) {
    setStatus('Vui long chon tep truoc khi tai len.', 'error');
    return;
  }

  const file = mediaInput.files[0];
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  if (type === 'image' && !isImage) {
    setStatus('Loai tep khong hop le: vui long chon file anh.', 'error');
    return;
  }
  if (type === 'video' && !isVideo) {
    setStatus('Loai tep khong hop le: vui long chon file video.', 'error');
    return;
  }

  const body = new FormData(form);
  setStatus('Dang tai len, vui long doi...', 'info');

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body
    });
    const payload = await response.json();

    if (!response.ok || !payload.ok) {
      throw new Error(payload.message || 'Tai len that bai');
    }

    setStatus(payload.message || 'Tai len thanh cong.', 'success');
    form.reset();
    renderCategoryOptions('image');
    await refreshLatestMedia();
  } catch (error) {
    setStatus(error.message || 'Co loi xay ra trong qua trinh tai len.', 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCategoryOptions('image');
  refreshLatestMedia();

  const typeEl = document.getElementById('type');
  typeEl?.addEventListener('change', (event) => {
    renderCategoryOptions(event.target.value);
  });

  const categoryEl = document.getElementById('category');
  categoryEl?.addEventListener('change', toggleAlbumInput);

  const form = document.getElementById('uploadForm');
  form?.addEventListener('submit', handleUploadSubmit);
});
