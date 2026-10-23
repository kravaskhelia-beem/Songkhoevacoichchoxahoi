/* =========================================================
   site.js — JS dùng chung cho mọi trang
   (nút lên đầu trang, menu mobile, scroll-spy, reveal,
    đếm số tăng dần, liên hệ nổi, chia sẻ, đăng ký PWA)
   Cấu hình chia sẻ của từng trang đọc từ <body data-*>
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Nút lên đầu trang ---------- */
  const btnTop = document.getElementById('btn-top');

  function onScroll() {
    const showTop = window.scrollY >= 600;
    if (btnTop) {
      btnTop.classList.toggle('hidden', !showTop);
      btnTop.classList.toggle('flex', showTop);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (btnTop) {
    btnTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Menu mobile ---------- */
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');

  function dongMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('hidden');
    iconOpen.classList.remove('hidden');
    iconClose.classList.add('hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', !isHidden);
      iconOpen.classList.toggle('hidden', isHidden);
      iconClose.classList.toggle('hidden', !isHidden);
      menuBtn.setAttribute('aria-expanded', String(isHidden));
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', dongMenu);
    });
  }

  /* ---------- Tô sáng menu theo section đang xem ---------- */
  const navLinks = document.querySelectorAll('.nav-link');
  const activeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) {
          const match = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('!text-emerald-700', match);
          link.classList.toggle('!bg-emerald-50', match);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (section) {
    activeObserver.observe(section);
  });

  /* ---------- Hiệu ứng hiện dần khi cuộn ---------- */
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---------- Đếm số tăng dần ---------- */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString('vi-VN');
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(function (el) {
    counterObserver.observe(el);
  });

  /* ---------- Nút liên hệ nổi ---------- */
  const nutLienHe = document.getElementById('nut-lien-he');
  const bangLienHe = document.getElementById('bang-lien-he');

  if (nutLienHe && bangLienHe) {
    nutLienHe.addEventListener('click', function () {
      const dangMo = !bangLienHe.classList.contains('hidden');
      bangLienHe.classList.toggle('hidden', dangMo);
      nutLienHe.setAttribute('aria-expanded', String(!dangMo));
    });
    bangLienHe.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        bangLienHe.classList.add('hidden');
        nutLienHe.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Chia sẻ mạng xã hội ---------- */
  const tieuDeChiaSe = document.body.dataset.shareTitle || 'Sống Khỏe – Không Khói Thuốc';
  const noiDungChiaSe = document.body.dataset.shareText || 'Cùng lan tỏa thông điệp sống khỏe!';

  function hienToast(noiDung) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    document.getElementById('toast-noi-dung').textContent = noiDung;
    toast.classList.remove('hidden');
    toast.classList.add('flex');
    clearTimeout(hienToast._timer);
    hienToast._timer = setTimeout(function () {
      toast.classList.add('hidden');
      toast.classList.remove('flex');
    }, 2500);
  }

  document.querySelectorAll('[data-share]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const loai = btn.dataset.share;
      const url = window.location.href;

      if (loai === 'copy') {
        navigator.clipboard.writeText(url)
          .then(function () { hienToast('Đã sao chép liên kết trang web!'); })
          .catch(function () { hienToast('Không thể sao chép liên kết.'); });
      } else if (loai === 'native' && navigator.share) {
        navigator.share({ title: tieuDeChiaSe, text: noiDungChiaSe, url: url }).catch(function () {});
      } else if (loai === 'facebook') {
        window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url), '_blank', 'noopener,width=600,height=500');
      } else if (loai === 'x') {
        window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(noiDungChiaSe + ' ' + url), '_blank', 'noopener,width=600,height=500');
      }
    });
  });

  /* ---------- PWA: đăng ký Service Worker ---------- */
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(function () {
      /* Không hỗ trợ / offline host — bỏ qua im lặng */
    });
  }
})();
