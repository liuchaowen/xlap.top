// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('bgVideo');

    // 确保视频能够自动播放
    function playVideo() {
        if (video) {
            video.play().catch(function (error) {
                console.log('视频自动播放被阻止:', error);
                // 如果自动播放被阻止，可以添加点击播放的提示
                showPlayPrompt();
            });
        }
    }

    // 显示播放提示（当自动播放被浏览器阻止时）
    function showPlayPrompt() {
        const playPrompt = document.createElement('div');
        playPrompt.className = 'play-prompt';
        playPrompt.innerHTML = `
            <div class="play-button">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <circle cx="30" cy="30" r="30" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
                    <path d="M24 18L42 30L24 42V18Z" fill="white"/>
                </svg>
                <p>点击播放背景视频</p>
            </div>
        `;

        playPrompt.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            cursor: pointer;
        `;

        const playButton = playPrompt.querySelector('.play-button');
        playButton.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            color: white;
            text-align: center;
            transition: transform 0.3s ease;
        `;

        playButton.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.1)';
        });

        playButton.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });

        playPrompt.addEventListener('click', function () {
            video.play();
            document.body.removeChild(playPrompt);
        });

        document.body.appendChild(playPrompt);
    }

    // 监听视频事件
    if (video) {
        // 视频加载完成后尝试播放
        video.addEventListener('loadeddata', function () {
            playVideo();
        });

        // 确保视频循环播放
        video.addEventListener('ended', function () {
            video.currentTime = 0;
            video.play();
        });

        // 监听视频播放状态
        video.addEventListener('playing', function () {
            console.log('视频开始播放');
        });

        video.addEventListener('pause', function () {
            console.log('视频已暂停');
        });

        // 处理视频加载错误
        video.addEventListener('error', function (e) {
            console.error('视频加载出错:', e);
            // 如果视频加载失败，显示备用背景
            showFallbackBackground();
        });
    }

    // 备用背景（当视频无法加载时）
    function showFallbackBackground() {
        document.body.style.background = `
            linear-gradient(45deg, 
                rgba(20, 20, 20, 0.9) 0%, 
                rgba(40, 40, 40, 0.8) 50%, 
                rgba(20, 20, 20, 0.9) 100%
            ),
            radial-gradient(circle at center, 
                rgba(60, 60, 60, 0.3) 0%, 
                rgba(0, 0, 0, 1) 100%
            )
        `;
    }

    // 页面可见性变化处理（防止后台时暂停）
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible' && video) {
            // 页面重新可见时，确保视频继续播放
            setTimeout(function () {
                if (video.paused) {
                    video.play().catch(console.log);
                }
            }, 500);
        }
    });

    // 添加键盘事件（可选的交互功能）
    document.addEventListener('keydown', function (e) {
        if (video) {
            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    if (video.paused) {
                        video.play();
                    } else {
                        video.pause();
                    }
                    break;
                case 'KeyM':
                    e.preventDefault();
                    video.muted = !video.muted;
                    break;
            }
        }
    });

    // 平滑滚动（如果需要的话）
    function smoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    smoothScroll();

    // 打字机效果
    function typeWriter() {
        const text = "XLAP.TOP";
        const typingElement = document.getElementById('typingText');
        const speed = 400; // 每个字符的延迟时间（毫秒）
        let index = 0;
        let currentText = '';

        if (!typingElement) return;

        // 清空内容
        typingElement.innerHTML = '';

        function typeChar() {
            if (index < text.length) {
                // 添加当前字符到文本
                currentText += text[index];

                // 更新显示内容（文本 + 光标）
                typingElement.innerHTML = `<span class="typing-char">${currentText}</span><span class="typing-cursor"></span>`;

                index++;
                setTimeout(typeChar, speed);
            } else {
                // 打字完成后，移除光标
                setTimeout(() => {
                    typingElement.innerHTML = `<span class="typing-char">${currentText}</span>`;
                }, 1500);
            }
        }

        // 开始时显示光标
        typingElement.innerHTML = '<span class="typing-cursor"></span>';

        // 开始打字效果，稍微延迟一下
        setTimeout(typeChar, 800);
    }

    // 启动打字机效果
    typeWriter();
});

// 音乐播放器功能
class MusicPlayer {
    constructor() {
        this.musicList = [];
        this.currentIndex = 0;
        this.audio = new Audio();
        this.isPlaying = false;
        this.progressInterval = null;

        // UI元素
        this.musicIcon = document.querySelector('.music-icon');
        this.musicPlayBtn = document.getElementById('musicPlayBtn');
        this.musicPauseBtn = document.getElementById('musicPauseBtn');
        this.musicName = document.querySelector('.music-name');
        this.musicProgressBar = document.querySelector('.music-progress-bar');

        this.initEvents();
    }

    // 初始化事件监听
    initEvents() {
        // 点击播放/暂停
        if (this.musicIcon) {
            this.musicIcon.addEventListener('click', () => this.togglePlay());
        }

        // 音乐播放结束事件
        this.audio.addEventListener('ended', () => {
            this.playNext();
        });

        // 音乐开始播放事件
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updateUI();
            this.startProgressUpdate();
        });

        // 音乐暂停事件
        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updateUI();
            this.stopProgressUpdate();
        });

        // 音乐加载事件
        this.audio.addEventListener('loadeddata', () => {
            console.log('音乐加载完成: ' + this.getCurrentMusic().name);
        });

        // 音乐错误事件
        this.audio.addEventListener('error', (e) => {
            console.error('音乐加载错误:', e);
            this.playNext(); // 出错时尝试播放下一首
        });
    }

    // 加载音乐列表
    async loadMusicList() {
        try {
            // 使用i18n获取本地化文件路径
            const filePath = window.i18n.getLocalizedFilePath('music.json');
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error('无法加载音乐列表');
            }
            this.musicList = await response.json();
            console.log('音乐列表加载成功，共', this.musicList.length, '首歌');

            if (this.musicList.length > 0) {
                this.loadCurrentMusic();
            }
        } catch (error) {
            console.error('加载音乐列表失败:', error);
            this.musicName.textContent = '音乐加载失败';
        }
    }

    // 加载当前音乐
    loadCurrentMusic() {
        const music = this.getCurrentMusic();
        if (!music) return;

        this.musicName.textContent = music.name;
        this.audio.src = music.url;
        this.audio.load();

        // 自动播放（可能受浏览器政策限制）
        if (this.isPlaying) {
            this.audio.play().catch(error => {
                console.log('自动播放被阻止:', error);
            });
        }
    }

    // 获取当前音乐
    getCurrentMusic() {
        return this.musicList[this.currentIndex] || null;
    }

    // 播放音乐
    play() {
        if (!this.audio.src) {
            this.loadCurrentMusic();
        }

        this.audio.play().catch(error => {
            console.log('播放被阻止:', error);
        });
    }

    // 暂停音乐
    pause() {
        this.audio.pause();
    }

    // 切换播放/暂停状态
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    // 播放下一首
    playNext() {
        this.currentIndex = (this.currentIndex + 1) % this.musicList.length;
        this.loadCurrentMusic();
        this.play();
    }

    // 更新UI
    updateUI() {
        if (this.isPlaying) {
            this.musicPlayBtn.classList.add('hidden');
            this.musicPauseBtn.classList.remove('hidden');
        } else {
            this.musicPlayBtn.classList.remove('hidden');
            this.musicPauseBtn.classList.add('hidden');
        }
    }

    // 开始更新进度条
    startProgressUpdate() {
        this.stopProgressUpdate(); // 确保之前的定时器被清除

        this.progressInterval = setInterval(() => {
            if (!this.audio.duration) return;

            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.musicProgressBar.style.width = `${progress}%`;
        }, 100);
    }

    // 停止更新进度条
    stopProgressUpdate() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    // 语言变更时重新加载音乐列表
    reloadMusicList() {
        this.loadMusicList();
    }
}

// 窗口加载完成后的处理
window.addEventListener('load', function () {
    console.log('纪念张国荣网站加载完成');

    // 添加加载完成的淡入效果
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease-in-out';

    setTimeout(function () {
        document.body.style.opacity = '1';
    }, 100);

    // 初始化音乐播放器
    const musicPlayer = new MusicPlayer();
    musicPlayer.loadMusicList();

    // 初始化电影抽屉
    const movieDrawer = new MovieDrawer();
    movieDrawer.loadMovieList();

    // 监听语言变更事件
    document.addEventListener('languageChanged', function (event) {
        console.log('语言已变更为:', event.detail.language);
        // 重新加载音乐和电影列表
        musicPlayer.reloadMusicList();
        movieDrawer.reloadMovieList();
    });

    // 尝试在用户交互后播放音乐（解决自动播放限制）
    document.addEventListener('click', function onFirstClick() {
        musicPlayer.play();
        document.removeEventListener('click', onFirstClick);
    }, { once: true });
});

// 电影抽屉功能
class MovieDrawer {
    constructor() {
        this.movieList = [];
        this.isOpen = false;

        // UI元素
        this.drawer = document.getElementById('movieDrawer');
        this.toggle = document.getElementById('drawerToggle');
        this.movieListContainer = document.getElementById('movieList');

        this.initEvents();
    }

    // 初始化事件监听
    initEvents() {
        if (this.toggle) {
            this.toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('抽屉切换按钮被点击');
                this.toggleDrawer();
            });
            console.log('抽屉切换按钮事件已绑定');
        } else {
            console.error('未找到抽屉切换按钮元素');
        }

        // 点击抽屉外部关闭抽屉
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.drawer.contains(e.target)) {
                this.closeDrawer();
            }
        });

        // ESC键关闭抽屉
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeDrawer();
            }
        });
    }

    // 加载电影列表
    async loadMovieList() {
        try {
            // 使用i18n获取本地化文件路径
            const filePath = window.i18n.getLocalizedFilePath('movie.json');
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error('无法加载电影列表');
            }
            this.movieList = await response.json();
            console.log('电影列表加载成功，共', this.movieList.length, '部电影');

            this.renderMovieList();
        } catch (error) {
            console.error('加载电影列表失败:', error);
            if (this.movieListContainer) {
                this.movieListContainer.innerHTML = '<div class="error-message">电影列表加载失败</div>';
            }
        }
    }

    // 语言变更时重新加载电影列表
    reloadMovieList() {
        this.loadMovieList();
    }

    // 计算星星数量
    calculateStars(rate) {
        const numericRate = parseFloat(rate);
        const roundedRate = Math.round(numericRate);
        const starCount = Math.floor(roundedRate / 2);
        return '⭐'.repeat(starCount);
    }

    // 渲染电影列表
    renderMovieList() {
        if (!this.movieListContainer || !this.movieList.length) return;

        const movieItems = this.movieList.map(movie => {
            const stars = this.calculateStars(movie.rate);
            return `
                <div class="movie-item" data-movie="${movie.name}">
                    <img src="${movie.url}" alt="${movie.name}" class="movie-poster" loading="lazy">
                    <div class="movie-info">
                        <div class="movie-name">《${movie.name}》</div>
                        <div class="movie-rate">${stars} ${movie.rate}</div>
                    </div>
                </div>
            `;
        }).join('');

        this.movieListContainer.innerHTML = movieItems;

        // 为每个电影项添加点击事件
        this.movieListContainer.querySelectorAll('.movie-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const movieName = e.currentTarget.dataset.movie;
                this.onMovieClick(movieName);
            });
        });
    }

    // 电影项点击事件
    onMovieClick(movieName) {
        console.log('点击了电影:', movieName);
        // 这里可以添加更多交互，比如显示电影详情、播放预告片等
        // 暂时只是在控制台输出
    }

    // 切换抽屉状态
    toggleDrawer() {
        console.log('切换抽屉状态，当前状态:', this.isOpen ? '打开' : '关闭');
        if (this.isOpen) {
            this.closeDrawer();
        } else {
            this.openDrawer();
        }
    }

    // 打开抽屉
    openDrawer() {
        if (this.drawer) {
            console.log('打开抽屉');
            this.drawer.classList.add('open');
            document.body.classList.add('drawer-open');
            this.isOpen = true;
        }
    }

    // 关闭抽屉
    closeDrawer() {
        if (this.drawer) {
            console.log('关闭抽屉');
            this.drawer.classList.remove('open');
            document.body.classList.remove('drawer-open');
            this.isOpen = false;
        }
    }
}