// 检测用户是否在中国，自动切换CDN
(function() {

    function isLikelyInChina() {
        const userLang = navigator.language || navigator.userLanguage;
        return userLang.includes('zh') || userLang.includes('CN');
    }

    function replaceWithChinaCDN() {
        console.log('🇨🇳 检测到中国用户，启用国内CDN加速');

        // 替换所有 script 标签
        document.querySelectorAll('script[src]').forEach(script => {
            const src = script.src;

            if (src.includes('wavesurfer.js')) {
                script.src = 'https://cdn.staticfile.org/wavesurfer.js/7.8.8/wavesurfer.min.js';
            }

            if (src.includes('jquery')) {
                script.src = 'https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js';
            }
        });

        // 替换所有 link 标签
        document.querySelectorAll('link[href]').forEach(link => {
            const href = link.href;

            if (href.includes('font-awesome')) {
                link.href = 'https://cdn.staticfile.org/font-awesome/6.4.0/css/all.min.css';
            }

            if (href.includes('fonts.googleapis.com')) {
                link.href = href.replace('fonts.googleapis.com', 'fonts.googleapis.cn');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (isLikelyInChina()) replaceWithChinaCDN();
        });
    } else {
        if (isLikelyInChina()) replaceWithChinaCDN();
    }

})();
