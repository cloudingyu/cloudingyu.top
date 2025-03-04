document.addEventListener('DOMContentLoaded', () => {
    initMatrixEffect();
    createParticles();
    addNeonText();
    addGradientBorders();
    
    // 添加鼠标移动效果
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        document.documentElement.style.setProperty('--mouse-x', x);
        document.documentElement.style.setProperty('--mouse-y', y);
        
        // 移动全息投影
        const hologram = document.querySelector('.hologram');
        hologram.style.transform = `translate(calc(-50% + ${(x - 0.5) * 50}px), calc(-50% + ${(y - 0.5) * 50}px))`;
    });
});

// 矩阵雨效果
function initMatrixEffect() {
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // 使用更多样的字符
    const chars = '01アイウエオカキクケコサシスセソタチツテト♥♦♣♠'.split('');
    
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(10, 0, 31, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 随机颜色，以紫色为主
        const colors = [
            '#c418ff', // 亮紫色
            '#9d4edd', // 主紫色
            '#c77dff', // 淡紫色
            '#e0aaff', // 更淡的紫色
            '#18e3ff'  // 点缀蓝色
        ];
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            
            // 随机选择颜色，但更多倾向于紫色
            const colorIndex = Math.floor(Math.random() * (Math.random() < 0.7 ? 3 : 5));
            ctx.fillStyle = colors[colorIndex];
            
            ctx.font = `${fontSize}px monospace`;
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
    
    // 窗口大小改变时重新调整画布
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// 创建粒子效果
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    const particleCount = 70; // 墛加粒子数量
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 随机粒子样式
        const size = Math.random() * 5 + 1;
        const type = Math.random();
        
        let color;
        if (type < 0.5) {
            color = '#c418ff'; // 亮紫色
        } else if (type < 0.7) {
            color = '#9d4edd'; // 主紫色
        } else if (type < 0.9) {
            color = '#c77dff'; // 淡紫色
        } else {
            color = '#18e3ff'; // 点缀青色
        }
        
        // 设置粒子样式
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            border-radius: 50%;
            box-shadow: 0 0 ${size * 3}px ${color};
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.7 + 0.3};
            animation: float-particle ${Math.random() * 10 + 10}s ease-in-out infinite alternate;
            z-index: 3;
        `;
        
        particlesContainer.appendChild(particle);
    }
    
    // 添加粒子动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-particle {
            0% { transform: translate(0, 0); }
            100% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); }
        }
    `;
    document.head.appendChild(style);
    
    // 添加几何图形
    addGeometricElements();
}

function addGeometricElements() {
    const container = document.querySelector('.cyber-elements');
    const shapes = 15;
    
    for (let i = 0; i < shapes; i++) {
        const element = document.createElement('div');
        const type = Math.floor(Math.random() * 3);
        const size = Math.random() * 30 + 10;
        
        // 随机位置
        const x = Math.random() * 90 + 5;
        const y = Math.random() * 90 + 5;
        
        // 随机颜色，主要是紫色系
        const colors = ['--neon-purple', '--main-purple', '--light-purple', '--neon-blue'];
        const weights = [0.4, 0.3, 0.2, 0.1]; // 权重，倾向于紫色
        
        let colorIndex = 0;
        const rand = Math.random();
        let sum = 0;
        
        for(let j = 0; j < weights.length; j++) {
            sum += weights[j];
            if(rand <= sum) {
                colorIndex = j;
                break;
            }
        }
        
        const color = `var(${colors[colorIndex]})`;
        
        // 基本样式，增加亮度和清晰度
        element.style.cssText = `
            position: absolute;
            top: ${y}%;
            left: ${x}%;
            width: ${size}px;
            height: ${size}px;
            border: 1.5px solid ${color};
            box-shadow: 0 0 15px ${color};
            opacity: ${Math.random() * 0.7 + 0.3};
            animation: ${Math.random() > 0.5 ? 'pulse' : 'rotate'} ${Math.random() * 10 + 5}s infinite ${Math.random() > 0.5 ? 'alternate' : 'linear'};
            z-index: ${Math.floor(Math.random() * 3) + 1};
            filter: blur(0.3px);
        `;
        
        // 根据类型设置不同的图形
        if (type === 0) {
            // 圆形
            element.style.borderRadius = '50%';
        } else if (type === 1) {
            // 六边形
            element.style.clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
        } else {
            // 方形/菱形
            element.style.transform = `rotate(${Math.random() * 45}deg)`;
        }
        
        container.appendChild(element);
    }
}

// 添加霓虹文字
function addNeonText() {
    const container = document.querySelector('.container');
    const neonText = document.createElement('div');
    neonText.className = 'neon-text';
    neonText.textContent = 'CLOUDINGYU';
    container.appendChild(neonText);
}

// 添加渐变边框元素
function addGradientBorders() {
    const container = document.querySelector('.container');
    
    // 创建几个不同的渐变边框元素
    const positions = [
        { top: '10%', left: '10%', width: '200px', height: '100px' },
        { top: '70%', left: '20%', width: '150px', height: '150px' },
        { top: '20%', left: '70%', width: '180px', height: '120px' }
    ];
    
    positions.forEach((pos, index) => {
        const border = document.createElement('div');
        border.className = 'gradient-border';
        
        Object.keys(pos).forEach(key => {
            border.style[key] = pos[key];
        });
        
        const content = document.createElement('div');
        content.className = 'gradient-border-content';
        
        // 可以根据需要添加内容
        if (index === 0) {
            content.innerHTML = '<div style="font-size:0.8rem;letter-spacing:1px;">SYSTEM LOADING</div>';
        } else if (index === 1) {
            content.innerHTML = '<div style="font-size:0.8rem;letter-spacing:1px;">ACCESS GRANTED</div>';
        } else {
            content.innerHTML = '<div style="font-size:0.8rem;letter-spacing:1px;">DATA STREAM</div>';
        }
        
        border.appendChild(content);
        container.appendChild(border);
    });
}
