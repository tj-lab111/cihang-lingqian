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
    
    // 生成付款备注
    function generatePayRemark() {
        const num = Math.floor(Math.random() * 9000) + 1000;
        const remark = `古签${num}`;
        document.getElementById('pay-remark').textContent = remark;
        return remark;
    }
    
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
            
            const selectedIndex = Math.floor(Math.random() * sticks.length);
            const selectedStick = sticks[selectedIndex];
            selectedStick.classList.add('jumping');
            
            setTimeout(() => {
                currentQian = getRandomQian();
                resolve();
            }, 2000);
        });
    }
    
    // 显示签诗（第一阶段）
    function showPoem(qian) {
        document.getElementById('qian-number').textContent = qian.number;
        document.getElementById('qian-gong').textContent = qian.gong + '宫';
        
        const typeElement = document.getElementById('qian-type');
        typeElement.textContent = qian.typeName;
        typeElement.className = 'qian-type ' + qian.type;
        
        document.getElementById('guren-name').textContent = qian.guren;
        
        const poemElement = document.getElementById('poem');
        poemElement.innerHTML = qian.poem.map(line => `<span>${line}</span>`).join('');
        
        generatePayRemark();
        switchState('poem');
    }
    
    // 显示详细解签（第二阶段）
    function showFullResult(qian) {
        document.getElementById('qian-number2').textContent = qian.number;
        document.getElementById('qian-gong2').textContent = qian.gong + '宫';
        
        const typeElement2 = document.getElementById('qian-type2');
        typeElement2.textContent = qian.typeName;
        typeElement2.className = 'qian-type ' + qian.type;
        
        document.getElementById('guren-name2').textContent = qian.guren;
        
        const poemElement2 = document.getElementById('poem2');
        poemElement2.innerHTML = qian.poem.map(line => `<span>${line}</span>`).join('');
        
        document.getElementById('jie-main').innerHTML = qian.jieMain;
        document.getElementById('jie-detail').textContent = qian.jieDetail;
        
        // 运势表格
        const fortuneGrid = document.getElementById('fortune-grid');
        const fortuneLabels = {
            home: '家宅', self: '自身', wealth: '求财', trade: '交易',
            marriage: '婚姻', pregnancy: '六甲', traveler: '行人',
            farming: '田蚕', livestock: '六畜', finding: '寻人',
            lawsuit: '公讼', moving: '移徙', lost: '失物',
            illness: '疾病', grave: '山坟'
        };
        
        fortuneGrid.innerHTML = Object.entries(qian.fortune).map(([key, value]) => {
            const label = fortuneLabels[key] || key;
            const valueClass = value.includes('吉') || value.includes('成') || value.includes('安') ? 'good' : 
                              value.includes('凶') || value.includes('阻') || value.includes('难') ? 'bad' : 'neutral';
            return `<div class="fortune-item"><span class="label">${label}</span><span class="value ${valueClass}">${value}</span></div>`;
        }).join('');
        
        // 详细解读
        document.getElementById('detail-text').innerHTML = qian.detail.map(p => `<p>${p}</p>`).join('');
        
        switchState('result');
    }
    
    function reset() {
        currentQian = null;
        initSticks();
        switchState('initial');
    }
    
    function shareQian() {
        if (!currentQian) return;
        
        const shareText = `
📜 古签解语 · ${currentQian.number}
【${currentQian.typeName}·${currentQian.gong}宫】

古人典故：${currentQian.guren}

签诗：
${currentQian.poem.join('\n')}

🙏 愿签诗指引方向
        `.trim();
        
        if (navigator.share) {
            navigator.share({
                title: '古签解语',
                text: shareText,
                url: window.location.href
            }).catch(() => copyToClipboard(shareText));
        } else {
            copyToClipboard(shareText);
        }
    }
    
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('签文已复制到剪贴板！');
        }).catch(() => {
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
    
    unlockBtn.addEventListener('click', function() {
        if (!currentQian) {
            alert('请先抽签');
            return;
        }
        showFullResult(currentQian);
    });
    
    drawAgainBtn.addEventListener('click', reset);
    drawAgainBtnEarly.addEventListener('click', reset);
    shareBtn.addEventListener('click', shareQian);
    
    // 签筒交互
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
        const diff = touchStartY - e.changedTouches[0].clientY;
        if (diff > 50 && initialState.classList.contains('active')) {
            drawBtn.click();
        }
    });
    
    // 背景粒子
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(212, 175, 55, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            left: ${Math.random() * 100}vw;
            top: 100vh;
            animation: floatUp ${5 + Math.random() * 10}s linear forwards;
        `;
        document.body.appendChild(particle);
        particle.addEventListener('animationend', () => particle.remove());
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    setInterval(createParticle, 1200);
    
    console.log('%c📜 古签解语 📜', 'font-size: 24px; color: #d4af37; font-weight: bold;');
});
