/* Sarami Media — interacțiuni site */
(function () {
  "use strict";

  /* ---------- Navigație: fundal la scroll ---------- */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Meniu mobil ---------- */
  var burger = document.querySelector(".nav-burger");
  var links = document.querySelector(".nav-links");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        burger.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Reveal la scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Spotlight pe carduri ---------- */
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* ---------- Hero slider ---------- */
  var slides = document.querySelectorAll(".hero-slide");
  if (slides.length > 1) {
    var dotsWrap = document.querySelector(".hero-dots");
    var current = 0;
    var timer = null;
    var INTERVAL = 6500;

    slides.forEach(function (_, i) {
      var b = document.createElement("button");
      b.setAttribute("aria-label", "Slide " + (i + 1));
      b.addEventListener("click", function () { go(i, true); });
      dotsWrap.appendChild(b);
    });
    var dots = dotsWrap.querySelectorAll("button");

    function go(i, manual) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, idx) { s.classList.toggle("active", idx === current); });
      dots.forEach(function (d, idx) { d.classList.toggle("active", idx === current); });
      if (manual) restart();
    }
    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { go(current + 1); }, INTERVAL);
    }

    var prev = document.querySelector(".hero-prev");
    var next = document.querySelector(".hero-next");
    if (prev) prev.addEventListener("click", function () { go(current - 1, true); });
    if (next) next.addEventListener("click", function () { go(current + 1, true); });

    go(0);
    restart();
  }

  /* ---------- Slider testimoniale ---------- */
  var testiTrack = document.querySelector(".testi-track");
  if (testiTrack) {
    var testiCards = testiTrack.children.length;
    var testiIdx = 0;
    var testiTimer = null;
    var navWrap = document.querySelector(".testi-nav");
    for (var i = 0; i < testiCards; i++) {
      (function (idx) {
        var b = document.createElement("button");
        b.setAttribute("aria-label", "Testimonial " + (idx + 1));
        b.addEventListener("click", function () { testiGo(idx, true); });
        navWrap.appendChild(b);
      })(i);
    }
    var testiDots = navWrap.querySelectorAll("button");
    function testiGo(i, manual) {
      testiIdx = (i + testiCards) % testiCards;
      testiTrack.style.transform = "translateX(-" + testiIdx * 100 + "%)";
      testiDots.forEach(function (d, idx) { d.classList.toggle("active", idx === testiIdx); });
      if (manual) testiRestart();
    }
    function testiRestart() {
      if (testiTimer) clearInterval(testiTimer);
      testiTimer = setInterval(function () { testiGo(testiIdx + 1); }, 7000);
    }
    var tPrev = document.querySelector(".testi-arrow.prev");
    var tNext = document.querySelector(".testi-arrow.next");
    if (tPrev) tPrev.addEventListener("click", function () { testiGo(testiIdx - 1, true); });
    if (tNext) tNext.addEventListener("click", function () { testiGo(testiIdx + 1, true); });
    testiGo(0);
    testiRestart();
  }

  /* ---------- Contoare animate ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target;
        var target = parseInt(el.getAttribute("data-count"), 10);
        var suffix = el.getAttribute("data-suffix") || "";
        var t0 = null;
        var DUR = 1600;
        function tick(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / DUR, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Filtre portofoliu ---------- */
  var filterBtns = document.querySelectorAll(".folio-filters button");
  var folioItems = document.querySelectorAll(".folio-item");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      folioItems.forEach(function (item) {
        var show = f === "toate" || item.getAttribute("data-cat") === f;
        item.style.display = show ? "" : "none";
      });
    });
  });

  /* ---------- Formular contact: consimțământ obligatoriu ---------- */
  var form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      var consent = form.querySelector("#gdpr-consent");
      if (consent && !consent.checked) {
        e.preventDefault();
        consent.focus();
        alert("Te rugăm să bifezi acordul pentru prelucrarea datelor personale înainte de a trimite mesajul.");
      }
    });
  }

  /* ---------- Cookie banner ---------- */
  var banner = document.querySelector(".cookie-banner");
  if (banner) {
    var KEY = "sarami-cookie-consent";
    try {
      if (!localStorage.getItem(KEY)) banner.classList.add("show");
    } catch (err) { /* storage indisponibil — nu afișăm repetat */ }
    banner.querySelectorAll("[data-consent]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        try { localStorage.setItem(KEY, btn.getAttribute("data-consent")); } catch (err) {}
        banner.classList.remove("show");
      });
    });
  }

  /* ---------- An curent în footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
