// 古签解语 - 抽签逻辑

document.addEventListener('DOMContentLoaded', function() {
    // 元素引用
    const initialState = document.getElementById('initial-state');
    const drawingState = document.getElementById('drawing-state');
    const poemState = document.getElementById('poem-state');
    const resultState = document.getElementById('result-state');
    const drawBtn = document.getElementById('draw-btn');
    const unlockBtn = document.getElementById('unlock-btn');
    const drawAgainBtn = document.getElementById('draw-again-btn');
    const drawAgainBtnEarly = document.getElementById('draw-again-btn-early');
    const shareBtn = document.getElementById('share-btn');
    const stickContainer = document.getElementById('stick-container');
    
    // 状态
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
        poemState.classList.remove('active');
        resultState.classList.remove('active');
        
        switch(stateName) {
            case 'initial':
                initialState.classList.add('active');
                break;
            case 'drawing':
                drawingState.classList.add('active');
                break;
            case 'poem':
                poemState.classList.add('active');
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
            
            // 随机选择一根签跳动
            const selectedIndex = Math.floor(Math.random() * sticks.length);
            const selectedStick = sticks[selectedIndex];
            selectedStick.classList.add('jumping');
            
            // 2秒后显示签诗
            setTimeout(() => {
                currentQian = getRandomQian();
                resolve();
            }, 2000);
        });
    }
    
    // 显示签诗（第一阶段）
    function showPoem(qian) {
        // 签号
        document.getElementById('qian-number').textContent = qian.number;
        
        // 签类型
        const typeElement = document.getElementById('qian-type');
        typeElement.textContent = qian.typeName;
        typeElement.className = 'qian-type ' + qian.type;
        
        // 签文
        const poemElement = document.getElementById('poem');
        poemElement.innerHTML = qian.poem.map(line => `<p>${line}</p>`).join('');
        
        switchState('poem');
    }
    
    // 显示详细解签（第二阶段）
    function showFullResult(qian) {
        // 签号和类型
        document.getElementById('qian-number2').textContent = qian.number;
        const typeElement2 = document.getElementById('qian-type2');
        typeElement2.textContent = qian.typeName;
        typeElement2.className = 'qian-type ' + qian.type;
        
        // 签文（简化版）
        const poemElement2 = document.getElementById('poem2');
        poemElement2.innerHTML = qian.poem.map(line => `<p>${line}</p>`).join('');
        
        // 签解
        document.getElementById('interpretation').textContent = qian.interpretation;
        
        // 各事指引
        const guidanceElement = document.getElementById('guidance');
        guidanceElement.innerHTML = Object.entries(qian.guidance).map(([key, value]) => 
            `<div class="guidance-item"><span>${key}</span><span>${value}</span></div>`
        ).join('');
        
        // 建议
        document.getElementById('advice').textContent = qian.advice;
        
        switchState('result');
    }
    
    // 重置
    function reset() {
        currentQian = null;
        initSticks();
        switchState('initial');
    }
    
    // 分享功能
    function shareQian() {
        if (!currentQian) return;
        
        const shareText = `
📜 古签解语 · ${currentQian.number} 📜
【${currentQian.typeName}】

签文：
${currentQian.poem.join('\n')}

🙏 愿签诗指引方向 🙏
        `.trim();
        
        if (navigator.share) {
            navigator.share({
                title: '古签解语',
                text: shareText,
                url: window.location.href
            }).catch(err => {
                copyToClipboard(shareText);
            });
        } else {
            copyToClipboard(shareText);
        }
    }
    
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('签文已复制到剪贴板！');
        }).catch(err => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('签文已复制到剪贴板！');
        });
    }
    
    // === 事件绑定 ===
    
    // 摇签按钮
    drawBtn.addEventListener('click', async function() {
        if (isDrawing) return;
        isDrawing = true;
        
        drawBtn.disabled = true;
        drawBtn.style.opacity = '0.5';
        
        try {
            await animateDrawing();
            showPoem(currentQian);
        } finally {
            isDrawing = false;
            drawBtn.disabled = false;
            drawBtn.style.opacity = '1';
        }
    });
    
    // 解锁解签按钮
    unlockBtn.addEventListener('click', function() {
        if (!currentQian) {
            alert('请先抽签');
            return;
        }
        // 直接显示解签（实际项目中可以验证付款）
        showFullResult(currentQian);
    });
    
    // 重新抽签按钮
    drawAgainBtn.addEventListener('click', reset);
    drawAgainBtnEarly.addEventListener('click', reset);
    
    // 分享按钮
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
    
    // 页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' || e.code === 'Enter') {
            if (initialState.classList.contains('active')) {
                drawBtn.click();
            } else if (resultState.classList.contains('active')) {
                drawAgainBtn.click();
            }
        }
    });
    
    // 触摸支持
    let touchStartY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        if (diff > 50 && initialState.classList.contains('active')) {
            drawBtn.click();
        }
    });
    
    // 背景粒子动画
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
    console.log('%c📜 古签解语 📜', 'font-size: 24px; color: #d4af37; font-weight: bold;');
    console.log('%c传统签诗 · 心诚则灵', 'font-size: 14px; color: #c9a959;');
});
