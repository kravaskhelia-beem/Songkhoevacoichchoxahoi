/* =========================================================
   trang-chu.js — JS đặc thù index.html
   (accordion Myth Busters, công cụ tính tiền tiết kiệm,
    form cam kết với localStorage, thống kê thời gian thực)
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Accordion Myth Busters ---------- */
  document.querySelectorAll('.accordion-item').forEach(function (item) {
    const btn = item.querySelector('.accordion-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.accordion-item.open').forEach(function (other) {
        if (other === item) return;
        other.classList.remove('open');
        other.querySelector('.accordion-content').classList.remove('grid-rows-[1fr]');
        other.querySelector('.accordion-content').classList.add('grid-rows-[0fr]');
        other.querySelector('.accordion-btn').setAttribute('aria-expanded', 'false');
        other.querySelector('.accordion-icon').classList.remove('rotate-180');
      });

      const content = item.querySelector('.accordion-content');
      const icon = item.querySelector('.accordion-icon');
      if (isOpen) {
        item.classList.remove('open');
        content.classList.remove('grid-rows-[1fr]');
        content.classList.add('grid-rows-[0fr]');
        btn.setAttribute('aria-expanded', 'false');
        icon.classList.remove('rotate-180');
      } else {
        item.classList.add('open');
        content.classList.remove('grid-rows-[0fr]');
        content.classList.add('grid-rows-[1fr]');
        btn.setAttribute('aria-expanded', 'true');
        icon.classList.add('rotate-180');
      }
    });
  });

  /* ---------- Công cụ tính tiền tiết kiệm ---------- */
  const inputDieu = document.getElementById('so-dieu-ngay');
  const inputGia = document.getElementById('gia-bao');
  const inputDieuBao = document.getElementById('dieu-trong-bao');
  const ketQuaThang = document.getElementById('tiet-kiem-thang');
  const ketQuaNam = document.getElementById('tiet-kiem-nam');
  const ketQua10Nam = document.getElementById('tiet-kiem-10nam');
  const chiPhiNgay = document.getElementById('chi-phi-hang-ngay');
  const phanThuong = document.getElementById('phan-thuong');

  if (inputDieu && inputGia && inputDieuBao) {
    const phanThuongList = [
      { icon: 'fa-utensils', label: 'Tiền ăn sáng cả tháng', amount: 1500000 },
      { icon: 'fa-mobile-screen-button', label: 'Một chiếc điện thoại thông minh', amount: 5000000 },
      { icon: 'fa-plane-departure', label: 'Một chuyến du lịch cùng gia đình', amount: 20000000 },
      { icon: 'fa-motorcycle', label: 'Một chiếc xe máy mới', amount: 50000000 },
      { icon: 'fa-house-chimney', label: 'Khoản tích lũy lớn cho tương lai', amount: 200000000 }
    ];

    function formatTien(soTien) {
      return new Intl.NumberFormat('vi-VN').format(Math.round(soTien)) + '₫';
    }

    function tinhTietKiem() {
      const soDieu = Math.max(0, Number(inputDieu.value) || 0);
      const giaBao = Math.max(0, Number(inputGia.value) || 0);
      const dieuBao = Math.max(1, Number(inputDieuBao.value) || 20);

      const tienNgay = soDieu / dieuBao * giaBao;
      const tienThang = tienNgay * 30;
      const tienNam = tienThang * 12;
      const tien10Nam = tienNam * 10;

      chiPhiNgay.textContent = soDieu > 0
        ? 'Bạn đang chi khoảng ' + formatTien(tienNgay) + ' mỗi ngày cho thuốc lá.'
        : 'Hãy nhập số điếu bạn hút mỗi ngày để xem kết quả.';
      ketQuaThang.textContent = formatTien(tienThang);
      ketQuaNam.textContent = formatTien(tienNam);
      ketQua10Nam.textContent = formatTien(tien10Nam);

      phanThuong.innerHTML = phanThuongList.map(function (phanThuongItem) {
        const datDuoc = tienNam >= phanThuongItem.amount;
        return '<li class="flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition ' +
          (datDuoc
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border-slate-100 bg-slate-50 text-slate-400') + '">' +
          '<i class="fa-solid ' + phanThuongItem.icon + ' w-5 text-center' + (datDuoc ? ' text-emerald-600' : '') + '"></i>' +
          '<span class="flex-1 font-semibold">' + phanThuongItem.label + '</span>' +
          '<i class="fa-solid ' + (datDuoc ? 'fa-circle-check text-emerald-600' : 'fa-lock text-slate-300') + '"></i>' +
          '</li>';
      }).join('');
    }

    [inputDieu, inputGia, inputDieuBao].forEach(function (input) {
      input.addEventListener('input', tinhTietKiem);
    });
    tinhTietKiem();
  }

  /* ---------- Form cam kết (lưu trên thiết bị người dùng) ---------- */
  const STORAGE_KEY = 'skkc-commitments';
  const form = document.getElementById('form-cam-ket');

  if (form) {
    const inputTen = document.getElementById('ho-ten');
    const inputSdt = document.getElementById('so-dien-thoai');
    const inputLoiNhan = document.getElementById('loi-nhan');
    const loiTen = document.getElementById('loi-ho-ten');
    const loiSdt = document.getElementById('loi-so-dien-thoai');
    const demCamKet = document.getElementById('dem-cam-ket');
    const thanhCong = document.getElementById('thanh-cong');
    const thanhCongNoiDung = document.getElementById('thanh-cong-noi-dung');

    function layCamKet() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      } catch (e) {
        return [];
      }
    }

    function capNhatDem() {
      const soLuong = layCamKet().length;
      demCamKet.textContent = soLuong > 0
        ? soLuong + ' người đã cam kết từ bỏ thuốc lá (trên thiết bị này)'
        : 'Hãy là người đầu tiên cam kết ngay hôm nay!';
    }
    capNhatDem();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const ten = inputTen.value.trim();
      const sdt = inputSdt.value.trim();
      const loiNhan = inputLoiNhan.value.trim();

      const tenHopLe = ten.length >= 2;
      const sdtHopLe = /^0\d{9}$/.test(sdt);
      loiTen.classList.toggle('hidden', tenHopLe);
      loiSdt.classList.toggle('hidden', sdtHopLe);

      if (!tenHopLe || !sdtHopLe) {
        thanhCong.classList.add('hidden');
        return;
      }

      const danhSach = layCamKet();
      danhSach.push({
        ten: ten,
        sdt: sdt,
        loiNhan: loiNhan || 'Tôi cam kết từ bỏ khói thuốc ngay hôm nay.',
        ngay: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(danhSach));

      form.reset();
      capNhatDem();
      thanhCongNoiDung.textContent = 'Cảm ơn ' + ten + '! Cam kết của bạn đã được ghi nhận.';
      thanhCong.classList.remove('hidden');
      thanhCong.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- Thống kê thời gian thực ---------- */
  const oToanCau = document.getElementById('tk-toan-cau');
  const oDieuThuoc = document.getElementById('tk-dieu-thuoc');
  const oVietNam = document.getElementById('tk-viet-nam');
  const oThuDong = document.getElementById('tk-thu-dong');
  const oNam = document.getElementById('nam-thong-ke');

  if (oToanCau && oDieuThuoc && oVietNam && oThuDong && oNam) {
    const namHienTai = new Date().getFullYear();
    oNam.textContent = namHienTai;
    const mocDauNam = new Date(namHienTai, 0, 1).getTime();
    const soGiayMotNam = 365.25 * 24 * 3600;
    const tyLe = {
      toanCau: 8000000 / soGiayMotNam,
      dieuThuoc: 5700000000000 / soGiayMotNam,
      vietNam: 40000 / soGiayMotNam,
      thuDong: 1300000 / soGiayMotNam
    };

    function capNhatThongKe() {
      const giayTroiQua = (Date.now() - mocDauNam) / 1000;
      oToanCau.textContent = Math.floor(giayTroiQua * tyLe.toanCau).toLocaleString('vi-VN');
      oDieuThuoc.textContent = Math.floor(giayTroiQua * tyLe.dieuThuoc).toLocaleString('vi-VN');
      oVietNam.textContent = Math.floor(giayTroiQua * tyLe.vietNam).toLocaleString('vi-VN');
      oThuDong.textContent = Math.floor(giayTroiQua * tyLe.thuDong).toLocaleString('vi-VN');
    }
    setInterval(capNhatThongKe, 1000);
    capNhatThongKe();
  }
})();
