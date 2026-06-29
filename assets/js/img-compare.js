(function() {
    'use strict';

    function initImageCompare() {
        const containers = document.querySelectorAll('.img-compare-container');

        containers.forEach(container => {
            const wrapper = container.querySelector('.img-compare-wrapper');
            const overlay = container.querySelector('.img-compare-overlay');
            const handle = container.querySelector('.img-compare-handle');

            if (!wrapper || !overlay || !handle) return;

            let isDragging = false;

            function updatePosition(clientX) {
                const rect = wrapper.getBoundingClientRect();
                const x = clientX - rect.left;
                const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

                overlay.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
                handle.style.left = `${percentage}%`;
            }

            function handleStart(e) {
                isDragging = true;
                container.classList.add('is-dragging');
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                updatePosition(clientX);
            }

            function handleMove(e) {
                if (!isDragging) return;
                e.preventDefault();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                updatePosition(clientX);
            }

            function handleEnd() {
                isDragging = false;
                container.classList.remove('is-dragging');
            }

            handle.addEventListener('mousedown', handleStart);
            handle.addEventListener('touchstart', handleStart, { passive: false });

            window.addEventListener('mousemove', handleMove);
            window.addEventListener('touchmove', handleMove, { passive: false });

            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchend', handleEnd);

            wrapper.addEventListener('click', (e) => {
                if (!isDragging) {
                    const clientX = e.clientX;
                    updatePosition(clientX);
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initImageCompare);
    } else {
        initImageCompare();
    }
})();