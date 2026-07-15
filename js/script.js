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
if (backTop){
  function onScrollBackTop(){
    backTop.classList.toggle('is-visible', window.scrollY > 600);
  }
  onScrollBackTop();
  window.addEventListener('scroll', onScrollBackTop, { passive:true });
  backTop.addEventListener('click', function(){
    window.scrollTo({ top:0, behavior:'smooth' });
  });
}

 /* ---------- WhatsApp contact form ---------- */
// NEW: Prevent selecting back dates in the calendar UI
var waDateInput = document.getElementById('wa-date');
if (waDateInput) {
  var todayDate = new Date();
  var dd = String(todayDate.getDate()).padStart(2, '0');
  var mm = String(todayDate.getMonth() + 1).padStart(2, '0'); // January is 0!
  var yyyy = todayDate.getFullYear();
  // Sets the minimum selectable date to today (Format: YYYY-MM-DD)
  waDateInput.setAttribute('min', yyyy + '-' + mm + '-' + dd);
}
   
   var waForm = document.getElementById('wa-form');
if (waForm){
  waForm.addEventListener('submit', function(e){
    e.preventDefault();
    var name    = document.getElementById('wa-name').value.trim();
    var contact = document.getElementById('wa-contact').value.trim();
    var people  = document.getElementById('wa-people').value.trim();
    var date    = document.getElementById('wa-date').value;
    var days    = document.getElementById('wa-days').value.trim();
    var nights  = document.getElementById('wa-nights').value.trim();
    var accom   = (waForm.querySelector('[name="accommodation"]:checked') || {}).value || '';
    var transp  = (waForm.querySelector('[name="transport"]:checked') || {}).value || '';
    var meal    = (waForm.querySelector('[name="meal"]:checked') || {}).value || '';
    var pickup  = (waForm.querySelector('[name="pickup"]:checked') || {}).value || '';
    var permit  = (waForm.querySelector('[name="permit"]:checked') || {}).value || '';
    var pkg = (waForm.querySelector('[name="package"]:checked') || {}).value || '';
    var message = document.getElementById('wa-message').value.trim();

     /* NEW: Setup date objects for JS validation fallback */
    var selectedDateObj = new Date(date + 'T00:00:00');
    var todayObj = new Date();
    todayObj.setHours(0, 0, 0, 0);
     
    /* Validate required fields */
    var checks = [
      { el: document.getElementById('wa-name'),    ok: name.length > 1 },
      { el: document.getElementById('wa-contact'), ok: contact.length > 5 },
      { el: document.getElementById('wa-people'),  ok: people !== '' && parseInt(people, 10) > 0 },
      { el: document.getElementById('wa-date'),    ok: date.length > 0 && selectedDateObj >= todayObj },
      { el: document.getElementById('wa-days'),    ok: days !== '' && parseInt(days, 10) > 0 }
    ];
    var valid = true;
    checks.forEach(function(c){
      var field = c.el.closest('.field');
      if (field) field.classList.toggle('is-invalid', !c.ok);
      if (!c.ok) valid = false;
    });
    if (!valid) return;

    /* Format date nicely */
    var dateStr = date;
    try {
      var d = new Date(date + 'T00:00:00');
      dateStr = d.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
    } catch(_){}

    /* Build duration string */
    var duration = days + ' Day' + (parseInt(days, 10) !== 1 ? 's' : '');
    if (nights !== '') duration += ' / ' + nights + ' Night' + (parseInt(nights, 10) !== 1 ? 's' : '');

    /* Build WhatsApp message */
    var lines = [
      'Hi Mizo Travel!', '',
      '*Name:* '            + name,
      '*Contact:* '         + contact,
      '*No. of People:* '   + people,
      '*Travel Date:* '     + dateStr,
      '*Duration:* '        + duration,
      '*Accommodation:* '   + accom,
      '*Transport:* '       + transp,
      '*Meal Preference:* ' + meal,
      '*Pickup & Drop:* '   + pickup,
      '*Permit (ILP):* '    + permit,
      '*Package Type:* '    + pkg
    ];
    if (message) lines.push('*Message:* ' + message);

    /* ⚠️ Replace 913890000000 with your real WhatsApp number */
    var waNumber = '919531671758';
    window.open(
      'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(lines.join('\n')),
      '_blank', 'noopener,noreferrer'
    );
  });

  /* Clear invalid state on input */
  waForm.querySelectorAll('input, textarea').forEach(function(input){
    input.addEventListener('input', function(){
      var field = input.closest('.field');
      if (field) field.classList.remove('is-invalid');
    });
  });
}
  /* ---------- Newsletter forms (demo) ---------- */
  var NL_ENDPOINT = 'https://formspree.io/f/xjgqjznq';
 
  function doNewsletterSubmit(form, feedbackId) {
    var input = form.querySelector('input[type="email"]');
    var btn   = form.querySelector('button[type="submit"]');
    var fb    = document.getElementById(feedbackId);
    if (!input || !input.value.trim()) return;
 
    var email    = input.value.trim();
    var origHTML = btn.innerHTML;
 
    /* Loading state */
    btn.disabled = true;
    btn.textContent = 'Sending…';
    if (fb) { fb.textContent = ''; fb.className = 'nl-feedback'; }
 
    fetch(NL_ENDPOINT, {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body    : JSON.stringify({
        email    : email,
        _subject : 'New Newsletter Subscriber — Mizo Travel',
        _replyto : email
      })
    })
    .then(function(res) {
      if (res.ok) {
        input.value = '';
        if (fb) {
          fb.textContent = '✓ Subscribed! You\'ll hear from us soon.';
          fb.className = 'nl-feedback nl-success';
        }
      } else {
        return res.json().then(function(data) {
          throw new Error(data.error || 'Server error');
        });
      }
    })
    .catch(function() {
      if (fb) {
        fb.textContent = 'Something went wrong — please try again.';
        fb.className = 'nl-feedback nl-error';
      }
    })
    .then(function() {
      btn.disabled = false;
      btn.innerHTML = origHTML;
    });
  }
 
  var nlForm = document.getElementById('newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', function(e) {
      e.preventDefault();
      doNewsletterSubmit(nlForm, 'nl-feedback');
    });
  }
 
  var fnlForm = document.getElementById('footer-newsletter-form');
  if (fnlForm) {
    fnlForm.addEventListener('submit', function(e) {
      e.preventDefault();
      doNewsletterSubmit(fnlForm, 'fnl-feedback');
    });
  }
/* ---------- Hero parallax ---------- */
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var heroEl = document.querySelector('.hero');
var ridgeBack = document.querySelector('.ridge-back');
var ridgeMid = document.querySelector('.ridge-mid');
var ridgeFront = document.querySelector('.ridge-front');
if (heroEl && ridgeBack && ridgeMid && ridgeFront && !prefersReducedMotion){
  var parallaxTicking = false;
  function updateParallax(){
    var rect = heroEl.getBoundingClientRect();
    var progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
    ridgeBack.style.transform  = 'translateY(' + (progress * 18) + 'px)';
    ridgeMid.style.transform   = 'translateY(' + (progress * 36) + 'px)';
    ridgeFront.style.transform = 'translateY(' + (progress * 58) + 'px)';
    parallaxTicking = false;
  }
  window.addEventListener('scroll', function(){
    if (!parallaxTicking){ requestAnimationFrame(updateParallax); parallaxTicking = true; }
  }, { passive:true });
  updateParallax();
}
  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
