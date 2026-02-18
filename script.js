// =========================
// Функция открытия/закрытия определений
// =========================
function toggleContent(btn) {
    const content = btn.nextElementSibling;
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
}

// =========================
// Функция открытия/закрытия формул
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
// Дополнительно: анимация свечения кнопок
// =========================
function addGlowEffect() {
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
// Инициализация при загрузке страницы
// =========================
window.addEventListener('DOMContentLoaded', () => {
    // Добавляем эффект свечения на кнопки
    addGlowEffect();
});
