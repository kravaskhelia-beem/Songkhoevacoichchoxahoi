# Sống Khỏe – Không Khói Thuốc

Website tuyên truyền giáo dục sức khỏe cộng đồng: tác hại của thuốc lá, thuốc lá điện tử (vape) và phòng chống ma túy cho học sinh, sinh viên.

## Cấu trúc dự án

```
├── index.html            # Trang chủ: thuốc lá & vape
├── ma-tuy.html           # Trang: phòng chống ma túy
├── assets/
│   ├── css/main.min.css  # Tailwind CSS đã build (không dùng CDN)
│   └── js/
│       ├── site.js       # JS dùng chung (menu, reveal, đếm số, chia sẻ, PWA)
│       └── trang-chu.js  # JS riêng trang chủ (accordion, tính tiền, form cam kết, thống kê trực tiếp)
├── images/               # Ảnh nén (bản gốc backup trong images/original/)
├── src/styles.css        # Nguồn Tailwind: @tailwind directives + CSS tùy chỉnh
├── dist/                 # Bản copy chuẩn bị deploy (chỉ chứa file chạy được)
├── manifest.json         # PWA manifest
├── sw.js                 # Service Worker (cache-first, offline)
├── robots.txt            # TODO: cập nhật domain thật
├── sitemap.xml           # TODO: cập nhật domain thật
├── tailwind.config.js    # Cấu hình Tailwind (content = *.html + assets/js)
└── package.json
```

## Build & phát triển

Yêu cầu: Node.js đã cài đặt.

```bash
# Cài phụ thuộc (lần đầu)
npm install

# Build CSS Tailwind sau khi sửa HTML hoặc class mới trong HTML/JS
npm run build:css

# Build + theo dõi liên tục khi đang dev
npm run watch:css
```

Sau khi sửa nội dung trang, đồng bộ bản deploy:

```powershell
robocopy . dist /E /XD node_modules dist src original /XF package.json package-lock.json tailwind.config.js
```

## Lưu ý quan trọng

- **Domain chính thức**: `https://song-khoe-xyz.vercel.app` — đã khai báo tại `og:url`, `og:image`, `meta twitter:image`, `robots.txt`, `sitemap.xml` và JSON-LD. Deploy tự động từ GitHub qua Vercel khi push.
- **Service Worker**: dùng cache version `skkc-v1.0.0` trong `sw.js` — khi cập nhật site, tăng số version này để trình duyệt làm mới cache.
- **Ảnh gốc** chưa nén được backup tại `images/original/`.
- **Cam kết cai thuốc** lưu bằng `localStorage` trên thiết bị người dùng (không gửi đi đâu cả).
- Hotline: `1800 6606` (tổng đài cai thuốc — VINACOSH/Bộ Y tế), `0769.04.04.04` (đường dây tố giác ma túy của chiến dịch).
