     1|// 古签解语 - 抽签逻辑
     2|
     3|document.addEventListener('DOMContentLoaded', function() {
     4|    // 元素引用
     5|    const initialState = document.getElementById('initial-state');
     6|    const drawingState = document.getElementById('drawing-state');
     7|    const poemState = document.getElementById('poem-state');
     8|    const resultState = document.getElementById('result-state');
     9|    const drawBtn = document.getElementById('draw-btn');
    10|    const unlockBtn = document.getElementById('unlock-btn');
    11|    const drawAgainBtn = document.getElementById('draw-again-btn');
    12|    const drawAgainBtnEarly = document.getElementById('draw-again-btn-early');
    13|    const shareBtn = document.getElementById('share-btn');
    14|    const stickContainer = document.getElementById('stick-container');
    15|    
    16|    // 状态
    17|    let sticks = [];
    18|    let isDrawing = false;
    19|    let currentQian = null;
    20|    
    21|    // 初始化签筒
    22|    function initSticks() {
    23|        stickContainer.innerHTML = '';
    24|        sticks = [];
    25|        for (let i = 0; i < 60; i++) {
    26|            const stick = document.createElement('div');
    27|            stick.className = 'qian-stick';
    28|            stick.style.height = (150 + Math.random() * 50) + 'px';
    29|            stick.dataset.index = i;
    30|            stickContainer.appendChild(stick);
    31|            sticks.push(stick);
    32|        }
    33|    }
    34|    
    35|    // 切换状态
    36|    function switchState(stateName) {
    37|        initialState.classList.remove('active');
    38|        drawingState.classList.remove('active');
    39|        poemState.classList.remove('active');
    40|        resultState.classList.remove('active');
    41|        
    42|        switch(stateName) {
    43|            case 'initial':
    44|                initialState.classList.add('active');
    45|                break;
    46|            case 'drawing':
    47|                drawingState.classList.add('active');
    48|                break;
    49|            case 'poem':
    50|                poemState.classList.add('active');
    51|                break;
    52|            case 'result':
    53|                resultState.classList.add('active');
    54|                break;
    55|        }
    56|    }
    57|    
    58|    // 抽签动画
    59|    function animateDrawing() {
    60|        return new Promise((resolve) => {
    61|            switchState('drawing');
    62|            
    63|            const selectedIndex = Math.floor(Math.random() * sticks.length);
    64|            const selectedStick = sticks[selectedIndex];
    65|            selectedStick.classList.add('jumping');
    66|            
    67|            setTimeout(() => {
    68|                currentQian = getRandomQian();
    69|                resolve();
    70|            }, 2000);
    71|        });
    72|    }
    73|    
    74|    // 显示签诗（第一阶段）
    75|    function showPoem(qian) {        
    76|        // 签号信息
    77|        document.getElementById('qian-number').textContent = qian.number;
    78|        document.getElementById('qian-gong').textContent = qian.gong + '宫';
    79|        
    80|        const typeElement = document.getElementById('qian-type');
    81|        typeElement.textContent = qian.typeName;
    82|        typeElement.className = 'qian-type ' + qian.type;
    83|        
    84|        document.getElementById('guren-name').textContent = qian.guren;
    85|        
    86|        // 签诗竖排显示
    87|        const poemElement = document.getElementById('poem');
    88|        poemElement.innerHTML = qian.poem.map(line => `<div class="poem-line">${line}</div>`).join('');
    89|        
    90|        switchState('poem');
    91|    }
    92|    
    93|    // 显示详细解签（第二阶段）
    94|    function showFullResult(qian) {
    95|        // 签号信息
    96|        document.getElementById('qian-number2').textContent = qian.number;
    97|        document.getElementById('qian-gong2').textContent = qian.gong + '宫';
    98|        
    99|        const typeElement2 = document.getElementById('qian-type2');
   100|        typeElement2.textContent = qian.typeName;
   101|        typeElement2.className = 'qian-type ' + qian.type;
   102|        
   103|        document.getElementById('guren-name2').textContent = qian.guren;
   104|        
   105|        // 签诗
   106|        const poemElement2 = document.getElementById('poem2');
   107|        poemElement2.innerHTML = qian.poem.map(line => `<div class="poem-line">${line}</div>`).join('');
   108|        
   109|        // 解签内容
   110|        const jieContent = document.getElementById('jie-content');
   111|        jieContent.innerHTML = `
   112|            <p>${qian.jieMain}</p>
   113|            <p>${qian.jieDetail}</p>
   114|        `;
   115|        
   116|        // 运势列表
   117|        const fortuneList = document.getElementById('fortune-list');
   118|        const fortuneLabels = {
   119|            home: '家宅', self: '自身', wealth: '求财', trade: '交易',
   120|            marriage: '婚姻', pregnancy: '六甲', traveler: '行人',
   121|            farming: '田蚕', livestock: '六畜', finding: '寻人',
   122|            lawsuit: '公讼', moving: '移徙', lost: '失物',
   123|            illness: '疾病', grave: '山坟'
   124|        };
   125|        
   126|        fortuneList.innerHTML = Object.entries(qian.fortune).map(([key, value]) => {
   127|            const label = fortuneLabels[key] || key;
   128|            const valueClass = value.includes('吉') || value.includes('成') || value.includes('安') || value.includes('旺') ? 'good' : 
   129|                              value.includes('凶') || value.includes('阻') || value.includes('难') || value.includes('空') || value.includes('杳') ? 'bad' : 'neutral';
   130|            return `<div class="fortune-row"><span class="f-label">${label}</span><span class="f-value ${valueClass}">${value}</span></div>`;
   131|        }).join('');
   132|        
   133|        // 详细解读
   134|        document.getElementById('detail-text').innerHTML = qian.detail.map(p => `<p>${p}</p>`).join('');
   135|        
   136|        switchState('result');
   137|    }
   138|    
   139|    function reset() {
   140|        currentQian = null;
   141|        initSticks();
   142|        switchState('initial');
   143|    }
   144|    
   145|    function shareQian() {
   146|        if (!currentQian) return;
   147|        
   148|        const shareText = `
   149|📜 古签解语 · ${currentQian.number}
   150|【${currentQian.typeName}·${currentQian.gong}宫】
   151|
   152|古人典故：${currentQian.guren}
   153|
   154|签诗：
   155|${currentQian.poem.join('\n')}
   156|
   157|🙏 愿签诗指引方向
   158|        `.trim();
   159|        
   160|        if (navigator.share) {
   161|            navigator.share({
   162|                title: '古签解语',
   163|                text: shareText,
   164|                url: window.location.href
   165|            }).catch(() => copyToClipboard(shareText));
   166|        } else {
   167|            copyToClipboard(shareText);
   168|        }
   169|    }
   170|    
   171|    function copyToClipboard(text) {
   172|        navigator.clipboard.writeText(text).then(() => {
   173|            alert('签文已复制到剪贴板！');
   174|        }).catch(() => {
   175|            const textarea = document.createElement('textarea');
   176|            textarea.value = text;
   177|            document.body.appendChild(textarea);
   178|            textarea.select();
   179|            document.execCommand('copy');
   180|            document.body.removeChild(textarea);
   181|            alert('签文已复制到剪贴板！');
   182|        });
   183|    }
   184|    
   185|    // === 事件绑定 ===
   186|    
   187|    drawBtn.addEventListener('click', async function() {
   188|        if (isDrawing) return;
   189|        isDrawing = true;
   190|        drawBtn.disabled = true;
   191|        drawBtn.style.opacity = '0.5';
   192|        
   193|        try {
   194|            await animateDrawing();
   195|            showPoem(currentQian);
   196|        } finally {
   197|            isDrawing = false;
   198|            drawBtn.disabled = false;
   199|            drawBtn.style.opacity = '1';
   200|        }
   201|    });
   202|    
   203|    unlockBtn.addEventListener('click', function() {
   204|        showFullResult(currentQian);
   205|    });
   206|    
   207|    drawAgainBtn.addEventListener('click', reset);
   208|    drawAgainBtnEarly.addEventListener('click', reset);
   209|    shareBtn.addEventListener('click', shareQian);
   210|    
   211|    // 签筒交互
   212|    stickContainer.addEventListener('mouseover', function(e) {
   213|        if (e.target.classList.contains('qian-stick')) {
   214|            e.target.style.transform = 'translateY(-10px)';
   215|        }
   216|    });
   217|    
   218|    stickContainer.addEventListener('mouseout', function(e) {
   219|        if (e.target.classList.contains('qian-stick')) {
   220|            e.target.style.transform = '';
   221|        }
   222|    });
   223|    
   224|    // 初始化
   225|    initSticks();
   226|    
   227|    document.body.style.opacity = '0';
   228|    setTimeout(() => {
   229|        document.body.style.transition = 'opacity 0.5s ease';
   230|        document.body.style.opacity = '1';
   231|    }, 100);
   232|    
   233|    // 键盘快捷键
   234|    document.addEventListener('keydown', function(e) {
   235|        if (e.code === 'Space' || e.code === 'Enter') {
   236|            if (initialState.classList.contains('active')) {
   237|                drawBtn.click();
   238|            } else if (resultState.classList.contains('active')) {
   239|                drawAgainBtn.click();
   240|            }
   241|        }
   242|    });
   243|    
   244|    // 触摸支持
   245|    let touchStartY = 0;
   246|    document.addEventListener('touchstart', function(e) {
   247|        touchStartY = e.touches[0].clientY;
   248|    });
   249|    
   250|    document.addEventListener('touchend', function(e) {
   251|        const diff = touchStartY - e.changedTouches[0].clientY;
   252|        if (diff > 50 && initialState.classList.contains('active')) {
   253|            drawBtn.click();
   254|        }
   255|    });
   256|    
   257|    // 背景粒子
   258|    function createParticle() {
   259|        const particle = document.createElement('div');
   260|        particle.style.cssText = `
   261|            position: fixed;
   262|            width: 3px;
   263|            height: 3px;
   264|            background: rgba(212, 175, 55, 0.3);
   265|            border-radius: 50%;
   266|            pointer-events: none;
   267|            z-index: 0;
   268|            left: ${Math.random() * 100}vw;
   269|            top: 100vh;
   270|            animation: floatUp ${5 + Math.random() * 10}s linear forwards;
   271|        `;
   272|        document.body.appendChild(particle);
   273|        particle.addEventListener('animationend', () => particle.remove());
   274|    }
   275|    
   276|    const style = document.createElement('style');
   277|    style.textContent = `
   278|        @keyframes floatUp {
   279|            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
   280|            10% { opacity: 1; }
   281|            90% { opacity: 1; }
   282|            100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
   283|        }
   284|    `;
   285|    document.head.appendChild(style);
   286|    
   287|    setInterval(createParticle, 1500);
   288|    
   289|    console.log('%c📜 古签解语 📜', 'font-size: 24px; color: #d4af37; font-weight: bold;');
   290|});
   291|