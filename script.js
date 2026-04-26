// 慈航灵签抽签逻辑

document.addEventListener('DOMContentLoaded', function() {
    // 元素引用
    const initialState = document.getElementById('initial-state');
    const drawingState = document.getElementById('drawing-state');
    const resultState = document.getElementById('result-state');
    const drawBtn = document.getElementById('draw-btn');
    const drawAgainBtn = document.getElementById('draw-again-btn');
    const shareBtn = document.getElementById('share-btn');
    const stickContainer = document.getElementById('stick-container');
    
    // 签筒中的签
    let sticks = [];
    let isDrawing = false;
    let currentQian = null;
    
    // 初始化签筒
    function initSticks() {
        stickContainer.innerHTML = '';
        sticks = [];
        for (let i = 0; i < 60; i++) {
            const stick = document.createElement('div');
            stick.className = 'qian-stick';
            stick.style.height = (150 + Math.random() * 50) + 'px';
            stick.dataset.index = i;
            stickContainer.appendChild(stick);
            sticks.push(stick);
        }
    }
    
    // 切换状态
    function switchState(stateName) {
        initialState.classList.remove('active');
        drawingState.classList.remove('active');
        resultState.classList.remove('active');
        
        switch(stateName) {
            case 'initial':
                initialState.classList.add('active');
                break;
            case 'drawing':
                drawingState.classList.add('active');
                break;
            case 'result':
                resultState.classList.add('active');
                break;
        }
    }
    
    // 抽签动画
    function animateDrawing() {
        return new Promise((resolve) => {
            switchState('drawing');
            
            // 随机选择一根签
            const selectedIndex = Math.floor(Math.random() * sticks.length);
            const selectedStick = sticks[selectedIndex];
            
            // 添加跳动动画
            selectedStick.classList.add('jumping');
            
            // 2秒后显示结果
            setTimeout(() => {
                currentQian = getRandomQian();
                resolve();
            }, 2000);
        });
    }
    
    // 显示结果
    function showResult(qian) {
        // 签号
        document.getElementById('qian-number').textContent = qian.number;
        
        // 签类型
        const typeElement = document.getElementById('qian-type');
        typeElement.textContent = qian.typeName;
        typeElement.className = 'qian-type ' + qian.type;
        
        // 签文
        const poemElement = document.getElementById('poem');
        poemElement.innerHTML = qian.poem.map(line => `<p>${line}</p>`).join('');
        
        // 解曰
        document.getElementById('interpretation').textContent = qian.interpretation;
        
        // 仙机
        const guidanceElement = document.getElementById('guidance');
        guidanceElement.innerHTML = Object.entries(qian.guidance).map(([key, value]) => 
            `<div class="guidance-item"><span>${key}</span><span>${value}</span></div>`
        ).join('');
        
        // 观音指引
        document.getElementById('advice').textContent = qian.advice;
        
        switchState('result');
    }
    
    // 重置并重新抽签
    function reset() {
        currentQian = null;
        initSticks();
        switchState('initial');
    }
    
    // 分享功能
    function shareQian() {
        if (!currentQian) return;
        
        const shareText = `
🙏 慈航灵签 · ${currentQian.number} 🙏
【${currentQian.typeName}】

📜 签文：
${currentQian.poem.join('\n')}

💡 解曰：
${currentQian.interpretation}

🙏 愿观世音菩萨保佑 🙏
        `.trim();
        
        // 尝试使用 Web Share API
        if (navigator.share) {
            navigator.share({
                title: '慈航灵签',
                text: shareText,
                url: window.location.href
            }).catch(err => {
                // 用户取消或其他错误
                copyToClipboard(shareText);
            });
        } else {
            copyToClipboard(shareText);
        }
    }
    
    // 复制到剪贴板
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('签文已复制到剪贴板，可以分享给朋友了！');
        }).catch(err => {
            // 备用方案
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('签文已复制到剪贴板！');
        });
    }
    
    // 事件绑定
    drawBtn.addEventListener('click', async function() {
        if (isDrawing) return;
        isDrawing = true;
        
        drawBtn.disabled = true;
        drawBtn.style.opacity = '0.5';
        
        try {
            await animateDrawing();
            showResult(currentQian);
        } finally {
            isDrawing = false;
            drawBtn.disabled = false;
            drawBtn.style.opacity = '1';
        }
    });
    
    drawAgainBtn.addEventListener('click', function() {
        reset();
    });
    
    shareBtn.addEventListener('click', shareQian);
    
    // 签筒交互效果
    stickContainer.addEventListener('mouseover', function(e) {
        if (e.target.classList.contains('qian-stick')) {
            e.target.style.transform = 'translateY(-10px)';
        }
    });
    
    stickContainer.addEventListener('mouseout', function(e) {
        if (e.target.classList.contains('qian-stick')) {
            e.target.style.transform = '';
        }
    });
    
    // 初始化
    initSticks();
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // 添加键盘快捷键
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' || e.code === 'Enter') {
            if (initialState.classList.contains('active')) {
                drawBtn.click();
            } else if (resultState.classList.contains('active')) {
                drawAgainBtn.click();
            }
        }
    });
    
    // 添加触摸支持
    let touchStartY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        // 向上滑动触发抽签
        if (diff > 50 && initialState.classList.contains('active')) {
            drawBtn.click();
        }
    });
    
    // 添加背景动画粒子
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 5px;
            height: 5px;
            background: rgba(212, 175, 55, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            left: ${Math.random() * 100}vw;
            top: 100vh;
            animation: floatUp ${5 + Math.random() * 10}s linear forwards;
        `;
        document.body.appendChild(particle);
        
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }
    
    // 添加浮动动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 定期创建粒子
    setInterval(createParticle, 1000);
    
    // 控制台彩蛋
    console.log('%c🙏 慈航灵签 🙏', 'font-size: 24px; color: #d4af37; font-weight: bold;');
    console.log('%c南无大慈大悲观世音菩萨', 'font-size: 14px; color: #c9a959;');
    console.log('%c诚心祈愿，心诚则灵', 'font-size: 12px; color: #888;');
});

// PWA 支持（可选）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js');
    });
}
