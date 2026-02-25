// ===== НЕОНО-ФИЗИЧЕСКИЙ JS =====
// Эффекты: частицы, симуляция поля, интерактивные формулы, глюки, вольтметры

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // =========================================
    // 1. ИНИЦИАЛИЗАЦИЯ И НАСТРОЙКИ
    // =========================================
    const body = document.body;
    const container = document.querySelector('.container');
    
    // Добавляем холст для частиц, если его нет
    if (!document.getElementById('particle-canvas')) {
        const canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '0';
        document.body.appendChild(canvas);
    }

    // =========================================
    // 2. СИСТЕМА ЧАСТИЦ (ЭЛЕКТРОНЫ/ИОНЫ)
    // =========================================
    class ParticleSystem {
        constructor() {
            this.canvas = document.getElementById('particle-canvas');
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.mouseX = 0;
            this.mouseY = 0;
            this.isMouseMoving = false;
            
            this.init();
        }

        init() {
            this.resize();
            this.createParticles(50);
            this.animate();
            
            window.addEventListener('resize', () => this.resize());
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                this.isMouseMoving = true;
                setTimeout(() => { this.isMouseMoving = false; }, 100);
            });
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        createParticles(count) {
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 3 + 1,
                    charge: Math.random() > 0.5 ? 1 : -1, // положительный или отрицательный
                    life: 1
                });
            }
        }

        updateParticles() {
            for (let p of this.particles) {
                // Движение
                p.x += p.vx;
                p.y += p.vy;

                // Взаимодействие с мышью (электрическое отталкивание/притяжение)
                if (this.isMouseMoving) {
                    const dx = this.mouseX - p.x;
                    const dy = this.mouseY - p.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 200) {
                        const force = (200 - dist) / 2000 * p.charge;
                        p.vx -= dx * force * 0.01;
                        p.vy -= dy * force * 0.01;
                    }
                }

                // Границы с отскоком
                if (p.x < 0 || p.x > this.canvas.width) {
                    p.vx *= -0.9;
                    p.x = Math.max(0, Math.min(this.canvas.width, p.x));
                }
                if (p.y < 0 || p.y > this.canvas.height) {
                    p.vy *= -0.9;
                    p.y = Math.max(0, Math.min(this.canvas.height, p.y));
                }

                // Затухание скорости
                p.vx *= 0.99;
                p.vy *= 0.99;
            }
        }

        drawParticles() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            for (let p of this.particles) {
                this.ctx.beginPath();
                
                // Цвет в зависимости от заряда
                if (p.charge > 0) {
                    this.ctx.fillStyle = 'rgba(255, 100, 255, 0.6)'; // розовый (позитрон)
                    this.ctx.shadowColor = '#ff00ff';
                } else {
                    this.ctx.fillStyle = 'rgba(100, 255, 255, 0.6)'; // голубой (электрон)
                    this.ctx.shadowColor = '#00ffff';
                }
                
                this.ctx.shadowBlur = 15;
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();

                // Рисуем силовые линии между близкими частицами
                for (let other of this.particles) {
                    if (p === other) continue;
                    const dx = other.x - p.x;
                    const dy = other.y - p.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist < 150 && p.charge !== other.charge) {
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - dist/150)})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.shadowBlur = 10;
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(other.x, other.y);
                        this.ctx.stroke();
                    }
                }
            }
        }

        animate() {
            this.updateParticles();
            this.drawParticles();
            requestAnimationFrame(() => this.animate());
        }
    }

    // =========================================
    // 3. ИНТЕРАКТИВНЫЕ ФОРМУЛЫ
    // =========================================
    class FormulaInteractor {
        constructor() {
            this.formulas = document.querySelectorAll('.formula');
            this.init();
        }

        init() {
            this.formulas.forEach(formula => {
                // Добавляем кнопку копирования
                const copyBtn = document.createElement('span');
                copyBtn.innerHTML = '📋';
                copyBtn.style.cssText = `
                    position: absolute;
                    right: 10px;
                    top: 10px;
                    cursor: pointer;
                    opacity: 0.3;
                    transition: opacity 0.3s;
                    font-size: 1.2rem;
                `;
                
                formula.style.position = 'relative';
                formula.appendChild(copyBtn);

                // Копирование при клике
                copyBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const text = formula.innerText.replace('📋', '').trim();
                    navigator.clipboard.writeText(text).then(() => {
                        this.showNotification('✨ Формула скопирована!', formula);
                    });
                });

                // Показываем кнопку при наведении
                formula.addEventListener('mouseenter', () => {
                    copyBtn.style.opacity = '1';
                });
                
                formula.addEventListener('mouseleave', () => {
                    copyBtn.style.opacity = '0.3';
                });
            });
        }

        showNotification(message, element) {
            const notif = document.createElement('div');
            notif.textContent = message;
            notif.style.cssText = `
                position: absolute;
                background: linear-gradient(45deg, #00ffff, #ff00ff);
                color: #0a0f1f;
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: bold;
                top: -30px;
                left: 50%;
                transform: translateX(-50%);
                box-shadow: 0 0 20px cyan;
                animation: floatUp 1s ease-out forwards;
                pointer-events: none;
                z-index: 1000;
            `;
            element.style.position = 'relative';
            element.appendChild(notif);
            
            setTimeout(() => notif.remove(), 1000);
        }
    }

    // =========================================
    // 4. ВИРТУАЛЬНЫЙ ВОЛЬТМЕТР
    // =========================================
    class VoltageMeter {
        constructor() {
            this.cards = document.querySelectorAll('.card');
            this.init();
        }

        init() {
            this.cards.forEach(card => {
                const meter = document.createElement('div');
                meter.className = 'voltage-meter';
                meter.style.cssText = `
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(0, 0, 0, 0.7);
                    border: 1px solid #00ffff;
                    border-radius: 10px;
                    padding: 5px 10px;
                    font-family: monospace;
                    font-size: 0.9rem;
                    color: #00ffff;
                    box-shadow: 0 0 10px cyan;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    opacity: 0;
                    transition: opacity 0.3s;
                    pointer-events: none;
                    z-index: 10;
                `;
                
                // Случайное "напряжение" для каждой карточки
                const voltage = (Math.random() * 12 + 5).toFixed(1);
                meter.innerHTML = `
                    <span>⚡</span>
                    <span>${voltage} V</span>
                `;
                
                card.style.position = 'relative';
                card.appendChild(meter);

                // Показываем при наведении
                card.addEventListener('mouseenter', () => {
                    meter.style.opacity = '1';
                });
                
                card.addEventListener('mouseleave', () => {
                    meter.style.opacity = '0';
                });

                // Мерцание напряжения
                setInterval(() => {
                    if (Math.random() > 0.7) {
                        const newVoltage = (Math.random() * 2 - 1) * 0.5;
                        const current = parseFloat(meter.children[1].textContent);
                        const updated = (current + newVoltage).toFixed(1);
                        meter.children[1].textContent = `${updated} V`;
                    }
                }, 2000);
            });
        }
    }

    // =========================================
    // 5. ГЛЮК-ЭФФЕКТЫ
    // =========================================
    class GlitchEffect {
        constructor() {
            this.headings = document.querySelectorAll('h1, h2, h3');
            this.init();
        }

        init() {
            this.headings.forEach(heading => {
                heading.addEventListener('mouseenter', () => {
                    this.startGlitch(heading);
                });
                
                heading.addEventListener('mouseleave', () => {
                    this.stopGlitch(heading);
                });
            });
        }

        startGlitch(element) {
            const originalText = element.innerText;
            const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
            let glitchInterval;
            
            glitchInterval = setInterval(() => {
                if (Math.random() > 0.9) {
                    let glitchedText = '';
                    for (let i = 0; i < originalText.length; i++) {
                        if (Math.random() > 0.9) {
                            glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                        } else {
                            glitchedText += originalText[i];
                        }
                    }
                    element.innerText = glitchedText;
                    
                    setTimeout(() => {
                        element.innerText = originalText;
                    }, 100);
                }
            }, 200);
            
            element.glitchInterval = glitchInterval;
        }

        stopGlitch(element) {
            if (element.glitchInterval) {
                clearInterval(element.glitchInterval);
                // Восстанавливаем текст (на случай если он остался глючным)
                const originalText = element.innerText.replace(/[!<>-_\\/\[\]{}—=+*^?#________]/g, '');
                if (originalText.length > 0) {
                    element.innerText = originalText;
                }
            }
        }
    }

    // =========================================
    // 6. КАЛЬКУЛЯТОР ЗАКОНА ОМА
    // =========================================
    class OhmCalculator {
        constructor() {
            this.createCalculator();
        }

        createCalculator() {
            // Ищем блок с формулами или создаем новый
            const formulasGrid = document.querySelector('.grid[style*="grid-template-columns: repeat(3,1fr)"]');
            if (!formulasGrid) return;

            const calcDiv = document.createElement('div');
            calcDiv.innerHTML = `
                <div style="grid-column: span 3; background: rgba(0,30,60,0.9); border-radius: 2rem; padding: 2rem; margin-top: 1rem;">
                    <h3 style="color: #00ffff; text-align: center; margin-bottom: 1.5rem;">⚡ КАЛЬКУЛЯТОР ЗАКОНА ОМА ⚡</h3>
                    <div style="display: flex; gap: 2rem; flex-wrap: wrap; justify-content: center;">
                        <div style="flex: 1; min-width: 200px;">
                            <label style="color: #fff; display: block; margin-bottom: 0.5rem;">Напряжение (U, В)</label>
                            <input type="number" id="voltage" value="12" style="width: 100%; padding: 0.8rem; background: #0a1a2a; border: 2px solid #00ffff; border-radius: 1rem; color: #fff; font-size: 1.2rem;">
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <label style="color: #fff; display: block; margin-bottom: 0.5rem;">Сопротивление (R, Ом)</label>
                            <input type="number" id="resistance" value="100" style="width: 100%; padding: 0.8rem; background: #0a1a2a; border: 2px solid #ff00ff; border-radius: 1rem; color: #fff; font-size: 1.2rem;">
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <label style="color: #fff; display: block; margin-bottom: 0.5rem;">Ток (I, А)</label>
                            <input type="number" id="current" value="0.12" style="width: 100%; padding: 0.8rem; background: #0a1a2a; border: 2px solid #ffff00; border-radius: 1rem; color: #fff; font-size: 1.2rem;">
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 1.5rem;">
                        <p style="color: #00ffff; font-size: 1.2rem;" id="ohm-result">U = I × R → 12 = 0.12 × 100</p>
                    </div>
                </div>
            `;
            
            formulasGrid.appendChild(calcDiv);

            // Добавляем обработчики
            const voltage = document.getElementById('voltage');
            const resistance = document.getElementById('resistance');
            const current = document.getElementById('current');
            const result = document.getElementById('ohm-result');

            function updateFromVoltage() {
                const u = parseFloat(voltage.value) || 0;
                const r = parseFloat(resistance.value) || 1;
                current.value = (u / r).toFixed(3);
                updateResult();
            }

            function updateFromCurrent() {
                const i = parseFloat(current.value) || 0;
                const r = parseFloat(resistance.value) || 1;
                voltage.value = (i * r).toFixed(1);
                updateResult();
            }

            function updateFromResistance() {
                const u = parseFloat(voltage.value) || 0;
                const i = parseFloat(current.value) || 0.001;
                if (i !== 0) {
                    resistance.value = (u / i).toFixed(1);
                }
                updateResult();
            }

            function updateResult() {
                const u = parseFloat(voltage.value) || 0;
                const r = parseFloat(resistance.value) || 0;
                const i = parseFloat(current.value) || 0;
                result.innerHTML = `U = I × R → ${u.toFixed(1)} = ${i.toFixed(3)} × ${r.toFixed(1)}`;
                
                // Добавляем неоновую вспышку
                result.style.animation = 'none';
                result.offsetHeight;
                result.style.animation = 'spark 0.5s';
            }

            voltage.addEventListener('input', updateFromVoltage);
            current.addEventListener('input', updateFromCurrent);
            resistance.addEventListener('input', updateFromResistance);
        }
    }

    // =========================================
    // 7. ЭФФЕКТ "ЭЛЕКТРИЧЕСКОГО РАЗРЯДА"
    // =========================================
    class SparkEffect {
        constructor() {
            this.cards = document.querySelectorAll('.card');
            this.init();
        }

        init() {
            this.cards.forEach(card => {
                card.addEventListener('click', (e) => {
                    this.createSpark(e.clientX, e.clientY);
                });
            });
        }

        createSpark(x, y) {
            const spark = document.createElement('div');
            spark.style.cssText = `
                position: fixed;
                left: ${x - 100}px;
                top: ${y - 100}px;
                width: 200px;
                height: 200px;
                background: radial-gradient(circle, rgba(0,255,255,0.8) 0%, rgba(255,0,255,0.8) 50%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                filter: blur(10px);
                animation: sparkFade 0.5s ease-out forwards;
            `;
            
            document.body.appendChild(spark);
            
            setTimeout(() => spark.remove(), 500);
        }
    }

    // =========================================
    // 8. ЗАПУСК ВСЕХ МОДУЛЕЙ
    // =========================================
    try {
        // Запускаем частицы
        const particles = new ParticleSystem();
        
        // Интерактивные формулы
        const formulas = new FormulaInteractor();
        
        // Вольтметры
        const meters = new VoltageMeter();
        
        // Глюк-эффекты
        const glitch = new GlitchEffect();
        
        // Калькулятор
        const calculator = new OhmCalculator();
        
        // Искры
        const sparks = new SparkEffect();

        // Добавляем ключевые кадры для анимаций
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUp {
                0% { transform: translateX(-50%) translateY(0); opacity: 1; }
                100% { transform: translateX(-50%) translateY(-30px); opacity: 0; }
            }
            
            @keyframes sparkFade {
                0% { transform: scale(0.5); opacity: 1; }
                100% { transform: scale(2); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        console.log('⚡ Неоно-физический JS активирован! ⚡');
    } catch (error) {
        console.warn('⚠️ Ошибка инициализации:', error);
    }
});
