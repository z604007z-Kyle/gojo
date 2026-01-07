document.addEventListener('DOMContentLoaded', () => {
    // --- 1. 數字跳動動畫 (你原本的邏輯，微調最終顯示) ---
    const counters = document.querySelectorAll('.counter');

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const isDecimal = target % 1 !== 0; 
        const duration = 2000; 
        let startTime = null;

        const easeOutQuad = t => t * (2 - t);

        const updateCount = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easedProgress = easeOutQuad(progress);

            let currentCount;
            if (isDecimal) {
                currentCount = (target * easedProgress).toFixed(2);
            } else {
                currentCount = Math.floor(target * easedProgress);
            }
            counter.innerText = currentCount;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                // 確保最終數值正確，不強加 .00 除非它真的是小數
                counter.innerText = isDecimal ? target.toFixed(2) : target;
            }
        };
        requestAnimationFrame(updateCount);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // --- 2. 導覽列自動亮起 (Active Link On Scroll) ---
    // 當使用者滑到特定區塊，導覽列對應的連結會發光 (像六眼偵測一樣)
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const navObserverOptions = {
        threshold: 0.3 // 區塊佔據 30% 視窗時判定為當前區塊
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));
});
