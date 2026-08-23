// Lesson shuffle guard
// Marks only genuine user changes as permission to create a NEW random order.
// Programmatic changes used by localStorage/Cloud Sync restoration must never
// trigger a new shuffle.
(function () {
    function markExplicitShuffle() {
        if (typeof lessonsData !== "undefined") {
            window.lessonForceShuffle = true;
        }
    }

    function init() {
        document.addEventListener("change", function (event) {
            if (!event.isTrusted) return;

            const target = event.target;
            if (!target) return;

            // User explicitly changed Normal <-> Shuffle.
            if (target.id === "mode") {
                if (target.value === "shuffle") markExplicitShuffle();
                return;
            }

            // User changed the card set while remaining in Shuffle mode.
            // Treat that as a deliberate request for a fresh order for the
            // newly selected card set.
            if (
                target.closest("#lessonPanel") ||
                target.closest("#typePanel")
            ) {
                const mode = document.getElementById("mode");
                if (mode?.value === "shuffle") markExplicitShuffle();
            }
        }, true);

        document.addEventListener("click", function (event) {
            const button = event.target.closest("#shuffleBtn");
            if (button && event.isTrusted) markExplicitShuffle();
        }, true);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
