(function() {
    'use strict';

    function initTechCodeBlocks() {
        const blocks = document.querySelectorAll('.tech-code-block');
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    animateCodeBlock(entry.target);
                }
            });
        }, observerOptions);

        blocks.forEach(block => {
            observer.observe(block);
        });

        document.querySelectorAll('.code-copy').forEach(copyBtn => {
            copyBtn.addEventListener('click', function() {
                const codeBlock = this.closest('.tech-code-block');
                const pre = codeBlock.querySelector('pre');
                const text = pre.innerText;

                navigator.clipboard.writeText(text).then(() => {
                    const originalText = this.innerHTML;
                    this.innerHTML = '✓ Copied';
                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 2000);
                });
            });
        });
    }

    function animateCodeBlock(block) {
        block.classList.add('animated');

        const scanline = block.querySelector('.code-scanline');
        if (scanline) {
            scanline.classList.add('scanning');
        }

        const lines = block.querySelectorAll('.code-line');
        let delay = 100;

        lines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('visible');
            }, delay + index * 30);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTechCodeBlocks);
    } else {
        initTechCodeBlocks();
    }
})();