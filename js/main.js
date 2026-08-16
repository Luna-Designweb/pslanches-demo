/* =====================================================
   PS LANCHES FARRULA — JavaScript
   ===================================================== */

(function () {
    'use strict';

    /* ========== DOM READY ========== */
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initHeader();
        initMobileMenu();
        initSmoothScroll();
        initCardapioTabs();
        initFaqAccordion();
        initScrollReveal();
        initActiveNavOnScroll();
    }

    /* ========== HEADER SCROLL ========== */
    function initHeader() {
        var header = document.getElementById('header');
        if (!header) return;

        var scrollThreshold = 50;

        function onScroll() {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ========== MOBILE MENU ========== */
    function initMobileMenu() {
        var hamburger = document.getElementById('hamburgerBtn');
        var drawer = document.getElementById('mobileDrawer');
        var overlay = document.getElementById('mobileOverlay');
        var closeBtn = document.getElementById('drawerClose');
        var drawerLinks = drawer ? drawer.querySelectorAll('.mobile-drawer__link') : [];

        if (!hamburger || !drawer || !overlay) return;

        function getFocusableElements() {
            return drawer.querySelectorAll(
                'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
            );
        }

        function openMenu() {
            hamburger.classList.add('active');
            drawer.classList.add('active');
            overlay.classList.add('active');
            drawer.setAttribute('aria-hidden', 'false');
            hamburger.setAttribute('aria-expanded', 'true');
            document.body.classList.add('no-scroll');

            // Focus the close button when drawer opens
            if (closeBtn) {
                setTimeout(function () { closeBtn.focus(); }, 100);
            }
        }

        function closeMenu() {
            hamburger.classList.remove('active');
            drawer.classList.remove('active');
            overlay.classList.remove('active');
            drawer.setAttribute('aria-hidden', 'true');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');

            // Return focus to hamburger
            hamburger.focus();
        }

        hamburger.addEventListener('click', function () {
            if (drawer.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        overlay.addEventListener('click', closeMenu);
        if (closeBtn) closeBtn.addEventListener('click', closeMenu);

        // Close on link click
        drawerLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                closeMenu();
            });
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && drawer.classList.contains('active')) {
                closeMenu();
            }

            // Focus trap: Tab cycles inside the drawer
            if (e.key === 'Tab' && drawer.classList.contains('active')) {
                var focusable = getFocusableElements();
                if (focusable.length === 0) return;

                var firstEl = focusable[0];
                var lastEl = focusable[focusable.length - 1];

                if (e.shiftKey) {
                    // Shift+Tab: if on first element, wrap to last
                    if (document.activeElement === firstEl) {
                        e.preventDefault();
                        lastEl.focus();
                    }
                } else {
                    // Tab: if on last element, wrap to first
                    if (document.activeElement === lastEl) {
                        e.preventDefault();
                        firstEl.focus();
                    }
                }
            }
        });
    }

    /* ========== SMOOTH SCROLL ========== */
    function initSmoothScroll() {
        var links = document.querySelectorAll('a[href^="#"]');

        links.forEach(function (link) {
            link.addEventListener('click', function (e) {
                var href = this.getAttribute('href');
                if (href === '#' || href === '#inicio') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                var target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    var headerHeight = window.innerWidth >= 1024 ? 70 : 60;
                    var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /* ========== CARDÁPIO TABS ========== */
    function initCardapioTabs() {
        var tabs = document.querySelectorAll('.cardapio__tab');
        var cards = document.querySelectorAll('.card--menu');
        var grid = document.getElementById('cardapioGrid');

        if (!tabs.length || !cards.length) return;

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                var category = this.getAttribute('data-category');

                // Update active tab
                tabs.forEach(function (t) {
                    t.classList.remove('cardapio__tab--active');
                    t.setAttribute('aria-selected', 'false');
                });
                this.classList.add('cardapio__tab--active');
                this.setAttribute('aria-selected', 'true');

                // Update panel aria-labelledby
                if (grid) {
                    grid.setAttribute('aria-labelledby', this.getAttribute('id'));
                }

                // Filter cards
                var delay = 0;
                cards.forEach(function (card) {
                    var cardCategory = card.getAttribute('data-category');
                    if (cardCategory === category) {
                        card.style.display = '';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';

                        setTimeout(function () {
                            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, delay);

                        delay += 80;
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    /* ========== FAQ ACCORDION ========== */
    function initFaqAccordion() {
        var items = document.querySelectorAll('.faq__item');

        items.forEach(function (item) {
            var question = item.querySelector('.faq__question');
            var answer = item.querySelector('.faq__answer');

            if (!question || !answer) return;

            question.addEventListener('click', function () {
                var isOpen = item.classList.contains('active');

                // Close all other items
                items.forEach(function (otherItem) {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        var otherQuestion = otherItem.querySelector('.faq__question');
                        if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current
                if (isOpen) {
                    item.classList.remove('active');
                    question.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    /* ========== SCROLL REVEAL ========== */
    function initScrollReveal() {
        var reveals = document.querySelectorAll('.reveal');
        if (!reveals.length) return;

        // Check for reduced motion preference
        var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            reveals.forEach(function (el) {
                el.classList.add('visible');
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        reveals.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ========== ACTIVE NAV ON SCROLL ========== */
    function initActiveNavOnScroll() {
        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.header__link');
        var mobileLinks = document.querySelectorAll('.mobile-drawer__link');

        if (!sections.length) return;

        function updateActiveLink() {
            var scrollPos = window.scrollY + 120;

            sections.forEach(function (section) {
                var sectionTop = section.offsetTop;
                var sectionHeight = section.offsetHeight;
                var sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(function (link) {
                        link.classList.remove('header__link--active');
                        if (link.getAttribute('data-section') === sectionId) {
                            link.classList.add('header__link--active');
                        }
                    });

                    mobileLinks.forEach(function (link) {
                        link.classList.remove('mobile-drawer__link--active');
                        if (link.getAttribute('data-section') === sectionId) {
                            link.classList.add('mobile-drawer__link--active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', updateActiveLink, { passive: true });
        updateActiveLink();
    }

})();
