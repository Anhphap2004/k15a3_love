# K15A3 Love - Professional Media System

Website K15A3 da duoc nang cap tu static sang he thong co backend upload media thuc te.

## 1. Tinh nang moi

- Upload anh va video qua trang quan tri: `admin-upload.html`
- API media dong: danh sach anh/video khong can hard-code
- Phan vung thu muc ro rang:
  - `images/bill`: bien lai va anh ung ho tien bac
  - `images/festival`: su kien quy gia (co the tach album theo nam)
  - `images/member`: anh thanh vien lop
  - `images/memory`: ky niem tong hop
  - `images/learning`: hoc tap
  - `images/graduation_photo`: tot nghiep
  - `images/love`: tinh ban
  - `video/`: video chat luong cao
- He thong giu nguyen file goc khi upload (khong nen chat luong)
- Gallery/video page tu dong lay du lieu tu API, co fallback du lieu cu

## 2. Cai dat va chay

Yeu cau: Node.js 18+

Khuyen nghi dat tai khoan quan tri truoc khi chay:

```bash
# Linux/macOS
export ADMIN_USERNAME="ten-cua-ban"
export ADMIN_PASSWORD="mat-khau-rat-manh"

# Windows PowerShell
$env:ADMIN_USERNAME="ten-cua-ban"
$env:ADMIN_PASSWORD="mat-khau-rat-manh"
```

```bash
npm install
npm run start
```

Mo website tai:

- Home: `http://localhost:3000`
- Admin upload: `http://localhost:3000/admin-upload.html`

## 3. API backend

### GET `/api/health`

Kiem tra server song.

### GET `/api/categories`

Lay danh sach category hop le cho upload.

### GET `/api/media?type=image&category=memory`

Lay danh sach media da co trong he thong.

Tham so:

- `type`: `image` | `video`
- `category`: bill, festival, member, learning, memory, love, graduation_photo, misc, video
- `album`: tuy chon (nhat la voi festival)

### POST `/api/upload`

Upload file media.

Bao mat:

- Endpoint nay bat buoc dang nhap Basic Auth
- Dung `ADMIN_USERNAME` va `ADMIN_PASSWORD` khi deploy
- Neu de mac dinh (`admin` / `change-me-now`) thi khong an toan

Form-data:

- `media`: file upload
- `type`: `image` | `video`
- `category`: category dich
- `album`: tuy chon (dung cho festival)
- `caption`: mo ta hien thi

## 4. Metadata

- File metadata upload luu o: `data/media-registry.json`
- Danh sach media tra ve duoc ghep tu:
  - du lieu scan he thong tep
  - metadata da upload

## 5. Luu y van hanh

- Khong xoa thu muc `images/` va `video/` de tranh mat du lieu
- Co the backup nhanh bang cach sao chep cac thu muc media va `data/media-registry.json`
- Bat buoc dung HTTPS khi deploy de bao ve thong tin dang nhap Basic Auth
- Gioi han firewall/allowlist IP neu chi muon ban truy cap trang upload
