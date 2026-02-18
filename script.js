// =========================
// Функция раскрытия/скрытия определений
// =========================
function toggleContent(button) {
    const content = button.nextElementSibling;
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
}

// =========================
// Функция раскрытия/скрытия формул
// =========================
function toggleFormula(el) {
    const formula = el.querySelector('.formula-content');
    if (formula.style.display === "block") {
        formula.style.display = "none";
    } else {
        formula.style.display = "block";
    }
}

// =========================
// Дополнительный неоновый эффект для кнопок и формул
// =========================
function addNeonHoverEffect() {
    const buttons = document.querySelectorAll('.section button, .formula');
    buttons.forEach(btn => {
        btn.addEventListener('mouseover', () => {
            btn.style.boxShadow = "0 0 15px #00ffff, 0 0 30px #00ffff";
        });
        btn.addEventListener('mouseout', () => {
            btn.style.boxShadow = "0 0 5px #00ffff";
        });
    });
}

// =========================
// Инициализация после загрузки страницы
// =========================
window.addEventListener('DOMContentLoaded', () => {
    addNeonHoverEffect();
});
