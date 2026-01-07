document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const isDecimal = target % 1 !== 0; // 判斷是否為小數
        const duration = 2000; // 動畫時間 2 秒
        let start = 0;
        let startTime = null;

        const easeOutQuad = t => t * (2 - t); // 平滑的加速曲線

        const updateCount = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easedProgress = easeOutQuad(progress);

            let currentCount;
            if (isDecimal) {
                currentCount = (target * easedProgress).toFixed(2); // 小數點後兩位
            } else {
                currentCount = Math.floor(target * easedProgress);
            }
            counter.innerText = currentCount;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target.toFixed(isDecimal ? 2 : 0); // 確保最終顯示精確值
            }
        };
        requestAnimationFrame(updateCount);
    };

    // 使用 Intersection Observer 偵測元素進入視窗才開始動畫
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); // 動畫完成後停止觀察
            }
        });
    }, {
        threshold: 0.5 // 當元素 50% 進入視窗時觸發
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });
});
