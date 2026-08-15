// Prevent Android mobile pull-to-refresh when the user starts a
// downward gesture on the Lesson filter area at the top of the page.
// Normal page scrolling remains enabled.
(function () {
    function initLessonFilterTouchGuard() {
        const lessonField = document.querySelector('#lessonBtn')?.closest('.filter-field');
        if (!lessonField) return;

        let startY = 0;
        let startX = 0;

        lessonField.addEventListener('touchstart', function (event) {
            if (!event.touches || event.touches.length !== 1) return;
            startY = event.touches[0].clientY;
            startX = event.touches[0].clientX;
        }, { passive: true });

        lessonField.addEventListener('touchmove', function (event) {
            if (!event.touches || event.touches.length !== 1) return;
            if (window.scrollY > 0) return;

            const currentY = event.touches[0].clientY;
            const currentX = event.touches[0].clientX;
            const deltaY = currentY - startY;
            const deltaX = currentX - startX;

            if (deltaY > 8 && Math.abs(deltaY) > Math.abs(deltaX)) {
                event.preventDefault();
            }
        }, { passive: false });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLessonFilterTouchGuard);
    } else {
        initLessonFilterTouchGuard();
    }
})();
