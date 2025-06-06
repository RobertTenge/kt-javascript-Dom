// Утилита для throttling
function throttle(func, ms) {
    let isThrottled = false;
    return function (...args) {
        if (!isThrottled) {
            func.apply(this, args);
            isThrottled = true;
            setTimeout(() => (isThrottled = false), ms);
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    // Главная страница - Слайдер
    if (document.querySelector('.slider')) {
        const slider = document.querySelector('.slider');
        const slides = document.querySelectorAll('.slide');
        let currentSlide = 0;

        const updateSlider = () => {
            slider.style.transform = `translateX(-${currentSlide * 100 / slides.length}%)`;
            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentSlide);
                slide.style.transform = 'translate(0, 0)'; // Сброс параллакса
            });
        };

        // Параллакс-эффект с throttling
        const handleMouseMove = throttle((e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            slides[currentSlide].style.transform = `translate(${x}px, ${y}px)`;
        }, 16);

        document.querySelector('.hero').addEventListener('mousemove', handleMouseMove);

        // Переключение слайдов по клавишам
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                currentSlide = (currentSlide + 1) % slides.length;
                updateSlider();
            } else if (e.key === 'ArrowLeft') {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                updateSlider();
            }
        });
    }

    // О нас - Анимация карточек
    if (document.querySelector('.team-grid')) {
        const cards = document.querySelectorAll('.team-card');

        cards.forEach((card) => {
            // Анимация при наведении мыши с throttling
            const handleCardMouseMove = throttle((e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                card.style.transform = `perspective(500px) rotateY(${x / 20}deg) rotateX(${-y / 20}deg)`;
            }, 16);

            card.addEventListener('mousemove', handleCardMouseMove);

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(500px) rotateY(0deg) rotateX(0deg)';
            });

            card.addEventListener('focus', () => {
                card.style.transform = `perspective(500px) rotateY(10deg)`;
            });

            card.addEventListener('blur', () => {
                card.style.transform = 'perspective(500px) rotateY(0deg)';
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    card.style.transform = `perspective(500px) rotateY(180deg)`;
                    setTimeout(() => {
                        card.style.transform = `perspective(500px) rotateY(0deg)`;
                    }, 500);
                }
            });
        });
    }

    // Контакты - Анимация карты
    if (document.querySelector('.map')) {
        const map = document.querySelector('.map');
        let zoom = 1;

        // Зум при движении мыши с throttling
        const handleMapMouseMove = throttle((e) => {
            const rect = map.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            map.style.transformOrigin = `${x}px ${y}px`;
            map.style.transform = `scale(${zoom})`;
        }, 16);

        map.addEventListener('mousemove', handleMapMouseMove);

        // Зум по клавишам
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                zoom = Math.min(zoom + 0.1, 2.5); // Ограничение максимального зума
                map.style.transform = `scale(${zoom})`;
            } else if (e.key === 'ArrowDown') {
                zoom = Math.max(zoom - 0.1, 0.8); // Ограничение минимального зума
                map.style.transform = `scale(${zoom})`;
            }
        });

        // Доступность для карты
        map.setAttribute('tabindex', '0');
        map.addEventListener('focus', () => {
            map.style.boxShadow = '0 0 10px rgba(255, 98, 0, 0.5)';
        });
        map.addEventListener('blur', () => {
            map.style.boxShadow = 'none';
        });
    }
});
