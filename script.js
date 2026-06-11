/* ============================================================
   FITGYM — interactions
   ============================================================ */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    // ---- icons ----
    if (window.lucide) lucide.createIcons();

    // ---- nav shrink on scroll ----
    var nav = document.getElementById("nav");
    function onScroll() {
      if (window.scrollY > 24) nav.classList.add("shrink");
      else nav.classList.remove("shrink");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // ---- offer bar dismiss ----
    var obClose = document.getElementById("obClose");
    if (obClose) {
      obClose.addEventListener("click", function () {
        document.body.classList.add("ob-hidden");
      });
    }

    // ---- mobile menu ----
    var menu    = document.getElementById("mobileMenu");
    var overlay = document.getElementById("mmOverlay");
    function openMenu()  { menu.classList.add("open");    overlay.classList.add("open"); }
    function closeMenu() { menu.classList.remove("open"); overlay.classList.remove("open"); }
    var ham     = document.getElementById("hamburger");
    var mmClose = document.getElementById("mmClose");
    if (ham)     ham.addEventListener("click", openMenu);
    if (mmClose) mmClose.addEventListener("click", closeMenu);
    if (overlay) overlay.addEventListener("click", closeMenu);
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });

    // ---- plan benefit accordion ----
    document.querySelectorAll(".plan-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest(".plan");
        var open = card.classList.toggle("show-extra");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        btn.querySelector("span").textContent = open ? "Ver menos" : "Ver todos los beneficios";
        // re-run icons for newly revealed lucide icons
        if (window.lucide) lucide.createIcons();
      });
    });

    // ---- scroll reveal ----
    var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    function revealCheck() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = reveals.length - 1; i >= 0; i--) {
        var top = reveals[i].getBoundingClientRect().top;
        if (top < vh * 0.92) {
          reveals[i].classList.add("in");
          reveals.splice(i, 1);
        }
      }
    }
    window.addEventListener("scroll", revealCheck, { passive: true });
    window.addEventListener("resize", revealCheck);
    revealCheck();
    var revTicks = 0;
    var revTimer = setInterval(function () {
      revealCheck();
      if (++revTicks > 12 || !reveals.length) clearInterval(revTimer);
    }, 250);

    // ---- active nav link ----
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
    var sections = navLinks
      .map(function (a) { return document.querySelector(a.getAttribute("href")); })
      .filter(Boolean);
    function spyCheck() {
      var pos = window.scrollY + (window.innerHeight || 0) * 0.4;
      var current = null;
      sections.forEach(function (s) { if (s.offsetTop <= pos) current = "#" + s.id; });
      navLinks.forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("href") === current);
      });
    }
    window.addEventListener("scroll", spyCheck, { passive: true });
    spyCheck();

    // ---- form validation ----
    var form = document.getElementById("regForm");
    if (form) {
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      function validateField(field) {
        var input = field.querySelector("input, select");
        if (!input) return true;
        var val = (input.value || "").trim();
        var ok = true;
        if (input.type === "email") ok = emailRe.test(val);
        else if (input.type === "tel") ok = val.replace(/\D/g, "").length === 9;
        else ok = val.length > 0;
        field.classList.toggle("invalid", !ok);
        return ok;
      }
      form.querySelectorAll(".field input, .field select").forEach(function (input) {
        input.addEventListener("input", function () {
          var field = input.closest(".field");
          if (field.classList.contains("invalid")) validateField(field);
        });
        input.addEventListener("blur", function () { validateField(input.closest(".field")); });
      });
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var allOk = true;
        form.querySelectorAll(".field").forEach(function (field) {
          if (!validateField(field)) allOk = false;
        });
        if (!allOk) {
          var firstBad = form.querySelector(".field.invalid input, .field.invalid select");
          if (firstBad) firstBad.focus();
          return;
        }
        form.classList.add("submitted");
        document.getElementById("formSuccess").classList.add("show");
      });
    }
  });
})();
