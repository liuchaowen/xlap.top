/**
 * 用于根据浏览器语言自动重定向到正确语言版本的JSON文件
 */
(function () {
    // 获取请求的URL
    const url = window.location.pathname;

    // 检查是否是JSON文件请求
    if (url.endsWith('movie.json') || url.endsWith('music.json')) {
        // 获取文件名
        const fileName = url.split('/').pop();

        // 获取浏览器语言
        let lang = navigator.language || navigator.userLanguage;

        // 支持的语言列表
        const supportedLanguages = ['zh-CN', 'zh-TW', 'en', 'ko', 'th'];

        // 查找匹配的语言
        let matchedLang = null;
        for (const supportedLang of supportedLanguages) {
            if (lang.startsWith(supportedLang.split('-')[0])) {
                // 找到匹配的语言代码
                matchedLang = supportedLang;
                break;
            }
        }

        // 如果没有匹配的语言，使用默认语言
        if (!matchedLang) {
            matchedLang = 'zh-CN';
        }

        // 构建重定向URL
        const redirectUrl = `/assets/data/json/${matchedLang}/${fileName}`;

        // 重定向
        window.location.href = redirectUrl;
    }
})();