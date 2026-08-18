/* Shared shuffle transition for every page with a #shuffleBtn and .grid. */
(function () {
    const DURATION = 460;

    document.addEventListener('click', function (event) {
        const button = event.target.closest('#shuffleBtn');
        if (!button) return;

        const grid = document.querySelector('.grid');
        if (!grid) return;

        grid.classList.remove('shuffle-transition');
        void grid.offsetWidth;
        grid.classList.add('shuffle-transition');

        window.setTimeout(function () {
            grid.classList.remove('shuffle-transition');
        }, DURATION);
    }, true);
})();