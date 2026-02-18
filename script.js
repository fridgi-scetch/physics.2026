// =========================
// Переключение разделов
// =========================
function showSection(id) {
    // Скрываем все разделы
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.style.display = 'none');

    // Показываем выбранный раздел
    const activeSection = document.getElementById(id);
    if (activeSection) {
        activeSection.style.display = 'block';
    }
}

// =========================
// Пример анимации движущихся зарядов (добавление новых шаров)
// =========================
function addMovingCharges(count) {
    const container = document.querySelector('#animations');
    for (let i = 0; i < count; i++) {
        const ball = document.createElement('div');
        ball.className = 'moving-ball';
        // Случайная задержка анимации для каждого шара
        ball.style.animationDelay = (Math.random() * 4) + 's';
        container.appendChild(ball);
    }
}

// =========================
// Пример интерактивной формулы
// =========================
function insertFormula(containerId, formulaText) {
    const container = document.getElementById(containerId);
    const formulaDiv = document.createElement('div');
    formulaDiv.className = 'formula';
    formulaDiv.textContent = formulaText;
    container.appendChild(formulaDiv);
}

// =========================
// Инициализация при загрузке страницы
// =========================
window.addEventListener('DOMContentLoaded', () => {
    // Показываем раздел "Термины" по умолчанию
    showSection('terms');

    // Добавляем 3 движущихся заряда в анимацию
    addMovingCharges(3);

    // Пример добавления дополнительной формулы динамически
    insertFormula('formulas', 'Сила Лоренца: F = q(E + v × B)');
});
