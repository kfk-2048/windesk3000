/* innerwin.js — 多窗口/复用/可拖拽/可缩放/内部close/随机z70-90/置顶 */
(() => {
    /* 全局计数器：确保永远递增，用于置顶 */
    window._iwZCounter = window._iwZCounter || 90;

    /* 名称 → 节点 缓存 */
    const cache = window._iwCache = window._iwCache || {};

    window.openInnerWin = function (url, w, h, left, top, title, allowResize = 1, name = '') {
        /* 若同名窗口已存在，仅置顶并返回 */
        if (name && cache[name]) {
            cache[name].style.zIndex = ++window._iwZCounter;
            return;
        }

        /* 随机 70-90 的基准值 */
        const zBase = 70 + Math.floor(Math.random() * 21);

        /* 外壳 */
        const win = document.createElement('div');
        win.style.cssText =
            `position:fixed;left:${left}px;top:${top}px;width:${w}px;height:${h}px;
             border:2px solid;border-color:#fff #808080 #808080 #fff;background:#d4d0c8;z-index:${zBase};overflow:hidden;` +
            (allowResize ? 'resize:both;' : 'resize:none;');

        /* 标题栏 */
        const bar = document.createElement('div');
        bar.style.cssText =
            'height:18px;background:linear-gradient(to right, #0a246a, #a5c9ef);cursor:move;display:flex;justify-content:space-between;padding:0 4px';
        bar.innerHTML =
            `<span style="font:12px/18px sans-serif">${title}</span>` +
            `<span style="cursor:pointer;font:12px/18px sans-serif" class="closeBtn">×</span>`;
        win.appendChild(bar);

        /* iframe */
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.cssText = 'width:100%;height:calc(100% - 18px);border:0';
        win.appendChild(iframe);

        document.body.appendChild(win);

        /* 统一移除：DOM + 缓存 */
        const removeWin = () => {
            if (win.parentNode) document.body.removeChild(win);
            if (name) delete cache[name];
        };

        /* 关闭按钮 */
        bar.querySelector('.closeBtn').onclick = removeWin;

        /* 让内部 window.close() / postMessage('close') 生效 */
        iframe.onload = () => {
            try { iframe.contentWindow.close = removeWin; } catch (_) {}
        };
        const msgHandler = (e) => {
            if (e.data === 'close' && e.source === iframe.contentWindow) removeWin();
        };
        window.addEventListener('message', msgHandler);

        /* 拖拽，限制在视口内 */
        let dx, dy, dragging = false;
        bar.onmousedown = (e) => {
            dragging = true;
            /* 置顶：保证最前 */
            win.style.zIndex = ++window._iwZCounter;
            dx = e.clientX - win.offsetLeft;
            dy = e.clientY - win.offsetTop;
            window.addEventListener('mousemove', moveHandler, true);
            window.addEventListener('mouseup', upHandler, true);
        };
        function moveHandler(e) {
            if (!dragging) return;
            const nx = e.clientX - dx;
            const ny = e.clientY - dy;
            const maxX = innerWidth - win.offsetWidth;
            const maxY = innerHeight - win.offsetHeight;
            win.style.left = Math.max(0, Math.min(nx, maxX)) + 'px';
            win.style.top  = Math.max(0, Math.min(ny, maxY)) + 'px';
        }
        function upHandler() {
            dragging = false;
            window.removeEventListener('mousemove', moveHandler, true);
            window.removeEventListener('mouseup', upHandler, true);
        }

        /* 记录到缓存 */
        if (name) cache[name] = win;
    };
})();