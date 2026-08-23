// Shared Shuffle button behavior for Numbers and Lessons.
// Clicking Shuffle automatically switches Order to Shuffle and creates a new order.
(function(){
    function initShuffleControls(){
        const mode = document.getElementById('mode');
        const buttons = Array.from(document.querySelectorAll('.shuffle-btn'));

        // Kana already has its own Shuffle implementation in home.js.
        if (!mode || buttons.length === 0 ||
            (typeof numbersData === 'undefined' && typeof lessonsData === 'undefined')) {
            return;
        }

        buttons.forEach(button => {
            if (button.dataset.shuffleControlBound === 'true') return;
            button.dataset.shuffleControlBound = 'true';

            button.addEventListener('click', function(){
                // Tell the shared Lesson shuffle() function that this is an
                // explicit request for a NEW random order. A normal Order ->
                // Shuffle transition/reload should instead restore the saved
                // order from localStorage/cloud sync.
                if (typeof lessonsData !== 'undefined') {
                    window.lessonForceShuffle = true;
                }

                if (mode.value !== 'shuffle') {
                    mode.value = 'shuffle';
                }

                mode.dispatchEvent(new Event('change', { bubbles: true }));
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initShuffleControls);
    } else {
        initShuffleControls();
    }
})();
