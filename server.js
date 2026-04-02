const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const REGISTRY_PATH = path.join(ROOT_DIR, 'data', 'media-registry.json');
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AnhhPhapp2004@';

const IMAGE_CATEGORY_PATHS = {
  bill: path.join(ROOT_DIR, 'images', 'bill'),
  festival: path.join(ROOT_DIR, 'images', 'festival'),
  member: path.join(ROOT_DIR, 'images', 'member'),
  graduation_photo: path.join(ROOT_DIR, 'images', 'graduation_photo'),
  learning: path.join(ROOT_DIR, 'images', 'learning'),
  love: path.join(ROOT_DIR, 'images', 'love'),
  memory: path.join(ROOT_DIR, 'images', 'memory'),
  misc: path.join(ROOT_DIR, 'images', 'misc')
};

const VIDEO_CATEGORY_PATHS = {
  video: path.join(ROOT_DIR, 'video')
};

const LEGACY_VIDEO_FOLDERS = [path.join(ROOT_DIR, 'images', 'video')];

const MAX_IMAGE_SIZE = 30 * 1024 * 1024;
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
const ALLOWED_IMAGE_MIME = /image\/(jpeg|jpg|png|webp|gif|jfif)/;
const ALLOWED_VIDEO_MIME = /video\/(mp4|webm|quicktime|x-m4v|x-msvideo)/;
const ALLOWED_IMAGE_EXT = /\.(jpg|jpeg|png|webp|gif|jfif)$/i;
const ALLOWED_VIDEO_EXT = /\.(mp4|webm|mov|avi|m4v)$/i;

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function toWebPath(absPath) {
  return path.relative(ROOT_DIR, absPath).split(path.sep).join('/');
}

function sanitizeSegment(value, fallback = 'general') {
  const safe = String(value || '')
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return safe || fallback;
}

function captionFromFileName(fileName) {
  return fileName
    .replace(path.extname(fileName), '')
    .replace(/[_-]+/g, ' ')
    .trim();
}

function detectType(file) {
  const mimeType = file?.mimetype || '';
  const originalName = file?.originalname || '';

  if (ALLOWED_IMAGE_MIME.test(mimeType) || ALLOWED_IMAGE_EXT.test(originalName)) return 'image';
  if (ALLOWED_VIDEO_MIME.test(mimeType) || ALLOWED_VIDEO_EXT.test(originalName)) return 'video';
  return null;
}

function readRegistry() {
  try {
    if (!fs.existsSync(REGISTRY_PATH)) {
      return { items: [] };
    }
    const data = fs.readFileSync(REGISTRY_PATH, 'utf8');
    const parsed = JSON.parse(data);
    if (!parsed || !Array.isArray(parsed.items)) {
      return { items: [] };
    }
    return parsed;
  } catch (error) {
    return { items: [] };
  }
}

function writeRegistry(data) {
  ensureDir(path.dirname(REGISTRY_PATH));
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function addRegistryItem(item) {
  const registry = readRegistry();
  registry.items.push(item);
  writeRegistry(registry);
}

function listFilesRecursive(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absEntryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFilesRecursive(absEntryPath));
    } else {
      files.push(absEntryPath);
    }
  }
  return files;
}

function buildImageRecordsFromFs(category, categoryRoot) {
  const files = listFilesRecursive(categoryRoot);
  return files
    .filter((absPath) => /\.(jpg|jpeg|png|gif|webp|jfif)$/i.test(absPath))
    .map((absPath) => {
      const stat = fs.statSync(absPath);
      const relativeToCategory = path.relative(categoryRoot, absPath);
      const folderParts = relativeToCategory.split(path.sep);
      const album = folderParts.length > 1 ? folderParts[0] : null;
      const fileName = path.basename(absPath);

      return {
        id: `${category}:${toWebPath(absPath)}`,
        type: 'image',
        category,
        album,
        fileName,
        caption: captionFromFileName(fileName),
        src: toWebPath(absPath),
        size: stat.size,
        updatedAt: stat.mtime.toISOString(),
        source: 'filesystem'
      };
    });
}

function buildVideoRecordsFromFs() {
  const roots = [VIDEO_CATEGORY_PATHS.video, ...LEGACY_VIDEO_FOLDERS];
  const records = [];
  for (const root of roots) {
    const files = listFilesRecursive(root)
      .filter((absPath) => /\.(mp4|webm|mov|avi|m4v)$/i.test(absPath))
      .map((absPath) => {
        const stat = fs.statSync(absPath);
        const fileName = path.basename(absPath);
        return {
          id: `video:${toWebPath(absPath)}`,
          type: 'video',
          category: 'video',
          album: null,
          fileName,
          caption: captionFromFileName(fileName),
          src: toWebPath(absPath),
          size: stat.size,
          updatedAt: stat.mtime.toISOString(),
          source: 'filesystem'
        };
      });
    records.push(...files);
  }
  return records;
}

function mergeWithRegistry(fsItems) {
  const registry = readRegistry();
  const bySrc = new Map();

  for (const item of fsItems) {
    bySrc.set(item.src, item);
  }

  for (const item of registry.items) {
    if (!item || !item.src) continue;
    const current = bySrc.get(item.src) || {};
    bySrc.set(item.src, {
      ...current,
      ...item,
      source: current.source || 'registry'
    });
  }

  return Array.from(bySrc.values()).sort((a, b) => {
    const ta = new Date(a.updatedAt || a.uploadedAt || 0).getTime();
    const tb = new Date(b.updatedAt || b.uploadedAt || 0).getTime();
    return tb - ta;
  });
}

function getUploadTarget(type, category, album) {
  if (type === 'video') {
    return VIDEO_CATEGORY_PATHS.video;
  }

  const normalizedCategory = IMAGE_CATEGORY_PATHS[category] ? category : 'misc';
  let targetDir = IMAGE_CATEGORY_PATHS[normalizedCategory];

  if (normalizedCategory === 'festival' && album) {
    targetDir = path.join(targetDir, sanitizeSegment(album));
  }

  return targetDir;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const requestedType = req.body.type;
    const detectedType = detectType(file);
    const type = requestedType || detectedType;

    if (!type) {
      return cb(new Error('Khong xac dinh duoc loai tep.'));
    }

    const category = sanitizeSegment(req.body.category || (type === 'video' ? 'video' : 'memory'));
    const album = req.body.album ? sanitizeSegment(req.body.album) : null;
    const target = getUploadTarget(type, category, album);

    ensureDir(target);

    req.uploadContext = { type, category: type === 'video' ? 'video' : category, album, target };
    cb(null, target);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const baseName = sanitizeSegment(path.basename(file.originalname, ext), 'media');
    const timestamp = Date.now();
    cb(null, `${timestamp}-${baseName}${ext.toLowerCase()}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const detectedType = detectType(file);
    if (!detectedType) {
      return cb(new Error('Chi chap nhan tep anh hoac video hop le.'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: MAX_VIDEO_SIZE
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function unauthorized(res) {
  res.set('WWW-Authenticate', 'Basic realm="K15A3 Upload", charset="UTF-8"');
  return res.status(401).json({ ok: false, message: 'Can dang nhap quan tri de thuc hien thao tac nay.' });
}

function parseBasicAuth(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Basic ')) return null;

  const token = header.slice(6);
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const idx = decoded.indexOf(':');
    if (idx < 0) return null;
    return {
      username: decoded.slice(0, idx),
      password: decoded.slice(idx + 1)
    };
  } catch (error) {
    return null;
  }
}

function requireAdminAuth(req, res, next) {
  const auth = parseBasicAuth(req);
  if (!auth) return unauthorized(res);

  if (auth.username !== ADMIN_USERNAME || auth.password !== ADMIN_PASSWORD) {
    return unauthorized(res);
  }

  next();
}

app.get('/admin-upload.html', requireAdminAuth, (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'admin-upload.html'));
});

app.get('/js/admin-upload.js', requireAdminAuth, (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'js', 'admin-upload.js'));
});

app.use(express.static(ROOT_DIR));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.get('/api/categories', (req, res) => {
  res.json({
    image: Object.keys(IMAGE_CATEGORY_PATHS),
    video: Object.keys(VIDEO_CATEGORY_PATHS),
    notes: {
      bill: 'Luu bien lai ung ho tien bac',
      festival: 'Luu su kien quy gia, co the chia album theo nam',
      member: 'Luu anh thanh vien lop',
      video: 'Luu video chat luong cao trong thu muc video/'
    }
  });
});

app.get('/api/media', (req, res) => {
  const type = req.query.type;
  const category = req.query.category;
  const album = req.query.album;

  const imageItems = Object.entries(IMAGE_CATEGORY_PATHS).flatMap(([cat, root]) => buildImageRecordsFromFs(cat, root));
  const videoItems = buildVideoRecordsFromFs();
  let items = mergeWithRegistry([...imageItems, ...videoItems]);

  if (type) {
    items = items.filter((item) => item.type === type);
  }
  if (category) {
    items = items.filter((item) => item.category === category);
  }
  if (album) {
    items = items.filter((item) => item.album === album);
  }

  res.json({
    total: items.length,
    items
  });
});

app.post('/api/upload', requireAdminAuth, (req, res) => {
  upload.single('media')(req, res, (error) => {
    if (error) {
      return res.status(400).json({ ok: false, message: error.message });
    }

    if (!req.file || !req.uploadContext) {
      return res.status(400).json({ ok: false, message: 'Khong tim thay tep tai len.' });
    }

    const { type, category, album } = req.uploadContext;

    if (type === 'image' && req.file.size > MAX_IMAGE_SIZE) {
      return res.status(400).json({ ok: false, message: 'Anh vuot qua gioi han 30MB.' });
    }

    const src = toWebPath(req.file.path);
    const item = {
      id: `${type}:${src}`,
      type,
      category,
      album,
      fileName: req.file.filename,
      caption: String(req.body.caption || captionFromFileName(req.file.filename)).trim(),
      src,
      size: req.file.size,
      uploadedAt: new Date().toISOString(),
      mimeType: req.file.mimetype,
      quality: 'original'
    };

    addRegistryItem(item);

    res.json({
      ok: true,
      message: 'Tai len thanh cong. Tep duoc giu nguyen chat luong goc.',
      item
    });
  });
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

for (const folder of Object.values(IMAGE_CATEGORY_PATHS)) {
  ensureDir(folder);
}
for (const folder of Object.values(VIDEO_CATEGORY_PATHS)) {
  ensureDir(folder);
}

if (!fs.existsSync(REGISTRY_PATH)) {
  writeRegistry({ items: [] });
}

app.listen(PORT, () => {
  if (ADMIN_USERNAME === 'admin' && ADMIN_PASSWORD === 'change-me-now') {
    console.warn('WARNING: Ban dang dung tai khoan mac dinh. Dat ADMIN_USERNAME va ADMIN_PASSWORD khi deploy.');
  }
  console.log(`K15A3 server running at http://localhost:${PORT}`);
});
