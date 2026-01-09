// 检测用户是否在中国，自动切换CDN
(function() {
    // 检测用户是否可能在中国
        const userLang = navigator.language || navigator.userLanguage;
        if (userLang.includes('zh') || userLang.includes('CN')) {
            return true;
        }
        
    // 替换资源为国内CDN
    function replaceWithChinaCDN() {
        console.log('🇨🇳 检测到中国用户，启用国内CDN加速');
        
        // 替换所有 script 标签
        document.querySelectorAll('script[src]').forEach(script => {
            const src = script.src;
            
            // Wavesurfer.js
            if (src.includes('wavesurfer.js')) {
                script.src = 'https://cdn.staticfile.org/wavesurfer.js/7.8.8/wavesurfer.min.js';
            }
            
            // jQuery
            if (src.includes('jquery')) {
                script.src = 'https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js';
            }
        });
        
        // 替换所有 link 标签
        document.querySelectorAll('link[href]').forEach(link => {
            const href = link.href;
            
            // Font Awesome
            if (href.includes('font-awesome')) {
                link.href = 'https://cdn.staticfile.org/font-awesome/6.4.0/css/all.min.css';
            }
            
            // Google Fonts
            if (href.includes('fonts.googleapis.com')) {
                link.href = href.replace('fonts.googleapis.com', 'fonts.googleapis.cn');
            }
        });
    }
    
    // 页面加载后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (isLikelyInChina()) {
                replaceWithChinaCDN();
            }
        });
    } else {
        if (isLikelyInChina()) {
            replaceWithChinaCDN();
        }
    }
})();