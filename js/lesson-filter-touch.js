// Mobile touch/scroll guard for Lesson filters and the hamburger menu.
// Prevents pull-to-refresh at the top and prevents the page underneath
// the mobile menu from scrolling. Scrollable menu/filter content remains
// independently scrollable.
(function () {
    const MOBILE_QUERY = '(max-width:520px)';

    function initTouchGuards() {
        const lessonField = document.querySelector('#lessonBtn')?.closest('.filter-field');
        const mobileMenu = document.getElementById('mobileMenuArea');
        const body = document.body;
        if (!body) return;

        let startY = 0;
        let startX = 0;
        let lockedScrollY = 0;
        let bodyWasLocked = false;

        const isMobile = () => window.matchMedia(MOBILE_QUERY).matches;
        const menuIsOpen = () => isMobile() && body.classList.contains('mobile-menu-open');

        function lockPageScroll() {
            if (!isMobile() || bodyWasLocked) return;
            lockedScrollY = window.scrollY || window.pageYOffset || 0;
            bodyWasLocked = true;
            body.style.position = 'fixed';
            body.style.top = `-${lockedScrollY}px`;
            body.style.left = '0';
            body.style.right = '0';
            body.style.width = '100%';
            body.style.overflow = 'hidden';
            body.style.touchAction = 'none';
        }

        function unlockPageScroll() {
            if (!bodyWasLocked) return;
            body.style.position = '';
            body.style.top = '';
            body.style.left = '';
            body.style.right = '';
            body.style.width = '';
            body.style.overflow = '';
            body.style.touchAction = '';
            bodyWasLocked = false;
            window.scrollTo(0, lockedScrollY);
        }

        function syncMenuLock() {
            if (menuIsOpen()) {
                lockPageScroll();
                if (mobileMenu) {
                    mobileMenu.style.touchAction = 'pan-y';
                    mobileMenu.style.overscrollBehavior = 'contain';
                    mobileMenu.style.webkitOverflowScrolling = 'touch';
                    mobileMenu.style.maxHeight = 'calc(100dvh - 60px)';
                    mobileMenu.style.overflowY = 'auto';
                }
            } else {
                unlockPageScroll();
                if (mobileMenu) {
                    mobileMenu.style.touchAction = '';
                    mobileMenu.style.overscrollBehavior = '';
                    mobileMenu.style.webkitOverflowScrolling = '';
                    mobileMenu.style.maxHeight = '';
                    mobileMenu.style.overflowY = '';
                }
            }
        }

        function getScrollableAncestor(target) {
            let el = target instanceof Element ? target : null;
            while (el && el !== document.body) {
                const style = getComputedStyle(el);
                const scrollableY = /(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight;
                if (scrollableY) return el;
                el = el.parentElement;
            }
            return null;
        }

        function canScrollableElementConsume(el, deltaY) {
            if (!el) return false;
            const max = el.scrollHeight - el.clientHeight;
            if (max <= 0) return false;

            // Finger moving up (deltaY < 0) scrolls content downward.
            if (deltaY < 0) return el.scrollTop < max - 1;
            // Finger moving down (deltaY > 0) scrolls content upward.
            if (deltaY > 0) return el.scrollTop > 0;
            return false;
        }

        document.addEventListener('touchstart', function (event) {
            if (!event.touches || event.touches.length !== 1) return;
            startY = event.touches[0].clientY;
            startX = event.touches[0].clientX;
            syncMenuLock();
        }, { passive: true, capture: true });

        document.addEventListener('touchmove', function (event) {
            if (!isMobile() || !event.touches || event.touches.length !== 1) return;

            const currentY = event.touches[0].clientY;
            const currentX = event.touches[0].clientX;
            const deltaY = currentY - startY;
            const deltaX = currentX - startX;
            if (Math.abs(deltaY) <= Math.abs(deltaX)) return;

            // Hamburger menu is open: never let the document underneath move.
            // Allow only a scrollable element inside the menu to consume the gesture.
            if (menuIsOpen()) {
                const target = event.target;
                const insideMenu = mobileMenu && mobileMenu.contains(target);
                if (!insideMenu) {
                    event.preventDefault();
                    return;
                }

                const scrollable = getScrollableAncestor(target);
                if (!canScrollableElementConsume(scrollable, deltaY)) {
                    event.preventDefault();
                }
                return;
            }

            // Lesson filter at page top: stop downward pull-to-refresh.
            if (lessonField && lessonField.contains(event.target)) {
                const lessonPanelOpen = document.getElementById('lessonPanel')?.classList.contains('open');
                if ((window.scrollY || window.pageYOffset || 0) <= 0 && deltaY > 8 && !lessonPanelOpen) {
                    event.preventDefault();
                }
            }
        }, { passive: false, capture: true });

        // Watch the existing menu class; header.html owns opening/closing it.
        const menuObserver = new MutationObserver(syncMenuLock);
        menuObserver.observe(body, { attributes: true, attributeFilter: ['class'] });

        addEventListener('resize', function () {
            if (!isMobile()) unlockPageScroll();
            else syncMenuLock();
        }, { passive: true });

        syncMenuLock();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTouchGuards);
    } else {
        initTouchGuards();
    }
})();
