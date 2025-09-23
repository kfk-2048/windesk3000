// 音乐播放器变量
let audioPlayer;
let lrcData = [];
let currentLine = 0;

// 初始化播放器
function initPlayer() {
    const playerHTML = `
        <div style="position: relative;">
            <!-- 隐藏的音频控件 -->
            <audio id="audioPlayer" style="display: none;"></audio>
            
            <!-- 歌曲信息 -->
            <div id="songInfo" style="text-align: center; margin-bottom: 10px;"></div>
            
            <!-- 进度条 -->
            <div class="progress-container" id="progressContainer">
                <div class="progress-bar" id="progressBar"></div>
            </div>
            
            <!-- 时间显示 -->
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span id="currentTime">0:00</span>
                <span id="duration">0:00</span>
            </div>
            
            <!-- 歌词容器 -->
            <div id="lyricsContainer">
                <div id="lrclina" class="lyric-line"></div>
                <div id="lrclinb" class="current-line"></div>
                <div id="lrclinc" class="lyric-line"></div>
            </div>
            
            <!-- 控制按钮
            <div style="display: flex; justify-content: center; margin-top: 10px;">
                <button class="butt" onclick="playPause()">播放/暂停</button>
                <button class="butt" onclick="changeVolume(0.1)" style="margin: 0 5px;">音量+</button>
                <button class="butt" onclick="changeVolume(-0.1)">音量-</button>
            </div> -->
        </div>
    `;
    
    document.getElementById('dplay').innerHTML = playerHTML;
    audioPlayer = document.getElementById('audioPlayer');
    
    // 设置音频源
    audioPlayer.src = '../media/sound.mp3';
    
    // 自动播放 (注意: 现代浏览器可能会阻止自动播放)
    audioPlayer.autoplay = true;
    const playPromise = audioPlayer.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            // 自动播放被阻止，显示播放按钮
            console.log('自动播放被阻止:', error);
            document.querySelector('#dplay button').textContent = '点击播放';
        });
    }
    
    // 事件监听器
    audioPlayer.addEventListener('timeupdate', updatePlayer);
    audioPlayer.addEventListener('loadedmetadata', function() {
        document.getElementById('duration').textContent = formatTime(audioPlayer.duration);
    });
    
    document.getElementById('progressContainer').addEventListener('click', function(e) {
        const percent = e.offsetX / this.offsetWidth;
        audioPlayer.currentTime = percent * audioPlayer.duration;
    });
    
    // 初始化歌词
    initLyrics();
}

// 初始化歌词
function initLyrics() {
    const lrctxt = document.getElementById('lyricsSource').value;
    const lines = lrctxt.split('\n');
    lrcData = [];
    
    // 解析歌曲信息
    const titleMatch = /\[ti:(.+)\]/i.exec(lrctxt);
    const artistMatch = /\[ar:(.+)\]/i.exec(lrctxt);
    
    if (titleMatch && artistMatch) {
        document.getElementById('songInfo').textContent = `${titleMatch[1]} - ${artistMatch[1]}`;
    }
    
    // 解析歌词时间戳
    for (const line of lines) {
        const timeMatches = line.matchAll(/\[(\d+):(\d+)\.(\d+)\]/g);
        const text = line.replace(/\[.*?\]/g, '').trim();
        
        if (!text) continue;
        
        for (const match of timeMatches) {
            const minutes = parseInt(match[1]);
            const seconds = parseInt(match[2]);
            const hundredths = parseInt(match[3]);
            const time = minutes * 60 + seconds + hundredths / 100;
            
            lrcData.push({
                time: time,
                text: text
            });
        }
    }
    
    // 按时间排序歌词
    lrcData.sort((a, b) => a.time - b.time);
}

// 更新播放器状态
function updatePlayer() {
    // 更新进度条
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    
    // 更新时间显示
    document.getElementById('currentTime').textContent = formatTime(audioPlayer.currentTime);
    
    // 更新歌词
    updateLyrics();
}

// 格式化时间显示
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// 更新歌词显示
function updateLyrics() {
    const currentTime = audioPlayer.currentTime;
    
    // 查找当前歌词行
    let newLine = 0;
    for (let i = 0; i < lrcData.length; i++) {
        if (lrcData[i].time <= currentTime) {
            newLine = i;
        } else {
            break;
        }
    }
    
    if (newLine !== currentLine) {
        currentLine = newLine;
        
        // 更新歌词显示
        document.getElementById('lrclinb').textContent = lrcData[currentLine]?.text || '';
        document.getElementById('lrclina').textContent = currentLine > 0 ? lrcData[currentLine - 1]?.text : '';
        document.getElementById('lrclinc').textContent = currentLine < lrcData.length - 1 ? lrcData[currentLine + 1]?.text : '';
        
        // 自动滚动到当前歌词
        const lyricsContainer = document.getElementById('lyricsContainer');
        const currentLineElement = document.getElementById('lrclinb');
        lyricsContainer.scrollTop = currentLineElement.offsetTop - lyricsContainer.offsetHeight / 3;
    }
}

// 播放/暂停控制
function playPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
}

// 音量控制
function changeVolume(change) {
    audioPlayer.volume = Math.min(1, Math.max(0, audioPlayer.volume + change));
}

// 显示/隐藏播放器
function togglePlayer() {
    const player = document.getElementById('mylrcplayck');
    player.style.display = player.style.display === 'none' ? 'block' : 'none';
}

// 页面加载时初始化播放器
window.onload = function() {
    initPlayer();
    
    // 默认显示播放器
    document.getElementById('mylrcplayck').style.display = 'block';
};