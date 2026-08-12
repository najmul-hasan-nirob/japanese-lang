// Shared Shuffle button behavior for Numbers and Lessons.
// Clicking Shuffle automatically switches Order to Shuffle and reshuffles.
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
                // Selecting Shuffle automatically enables shuffle mode.
                // Dispatching change also re-renders the current filtered set.
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
