document.addEventListener('contextmenu', e => e.preventDefault());
// 排序功能实现
let currentSort = {
    column: -1,
    descending: false
};

document.addEventListener('DOMContentLoaded', function() {
    initSortTable();
    setupFileEvents();
});

function initSortTable() {
    window.arrowUp = document.createElement("SPAN");
    var tnUp = document.createTextNode("↓");
    window.arrowUp.appendChild(tnUp);
    window.arrowUp.className = "arrow";

    window.arrowDown = document.createElement("SPAN");
    var tnDown = document.createTextNode("↑");
    window.arrowDown.appendChild(tnDown);
    window.arrowDown.className = "arrow";
}

function setupFileEvents() {
    // 为所有文件行添加点击事件
    var fileRows = document.querySelectorAll('td[data-path]');
    fileRows.forEach(function(td) {
        td.addEventListener('click', function(e) {
            myfile(e);
        });
    });
}

function sortColumn(event, columnIndex, dataType) {
    const table = document.getElementById('fileTable');
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const headerCells = table.querySelectorAll('thead tr td');
    
    // 清除之前的排序指示器
    headerCells.forEach(cell => {
        cell.querySelectorAll('.arrow').forEach(arrow => {
            arrow.remove();
        });
    });
    
    // 确定排序方向
    let descending = false;
    if (currentSort.column === columnIndex) {
        descending = !currentSort.descending;
    } else {
        descending = false;
    }
    
    // 更新当前排序状态
    currentSort.column = columnIndex;
    currentSort.descending = descending;
    
    // 添加排序指示器
    const sortIndicator = descending ? window.arrowDown.cloneNode(true) : window.arrowUp.cloneNode(true);
    event.currentTarget.appendChild(sortIndicator);
    
    // 对行进行排序
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        let comparison = 0;
        
        if (dataType === 'Number') {
            // 提取数字部分进行比较
            const aNum = extractNumber(aValue);
            const bNum = extractNumber(bValue);
            comparison = aNum - bNum;
        } else if (dataType === 'Date') {
            // 日期比较
            const aDate = parseDate(aValue);
            const bDate = parseDate(bValue);
            comparison = aDate - bDate;
        } else {
            // 文本比较
            comparison = aValue.localeCompare(bValue, 'zh-CN');
        }
        
        return descending ? -comparison : comparison;
    });
    
    // 重新添加排序后的行
    rows.forEach(row => tbody.appendChild(row));
}

function extractNumber(text) {
    // 从文本中提取数字（移除逗号等非数字字符）
    const numStr = text.replace(/[^\d.]/g, '');
    return parseFloat(numStr) || 0;
}

function parseDate(dateStr) {
    // 解析多种日期格式
    const patterns = [
        /(\d{4})-(\d{1,2})-(\d{1,2})/,
        /(\d{1,2}):(\d{1,2}) (\d{4})-(\d{1,2})-(\d{1,2})/,
        /(\d{4})\/(\d{1,2})\/(\d{1,2})/
    ];
    
    for (const pattern of patterns) {
        const match = dateStr.match(pattern);
        if (match) {
            let year, month, day;
            
            if (match.length >= 4) {
                year = parseInt(match[1]);
                month = parseInt(match[2]) - 1;
                day = parseInt(match[3]);
                
                // 处理带有时间的格式
                if (match.length >= 6) {
                    year = parseInt(match[3]);
                    month = parseInt(match[4]) - 1;
                    day = parseInt(match[5]);
                }
                
                return new Date(year, month, day).getTime();
            }
        }
    }
    
    // 如果无法解析，返回0
    return 0;
}

// 其余的文件预览功能保持不变
function myfile(event) {
    var o = event.currentTarget;
    var path = o.getAttribute('data-path');
    var ffname = o.getAttribute('data-fname');
    var altt = o.getAttribute('data-al') || '';
    var ftype = o.getAttribute('data-type');
    var ext = o.getAttribute('data-ext');
    var size = o.getAttribute('data-size');
    
    document.getElementById('fname').innerHTML = '<b>' + ffname + '.' + ext + '</b><br>' + ftype;
    document.getElementById('txt').innerHTML = "<a href='" + path + "' target='_blank' style='color:black'>下载文件</a>";

    
    var preview = document.getElementById('Preview');
    
    if (isSoundFile(ext)) {
        preview.innerHTML = '<audio controls style="width:195px; height:45px;">' +
                            '<source src="' + path + '" type="audio/' + getAudioType(ext) + '">' +
                            '您的浏览器不支持音频播放' +
                            '</audio>';
    } else if (isMovieFile(ext)) {
        preview.innerHTML = '<video controls style="width:195px; height:236px;">' +
                            '<source src="' + path + '" type="video/' + getVideoType(ext) + '">' +
                            '您的浏览器不支持视频播放' +
                            '</video>';
    } else if (isrmFile(ext)) {
        preview.innerHTML = '<div style="padding:10px; background:#eee;">RM格式文件需要特定播放器<br>' +
                            '<a href="https://www.real.com/" style="color:blue">下载播放器</a></div>';
    } else if (isimgFile(ext)) {
        preview.innerHTML = '<div style="background-color: #efffff; border: 0 solid #000080; padding: 2px">' +
                            '<p align=center><img width="150" alt="' + altt + '" src="' + path + '"></div>' +
                            '<div style="background-color: #FFFFE1; border: 0; padding: 2px">' + altt + '</div>';
    } else if (isappFile(ext)) {
        preview.innerHTML = '程序文件：大小:' + size;
    } else if (isflashFile(ext)) {
        preview.innerHTML = '<div style="padding:10px; background:#eee;">Flash内容需要插件支持<br>' +
                            '<a href="https://www.flash.cn/" style="color:blue">下载插件</a></div>';
    } else if (ext === 'folder') {
        preview.innerHTML = '<div style="padding:10px; background:#eee;">文件夹: ' + ffname + '<br>';
    } else {
        preview.innerHTML = '<div style="background-color: #EEEEEE; border: 0px; table-layout:fixed; word-break:break-all; padding:10px">' + 
                            '文件类型: ' + ftype + '<br>文件大小: ' + size + '<br><br>' + altt + '...</div>';
    }
}

// 辅助函数
function isSoundFile(ext) {
    var types = ["aif", "aiff", "au", "mid", "midi", "rmi", "snd", "wav", "mp3", "m3u", "wma"];
    return types.indexOf(ext.toLowerCase()) > -1;
}

function isimgFile(ext) {
    var types = ["jpg", "jpeg", "bmp", "gif", "png"];
    return types.indexOf(ext.toLowerCase()) > -1;
}

function isMovieFile(ext) {
    var types = ["asf", "avi", "m1v", "mov", "mp2", "mpa", "mpe", "mpeg", "mpg", "mpv2", "qt", "asx", "wmv", "mp4"];
    return types.indexOf(ext.toLowerCase()) > -1;
}

function isrmFile(ext) {
    var types = ["rm", "ram", "ra"];
    return types.indexOf(ext.toLowerCase()) > -1;
}

function isflashFile(ext) {
    return ext.toLowerCase() === "swf";
}

function isappFile(ext) {
    var types = ["exe", "com", "rar", "zip"];
    return types.indexOf(ext.toLowerCase()) > -1;
}

function getAudioType(ext) {
    if (ext === "mp3") return "mpeg";
    if (ext === "wav") return "wav";
    return ext;
}

function getVideoType(ext) {
    if (ext === "mp4") return "mp4";
    if (ext === "mov") return "quicktime";
    return ext;
}

function halt() {
    document.getElementById('fname').innerText = '';
    document.getElementById('Preview').innerHTML = '<div style="color: #888; text-align: center; padding: 20px;">选定项目查看说明！</div>';
    document.getElementById('txt').innerText = '选定项目查看说明！';
    document.getElementById('al').innerText = '';
}