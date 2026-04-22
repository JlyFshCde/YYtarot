/**
 * script.js - 塔罗占卜逻辑
 */

window.onload = function() {
    resetGame();
};

function resetGame() {
    // 隐藏页面
    document.getElementById('verify-page').style.display = 'none';
    document.getElementById('setup-area').style.display = 'none';
    document.getElementById('result-page').style.display = 'none';
    
    // 只显示输入框
    document.getElementById('question-container').style.display = 'block';
    
    // 清空之前的数据
    document.getElementById('user-query').value = '';
    document.getElementById('display-area').innerHTML = '';
    document.getElementById('meaning-area').innerHTML = '';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const constellations = ["白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座", "摩羯座", "水瓶座", "双鱼座"];
    

function generateRandomInfo() {
    let nums = [];
    while(nums.length < 3) {
        let n = Math.floor(Math.random() * 9) + 1;
        if(!nums.includes(n)) nums.push(n);
    }

// 随机 3 个星座
    let cons = [];
    while(cons.length < 3) {
        let c = constellations[Math.floor(Math.random() * constellations.length)];
        if(!cons.includes(c)) cons.push(c);
    }

    document.getElementById('random-numbers').innerText = nums.join(' 、');
    document.getElementById('random-constellations').innerText = cons.join(' 、');
}

// 从问题页跳转到验证页
function showVerifyPage() {
    const query = document.getElementById('user-query').value.trim();
    if (!query) {
        alert("请先输入问题，以便链接能量");
        return;
    }
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('verify-page').style.display = 'block';
    generateRandomInfo(); 
}

// 确认匹配，跳转到抽牌按钮
function showDrawButtons() {
    document.getElementById('verify-page').style.display = 'none';
    document.getElementById('setup-area').style.display = 'flex';
}


// 抽牌主函数
function startDraw(count) {
    document.getElementById('setup-area').style.display = 'none'; // 抽牌后隐藏按钮
    document.getElementById('result-page').style.display = 'flex'; // 显示结果

    const displayArea = document.getElementById('display-area');
    const meaningArea = document.getElementById('meaning-area');
    const userQuestion = document.getElementById('user-query').value.trim();


    // 安全检查
    if (typeof tarotDeck === 'undefined' || tarotDeck.length === 0) {
        alert("牌池数据还没准备好，请检查 cards.js");
        return;
    }
    
    // 清空旧数据
    displayArea.innerHTML = '';
    meaningArea.innerHTML = '<h2>✨ 塔罗的启示 ✨</h2>';
    if (userQuestion !== "") {
        meaningArea.innerHTML += `<div class="display-question">“ ${userQuestion} ”</div>`;
    }

    // 随机洗牌并抽取
    let tempDeck = [...tarotDeck];
    let selectedCards = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * tempDeck.length);
        selectedCards.push(tempDeck.splice(randomIndex, 1)[0]);
    }

    // --- 渲染展示 ---
    selectedCards.forEach((card, index) => {
        const isUpright = Math.random() > 0.5;
        const positionText = isUpright ? "正位" : "逆位";
        const detailedMeaning = isUpright ? card.meaning_up : card.meaning_rev;

    
    let positionLabelHTML = '';
    // 只有当抽取 3 张牌（圣三角）时才显示标签
    if (count === 3) {
        let labelText = '';
        let labelClass = '';
        switch (index) {
            case 0: labelText = '过去/原因'; labelClass = 'label-cause'; break;
            case 1: labelText = '现在/结果'; labelClass = 'label-result'; break;
            case 2: labelText = '未来/建议'; labelClass = 'label-advice'; break;
        }
        // 生成标签的 HTML
        positionLabelHTML = `<div class="card-position-label ${labelClass}"><span>${labelText}</span></div>`;
    }

    //  将标签加入卡片 HTML
    const cardHTML = `
    <div class="card-wrapper" style="animation-delay: ${index * 0.2}s">
        ${positionLabelHTML} 
        <div class="card-img-box">
            <img src="${card.img}" 
                 class="${isUpright ? '' : 'reversed-img'}" 
                 alt="${card.name}">
        </div>
        <div class="card-info">
            <div class="card-name">${card.name}</div>
            <div class="card-pos">${positionText}</div>
        </div>
    </div>
`;
    displayArea.innerHTML += cardHTML;

    // 解牌文字加上位置信息
    let meaningTitleText = `${index + 1}. ${card.name}`;
    if (count === 3) {
        const labels = ['过去/原因', '现在/结果', '未来/建议'];
        meaningTitleText = `${labels[index]}：${card.name}`; 
    }

    const meaningHTML = `
        <div class="meaning-item">
            <h3>${meaningTitleText} (${positionText})</h3>
            <div class="meaning-text">${detailedMeaning}</div>
        </div>
    `;
    meaningArea.innerHTML += meaningHTML;
});

    // 动画结束后显示文字并滚动
    setTimeout(() => {
        meaningArea.style.display = 'block';
        meaningArea.scrollIntoView({ behavior: 'smooth' });
    }, 1000); // 1秒后弹出文字
}
