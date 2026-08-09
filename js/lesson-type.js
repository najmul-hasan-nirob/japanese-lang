// Lesson type filter button
// Keeps the Vocabulary / Grammar panel usable independently of lesson-filter.js.
document.addEventListener("DOMContentLoaded", () => {
    const typeBtn = document.getElementById("typeBtn");
    const typePanel = document.getElementById("typePanel");
    if (!typeBtn || !typePanel) return;

    function updateTypeLabel() {
        const boxes = Array.from(typePanel.querySelectorAll("input[type=checkbox]"));
        const selected = boxes.filter(box => box.checked).map(box => box.value);

        if (selected.length === boxes.length) {
            typeBtn.textContent = "All types";
        } else if (selected.length === 0) {
            typeBtn.textContent = "None";
        } else {
            typeBtn.textContent = selected.map(value =>
                value.charAt(0).toUpperCase() + value.slice(1)
            ).join(" + ");
        }
    }

    typeBtn.addEventListener("click", event => {
        event.stopPropagation();
        const open = typePanel.classList.contains("open");
        document.querySelectorAll(".multiselect-panel.open").forEach(panel => {
            panel.classList.remove("open");
        });
        typePanel.classList.toggle("open", !open);
        typeBtn.setAttribute("aria-expanded", String(!open));
    });

    typePanel.addEventListener("change", updateTypeLabel);

    document.addEventListener("click", event => {
        if (!typePanel.contains(event.target) && event.target !== typeBtn) {
            typePanel.classList.remove("open");
            typeBtn.setAttribute("aria-expanded", "false");
        }
    });

    updateTypeLabel();
});
