document.addEventListener('DOMContentLoaded', function() {
    // 主圆形交互效果
    const mainCircle = document.getElementById('main-circle');
    
    mainCircle.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.3) rotate(30deg)';
        this.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        // 当鼠标悬停时创建爆发效果
        createBurstEffect();
    });
    
    mainCircle.addEventListener('mouseout', function() {
        this.style.transform = '';
        this.style.transition = 'transform 0.8s cubic-bezier(0.34, 0.56, 0.64, 1)';
    });
    
    mainCircle.addEventListener('click', function() {
        // 切换背景颜色主题
        document.body.classList.toggle('alt-theme');
        
        // 产生波纹效果
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        document.querySelector('.animation-scene').appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    });
    
    // 创建粒子
    function createParticles(count) {
        const particlesContainer = document.getElementById('particles');
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // 随机位置和大小
            const size = Math.random() * 3 + 1;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.opacity = Math.random() * 0.6 + 0.2;
            
            // 设置随机位置
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            // 设置随机移动方向和距离
            const tx = (Math.random() - 0.5) * window.innerWidth * 0.8;
            const ty = (Math.random() - 0.5) * window.innerHeight * 0.8;
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            
            // 设置随机动画持续时间
            const duration = Math.random() * 10 + 10;
            particle.style.animationDuration = duration + 's';
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // 创建连接线
    function createLines(count) {
        const linesContainer = document.getElementById('lines');
        
        for (let i = 0; i < count; i++) {
            const line = document.createElement('div');
            line.className = 'line';
            
            // 设置随机长度、宽度和位置
            const length = Math.random() * 300 + 100;
            const width = Math.random() * 0.5 + 0.5;
            line.style.width = length + 'px';
            line.style.height = width + 'px';
            line.style.left = 'calc(50% - ' + (length / 2) + 'px)';
            line.style.top = '50%';
            
            // 设置随机旋转和延迟
            const startAngle = Math.random() * 360;
            const duration = Math.random() * 5 + 10;
            const delay = Math.random() * 5;
            line.style.transform = 'rotate(' + startAngle + 'deg)';
            line.style.animationDuration = duration + 's';
            line.style.animationDelay = delay + 's';
            
            linesContainer.appendChild(line);
        }
    }
    
    // 创建爆发效果
    function createBurstEffect() {
        const burstCount = 15;
        const container = document.querySelector('.animation-scene');
        const circle = document.getElementById('main-circle');
        const rect = circle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < burstCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'burst-particle';
            
            // 随机样式
            const size = Math.random() * 8 + 4;
            const angle = (i / burstCount) * 360;
            const distance = Math.random() * 100 + 50;
            const duration = Math.random() * 0.6 + 0.4;
            
            // 设置样式
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.background = `hsl(${Math.random() * 60 + 180}, 100%, 70%)`;
            particle.style.borderRadius = '50%';
            particle.style.position = 'absolute';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.transform = 'translate(-50%, -50%)';
            particle.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.7)';
            
            // 设置动画
            particle.animate([
                { transform: 'translate(-50%, -50%)', opacity: 1 },
                { 
                    transform: `translate(calc(-50% + ${Math.cos(angle * Math.PI / 180) * distance}px), 
                               calc(-50% + ${Math.sin(angle * Math.PI / 180) * distance}px))`,
                    opacity: 0
                }
            ], {
                duration: duration * 1000,
                easing: 'ease-out',
                fill: 'forwards'
            });
            
            container.appendChild(particle);
            
            // 移除粒子
            setTimeout(() => {
                particle.remove();
            }, duration * 1000);
        }
    }
    
    // 添加鼠标移动交互
    document.addEventListener('mousemove', function(e) {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        
        const scene = document.querySelector('.animation-scene');
        scene.style.transform = `translateX(${x * 40}px) translateY(${y * 40}px)`;
        scene.style.transition = 'transform 0.1s ease-out';
    });
    
    // 初始化
    createParticles(100);
    createLines(15);
    
    // 添加响应式调整
    window.addEventListener('resize', function() {
        const particles = document.getElementById('particles');
        const lines = document.getElementById('lines');
        
        particles.innerHTML = '';
        lines.innerHTML = '';
        
        createParticles(100);
        createLines(15);
    });
    
    // 添加CSS变量
    document.body.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
    window.addEventListener('resize', () => {
        document.body.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
    });
    
    // 添加自定义样式
    const style = document.createElement('style');
    style.textContent = `
        .burst-particle {
            z-index: 100;
            pointer-events: none;
        }
        
        .ripple {
            position: absolute;
            width: 10px;
            height: 10px;
            background: transparent;
            border: 2px solid rgba(73, 160, 157, 0.9);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: ripple 1s ease-out forwards;
            z-index: 5;
        }
        
        @keyframes ripple {
            0% { width: 0; height: 0; opacity: 1; }
            100% { width: 500px; height: 500px; opacity: 0; }
        }
        
        .alt-theme {
            background: #1a0b2e;
        }
    `;
    document.head.appendChild(style);
    
    // 技能条动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = document.querySelectorAll('.skill-bar');
                skillBars.forEach(bar => {
                    const percent = bar.getAttribute('data-percent');
                    const level = bar.querySelector('.skill-level');
                    level.style.width = percent;
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const skills = document.querySelector('.skills');
    if (skills) {
        observer.observe(skills);
    }
    
    // 为标题添加打字机效果
    const heading = document.querySelector('h1');
    const originalText = heading.textContent;
    heading.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < originalText.length) {
            heading.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 150);
        }
    }
    
    // 启动打字机效果
    setTimeout(typeWriter, 500);
});
