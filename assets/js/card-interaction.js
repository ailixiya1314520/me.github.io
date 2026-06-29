(function() {
    'use strict';

    const TILT_AMOUNT = 8;
    const SCALE_HOVER = 1.05;
    const SCALE_NORMAL = 1;

    function initCardInteraction() {
        const articles = document.querySelectorAll('.tiles article');

        articles.forEach(article => {
            const cardContainer = article.querySelector('.card-container');
            if (!cardContainer) return;

            article.addEventListener('mousemove', handleMouseMove);
            article.addEventListener('mouseleave', handleMouseLeave);
        });

        function handleMouseMove(e) {
            const article = e.currentTarget;
            const cardContainer = article.querySelector('.card-container');
            if (!cardContainer) return;

            const rect = article.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const deltaX = (mouseX - centerX) / (rect.width / 2);
            const deltaY = (mouseY - centerY) / (rect.height / 2);

            const rotateX = -deltaY * TILT_AMOUNT;
            const rotateY = deltaX * TILT_AMOUNT;

            cardContainer.classList.add('tilt');
            cardContainer.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${SCALE_HOVER})`;
        }

        function handleMouseLeave(e) {
            const article = e.currentTarget;
            const cardContainer = article.querySelector('.card-container');
            if (!cardContainer) return;

            cardContainer.classList.remove('tilt');
            cardContainer.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(${SCALE_NORMAL})`;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCardInteraction);
    } else {
        initCardInteraction();
    }
})();