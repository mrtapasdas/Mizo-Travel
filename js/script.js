/* =====================================================
   MIZO TRAVEL — site script
   Vanilla JS only. No dependencies.
   ===================================================== */
(function(){
  "use strict";

  /* ---------- Sticky header ---------- */
  var header = document.getElementById('site-header');
  function onScrollHeader(){
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive:true });

  /* ---------- Mobile nav drawer ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var navClose = document.getElementById('nav-close');
  var mobileNav = document.getElementById('mobile-nav');
  var backdrop = document.getElementById('mobile-backdrop');

  function openNav(){
    mobileNav.classList.add('is-open');
    backdrop.classList.add('is-open');
    navToggle.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
  }
  function closeNav(){
    mobileNav.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  }
  navToggle.addEventListener('click', openNav);
  navClose.addEventListener('click', closeNav);
  backdrop.addEventListener('click', closeNav);
  mobileNav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeNav);
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') closeNav();
  });

  /* ---------- Scrollspy: highlight active nav link ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.main-nav a');
  function onScrollSpy(){
    var current = '';
    sections.forEach(function(sec){
      var rect = sec.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) current = sec.id;
    });
    navLinks.forEach(function(link){
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScrollSpy, { passive:true });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* ---------- Count-up numbers ---------- */
  var counters = document.querySelectorAll('.count');
  function animateCount(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var duration = 1400;
    var start = null;
    function step(ts){
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window){
    var ioCount = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          animateCount(entry.target);
          ioCount.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function(el){ ioCount.observe(el); });
  }

  /* ---------- Testimonial slider ---------- */
  var slider = document.getElementById('testimonial-slider');
  if (slider){
    var cards = slider.querySelectorAll('.t-card');
    var dotsWrap = document.getElementById('t-dots');
    var prevBtn = document.getElementById('t-prev');
    var nextBtn = document.getElementById('t-next');
    var idx = 0;
    var autoplayId;

    cards.forEach(function(_, i){
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i+1));
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', function(){ goTo(i); });
      dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap.querySelectorAll('button');

    function goTo(i){
      cards[idx].classList.remove('is-active');
      dots[idx].classList.remove('is-active');
      idx = (i + cards.length) % cards.length;
      cards[idx].classList.add('is-active');
      dots[idx].classList.add('is-active');
    }
    function next(){ goTo(idx + 1); }
    function prev(){ goTo(idx - 1); }

    nextBtn.addEventListener('click', function(){ next(); restartAutoplay(); });
    prevBtn.addEventListener('click', function(){ prev(); restartAutoplay(); });

    function startAutoplay(){ autoplayId = setInterval(next, 6500); }
    function restartAutoplay(){ clearInterval(autoplayId); startAutoplay(); }
    startAutoplay();

    /* basic touch swipe */
    var touchStartX = 0;
    slider.addEventListener('touchstart', function(e){ touchStartX = e.touches[0].clientX; }, { passive:true });
    slider.addEventListener('touchend', function(e){
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40){ dx < 0 ? next() : prev(); restartAutoplay(); }
    }, { passive:true });
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function(item){
    var btn = item.querySelector('.faq-q');
    var panel = item.querySelector('.faq-a');
    btn.addEventListener('click', function(){
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      faqItems.forEach(function(other){
        other.querySelector('.faq-q').setAttribute('aria-expanded','false');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen){
        btn.setAttribute('aria-expanded','true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Back to top ---------- */
  var backTop = document.getElementById('back-top');
  function onScrollBackTop(){
    backTop.classList.toggle('is-visible', window.scrollY > 600);
  }
  onScrollBackTop();
  window.addEventListener('scroll', onScrollBackTop, { passive:true });
  backTop.addEventListener('click', function(){
    window.scrollTo({ top:0, behavior:'smooth' });
  });

  /* ---------- Contact form validation (client-side demo) ---------- */
  var contactForm = document.getElementById('contact-form');
  if (contactForm){
    var statusEl = document.getElementById('form-status');
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      var valid = true;
      contactForm.querySelectorAll('[required]').forEach(function(input){
        var field = input.closest('.field');
        var ok = input.value.trim().length > 1 && (input.type !== 'email' || /^\S+@\S+\.\S+$/.test(input.value));
        if (field) field.classList.toggle('is-invalid', !ok);
        if (!ok) valid = false;
      });
      if (valid){
        statusEl.textContent = 'Thanks — your enquiry is on its way. We reply within a day.';
        statusEl.classList.add('is-success');
        contactForm.reset();
      } else {
        statusEl.textContent = 'Please fill in the highlighted fields.';
        statusEl.classList.remove('is-success');
      }
    });
  }

  /* ---------- Newsletter forms (demo) ---------- */
  ['newsletter-form','footer-newsletter-form'].forEach(function(id){
    var form = document.getElementById(id);
    if (!form) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      if (input && input.value){
        input.value = '';
        input.placeholder = 'Subscribed ✓';
        setTimeout(function(){ input.placeholder = 'you@example.com'; }, 3000);
      }
    });
  });

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
