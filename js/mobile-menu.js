// Mobile hamburger menu
(function () {
    function initMobileMenu() {
        const toggle = document.getElementById('mobileMenuToggle');
        const nav = document.querySelector('.nav');
        const toolbar = document.querySelector('.toolbar');
        if (!toggle || !nav) return;

        function setOpen(open) {
            document.body.classList.toggle('mobile-menu-open', open);
            toggle.classList.toggle('open', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        }

        toggle.addEventListener('click', function () {
            setOpen(!document.body.classList.contains('mobile-menu-open'));
        });

        nav.addEventListener('click', function (event) {
            if (window.innerWidth <= 520 && event.target.closest('a')) {
                setOpen(false);
            }
        });

        document.addEventListener('click', function (event) {
            if (window.innerWidth > 520) return;
            if (!event.target.closest('.page-head')) setOpen(false);
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 520) setOpen(false);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }
})();
