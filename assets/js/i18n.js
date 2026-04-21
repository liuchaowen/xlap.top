/**
 * 多语言支持模块
 * 支持的语言：简体中文(zh-CN)、繁体中文(zh-TW)、英文(en)、韩文(ko)、泰文(th)
 */

class I18nManager {
    constructor() {
        // 支持的语言列表
        this.supportedLanguages = [
            { code: 'zh-CN', name: '简体中文' },
            { code: 'zh-TW', name: '繁體中文' },
            { code: 'en', name: 'English' },
            { code: 'ko', name: '한국어' },
            { code: 'th', name: 'ภาษาไทย' }
        ];

        // 默认语言
        this.defaultLanguage = 'zh-CN';

        // 当前语言
        this.currentLanguage = this.getSavedLanguage() || this.getBrowserLanguage() || this.defaultLanguage;

        // 翻译文本映射
        this.translations = {
            'zh-CN': {
                'site-title': 'XLAP.TOP - 张国荣·顶级',
                'subtitle': '张国荣·顶级',
                'quote': '我就是我，是颜色不一样的烟火',
                'memorial': '永远怀念 • Forever in Our Hearts',
                'movies': '电影',
                'browser-not-support': '您的浏览器不支持视频标签。',
                'play-video': '点击播放背景视频',
                'language': '语言'
            },
            'zh-TW': {
                'site-title': 'XLAP.TOP - 張國榮·頂級',
                'subtitle': '張國榮·頂級',
                'quote': '我就是我，是顏色不一樣的煙火',
                'memorial': '永遠懷念 • Forever in Our Hearts',
                'movies': '電影',
                'browser-not-support': '您的瀏覽器不支持視頻標籤。',
                'play-video': '點擊播放背景視頻',
                'language': '語言'
            },
            'en': {
                'site-title': 'XLAP.TOP - Leslie Cheung',
                'subtitle': 'Leslie Cheung',
                'quote': 'I am who I am, a firework with different colors',
                'memorial': 'In Loving Memory • Forever in Our Hearts',
                'movies': 'Movies',
                'browser-not-support': 'Your browser does not support the video tag.',
                'play-video': 'Click to play background video',
                'language': 'Language'
            },
            'ko': {
                'site-title': 'XLAP.TOP - 장국영',
                'subtitle': '장국영',
                'quote': '나는 나 자신, 색다른 불꽃이다',
                'memorial': '영원히 기억하며 • Forever in Our Hearts',
                'movies': '영화',
                'browser-not-support': '브라우저가 비디오 태그를 지원하지 않습니다.',
                'play-video': '배경 비디오 재생하기',
                'language': '언어'
            },
            'th': {
                'site-title': 'XLAP.TOP - เหลียวจื้อหง',
                'subtitle': 'เหลียวจื้อหง',
                'quote': 'ฉันเป็นตัวของฉันเอง เป็นดอกไม้ไฟที่มีสีสันต่างจากคนอื่น',
                'memorial': 'รำลึกถึงตลอดไป • Forever in Our Hearts',
                'movies': 'ภาพยนตร์',
                'browser-not-support': 'เบราว์เซอร์ของคุณไม่รองรับแท็กวิดีโอ',
                'play-video': 'คลิกเพื่อเล่นวิดีโอพื้นหลัง',
                'language': 'ภาษา'
            }
        };

        // 初始化
        this.init();
    }

    /**
     * 初始化多语言支持
     */
    init() {
        // 设置当前语言
        this.setLanguage(this.currentLanguage, false);

        // 创建语言切换器
        this.createLanguageSwitcher();
    }

    /**
     * 获取浏览器语言
     * @returns {string} 语言代码
     */
    getBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;

        // 检查是否支持该语言
        const langCode = browserLang.split('-')[0];
        const supportedCodes = this.supportedLanguages.map(lang => lang.code.split('-')[0]);

        if (supportedCodes.includes(langCode)) {
            // 寻找匹配的完整语言代码
            const matchedLang = this.supportedLanguages.find(lang =>
                lang.code.startsWith(langCode)
            );

            return matchedLang ? matchedLang.code : null;
        }

        return null;
    }

    /**
     * 获取保存的语言设置
     * @returns {string} 语言代码
     */
    getSavedLanguage() {
        return localStorage.getItem('xlaptop-language');
    }

    /**
     * 保存语言设置
     * @param {string} langCode 语言代码
     */
    saveLanguage(langCode) {
        localStorage.setItem('xlaptop-language', langCode);
    }

    /**
     * 设置当前语言
     * @param {string} langCode 语言代码
     * @param {boolean} reload 是否重新加载数据
     */
    setLanguage(langCode, reload = true) {
        // 验证语言代码是否支持
        if (!this.supportedLanguages.some(lang => lang.code === langCode)) {
            console.error('不支持的语言代码:', langCode);
            langCode = this.defaultLanguage;
        }

        // 更新当前语言
        this.currentLanguage = langCode;

        // 保存语言设置
        this.saveLanguage(langCode);

        // 更新页面文本
        this.updatePageText();

        // 更新 HTML lang 属性
        document.documentElement.lang = langCode;

        // 高亮当前语言选项
        this.updateLanguageSwitcher();

        // 如果需要重新加载数据
        if (reload) {
            // 触发自定义事件通知其他组件
            const event = new CustomEvent('languageChanged', { detail: { language: langCode } });
            document.dispatchEvent(event);
        }
    }

    /**
     * 更新页面文本
     */
    updatePageText() {
        const translations = this.translations[this.currentLanguage];

        // 更新页面标题
        document.title = translations['site-title'];

        // 更新副标题
        const subtitleEl = document.querySelector('.subtitle');
        if (subtitleEl) subtitleEl.textContent = translations['subtitle'];

        // 更新名言
        const quoteEl = document.querySelector('.quote');
        if (quoteEl) quoteEl.textContent = translations['quote'];

        // 更新纪念文字
        const memorialEl = document.querySelector('.footer p');
        if (memorialEl) memorialEl.textContent = translations['memorial'];

        // 更新电影抽屉标题
        const moviesHeaderEl = document.querySelector('.drawer-header h3');
        if (moviesHeaderEl) moviesHeaderEl.textContent = translations['movies'];

        // 更新不支持视频文本
        const videoFallbackEl = document.querySelector('#bgVideo + span');
        if (videoFallbackEl) videoFallbackEl.textContent = translations['browser-not-support'];

        // 更新播放提示文本
        const playPromptEl = document.querySelector('.play-prompt p');
        if (playPromptEl) playPromptEl.textContent = translations['play-video'];
    }

    /**
     * 创建语言切换器
     */
    createLanguageSwitcher() {
        // 创建语言切换器容器
        const langSwitcher = document.createElement('div');
        langSwitcher.className = 'language-switcher';

        // 创建语言标签
        const langLabel = document.createElement('span');
        langLabel.className = 'lang-label';
        langLabel.textContent = this.translations[this.currentLanguage]['language'];

        // 创建下拉容器
        const dropdown = document.createElement('div');
        dropdown.className = 'lang-dropdown';

        // 创建语言列表
        const langList = document.createElement('ul');
        langList.className = 'lang-list';

        // 添加支持的语言
        this.supportedLanguages.forEach(lang => {
            const langItem = document.createElement('li');
            langItem.setAttribute('data-lang', lang.code);
            langItem.className = 'lang-item';
            if (lang.code === this.currentLanguage) {
                langItem.classList.add('active');
            }
            langItem.textContent = lang.name;

            // 添加点击事件
            langItem.addEventListener('click', () => {
                this.setLanguage(lang.code);
            });

            langList.appendChild(langItem);
        });

        // 组装语言切换器
        dropdown.appendChild(langList);
        langSwitcher.appendChild(langLabel);
        langSwitcher.appendChild(dropdown);

        // 添加到页面
        document.body.appendChild(langSwitcher);

        // 添加点击事件，显示/隐藏下拉菜单
        langLabel.addEventListener('click', () => {
            dropdown.classList.toggle('show');
        });

        // 点击页面其他位置关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!langSwitcher.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    }

    /**
     * 更新语言切换器高亮状态
     */
    updateLanguageSwitcher() {
        const langItems = document.querySelectorAll('.lang-item');
        const langLabel = document.querySelector('.lang-label');

        // 更新语言标签文本
        if (langLabel) {
            langLabel.textContent = this.translations[this.currentLanguage]['language'];
        }

        // 更新高亮状态
        langItems.forEach(item => {
            const itemLang = item.getAttribute('data-lang');
            if (itemLang === this.currentLanguage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    /**
     * 获取当前语言
     * @returns {string} 当前语言代码
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * 获取数据文件路径
     * @param {string} baseFileName 基础文件名
     * @returns {string} 带语言路径的文件路径
     */
    getLocalizedFilePath(baseFileName) {
        return `assets/data/json/${this.currentLanguage}/${baseFileName}`;
    }

    /**
     * 翻译文本
     * @param {string} key 翻译键
     * @returns {string} 翻译后的文本
     */
    translate(key) {
        const translations = this.translations[this.currentLanguage];
        return translations[key] || key;
    }
}

// 创建全局单例
window.i18n = new I18nManager();