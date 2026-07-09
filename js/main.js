(function () {
  'use strict';

  /* ---- Stat counter animation on scroll ---- */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var isDecimal = el.getAttribute('data-decimal') === 'true';
    var duration = 1800;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = start + (target - start) * eased;

      if (isDecimal) {
        el.textContent = prefix + current.toFixed(0) + suffix;
      } else {
        el.textContent = prefix + Math.floor(current) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + (isDecimal ? target : Math.floor(target)) + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    var observed = new WeakSet();

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !observed.has(entry.target)) {
            observed.add(entry.target);
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  /* ---- Sticky header shadow on scroll ---- */
  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 10) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Desktop mega menu ---- */
  function initMegaMenu() {
    var header = document.getElementById('siteHeader');
    var megaMenu = document.getElementById('megaMenu');
    if (!header || !megaMenu) return;

    var megaItems = header.querySelectorAll('.nav-item--mega');
    var panels = megaMenu.querySelectorAll('.mega-menu__content');
    var megaPanel = megaMenu.querySelector('.mega-menu__panel');
    var closeTriggers = megaMenu.querySelectorAll('[data-mega-close]');
    var closeTimer = null;
    var activePanelId = null;

    function getTrigger(item) {
      return item.querySelector('.nav-link--mega');
    }

    function isInMegaZone(target) {
      if (!target) return false;
      return !!(
        target.closest('.nav-item--mega') ||
        target.closest('.mega-menu__panel')
      );
    }

    function setExpanded(item, expanded) {
      var trigger = getTrigger(item);
      if (trigger) {
        trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      }
    }

    function showPanel(panelId) {
      panels.forEach(function (panel) {
        var isActive = panel.getAttribute('data-panel') === panelId;
        panel.hidden = !isActive;
      });
      activePanelId = panelId;
    }

    /* Size panel to content: ~30vh when few items, grow as needed up to max */
    function resizeMegaToContent(panelId) {
      var panel = megaMenu.querySelector('[data-panel="' + panelId + '"]');
      if (!panel || !megaPanel) return;

      /* Briefly remove min-height clamp so content can measure naturally */
      megaPanel.style.minHeight = '0';
      megaMenu.style.height = 'auto';

      requestAnimationFrame(function () {
        var contentHeight = panel.offsetHeight;
        var container = megaPanel.querySelector('.container');
        var styles = window.getComputedStyle(container || megaPanel);
        var padTop = parseFloat(styles.paddingTop) || 0;
        var padBottom = parseFloat(styles.paddingBottom) || 0;
        var needed = contentHeight + padTop + padBottom;

        var minH = window.innerHeight * 0.3;
        var maxH = window.innerHeight * 0.75;
        var target = Math.min(Math.max(needed, minH), maxH);

        megaMenu.style.height = target + 'px';
        megaPanel.style.minHeight = '';
        megaPanel.style.height = '100%';

        /* Scroll if content exceeds max */
        megaPanel.style.overflowY = needed > maxH ? 'auto' : 'hidden';
      });
    }

    function openMega(panelId, item) {
      clearTimeout(closeTimer);
      megaItems.forEach(function (navItem) {
        navItem.classList.toggle('is-active', navItem === item);
        setExpanded(navItem, navItem === item);
      });
      showPanel(panelId);
      megaMenu.classList.add('is-open');
      megaMenu.setAttribute('aria-hidden', 'false');
      header.classList.add('is-mega-open');
      document.body.classList.add('is-mega-open');
      resizeMegaToContent(panelId);
    }

    function closeMega() {
      clearTimeout(closeTimer);
      megaMenu.classList.remove('is-open');
      megaMenu.setAttribute('aria-hidden', 'true');
      header.classList.remove('is-mega-open');
      document.body.classList.remove('is-mega-open');
      megaMenu.style.height = '';
      if (megaPanel) {
        megaPanel.style.minHeight = '';
        megaPanel.style.overflowY = '';
      }
      megaItems.forEach(function (navItem) {
        navItem.classList.remove('is-active');
        setExpanded(navItem, false);
      });
      activePanelId = null;
    }

    function scheduleClose() {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(closeMega, 120);
    }

    function handlePointerLeave(target) {
      if (!megaMenu.classList.contains('is-open')) return;
      if (!isInMegaZone(target)) {
        scheduleClose();
      }
    }

    megaItems.forEach(function (item) {
      var panelId = item.getAttribute('data-mega');
      var trigger = getTrigger(item);

      item.addEventListener('mouseenter', function () {
        openMega(panelId, item);
      });

      item.addEventListener('mouseleave', function (event) {
        handlePointerLeave(event.relatedTarget);
      });

      item.addEventListener('focusin', function () {
        openMega(panelId, item);
      });

      if (trigger) {
        trigger.addEventListener('click', function (event) {
          event.preventDefault();
          if (activePanelId === panelId && megaMenu.classList.contains('is-open')) {
            closeMega();
          } else {
            openMega(panelId, item);
          }
        });
      }
    });

    if (megaPanel) {
      megaPanel.addEventListener('mouseenter', function () {
        clearTimeout(closeTimer);
      });

      megaPanel.addEventListener('mouseleave', function (event) {
        handlePointerLeave(event.relatedTarget);
      });
    }

    /* Close when cursor moves to logo, phone, donate, or home link */
    header.querySelectorAll(
      '.site-header__logo, .site-header__phone, .site-header__inner .btn-pill, .site-nav .nav-item:not(.nav-item--mega)'
    ).forEach(function (el) {
      el.addEventListener('mouseenter', closeMega);
    });

    /* Close when cursor leaves the entire header (nav + dropdown) */
    header.addEventListener('mouseleave', function (event) {
      if (!header.contains(event.relatedTarget)) {
        closeMega();
      }
    });

    closeTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', closeMega);
      trigger.addEventListener('mouseenter', closeMega);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && megaMenu.classList.contains('is-open')) {
        closeMega();
        var activeItem = header.querySelector('.nav-item--mega.is-active');
        if (activeItem) {
          var activeTrigger = getTrigger(activeItem);
          if (activeTrigger) activeTrigger.focus();
        }
      }
    });

    window.addEventListener('resize', function () {
      if (activePanelId && megaMenu.classList.contains('is-open')) {
        resizeMegaToContent(activePanelId);
      }
    });
  }

  /* ---- Mobile nav accordion ---- */
  function initMobileNavAccordion() {
    var groups = document.querySelectorAll('.mobile-nav__group');
    if (!groups.length) return;

    groups.forEach(function (group) {
      var toggle = group.querySelector('.mobile-nav__toggle');
      var sub = group.querySelector('.mobile-nav__sub');
      if (!toggle || !sub) return;

      toggle.addEventListener('click', function () {
        var isOpen = group.classList.contains('is-open');

        groups.forEach(function (other) {
          if (other !== group) {
            other.classList.remove('is-open');
            var otherToggle = other.querySelector('.mobile-nav__toggle');
            var otherSub = other.querySelector('.mobile-nav__sub');
            if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
            if (otherSub) otherSub.hidden = true;
          }
        });

        group.classList.toggle('is-open', !isOpen);
        toggle.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
        sub.hidden = isOpen;
      });
    });
  }

  /* ---- Close offcanvas on nav link click ---- */
  function initOffcanvasNav() {
    var offcanvasEl = document.getElementById('mobileNav');
    if (!offcanvasEl || typeof bootstrap === 'undefined') return;

    var offcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);

    offcanvasEl.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        offcanvas.hide();
      });
    });
  }

  /* ---- Init ---- */
  document.addEventListener('DOMContentLoaded', function () {
    initCounters();
    initHeaderScroll();
    initMegaMenu();
    initMobileNavAccordion();
    initOffcanvasNav();
  });
})();
