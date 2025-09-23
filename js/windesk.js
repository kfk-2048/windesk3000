var loading = 0;
var curContextMenu = null;
var curIcon = null;
var whichIt = null;
var currentX = 0;
var currentY = 0;
var lastScrollX = 0;
var lastScrollY = 0;

function startClick(){
    var Istart = document.getElementById("Istart");
    var menul = document.getElementById("menul");
    
    if (Istart.className == "start") {
        Istart.className = "startdown";
        menul.style.display = "block";
        menufadeout();
    } else {
        menuhide();
    }
    if (event) event.stopPropagation();
}

function menufadeout(){
    var menul = document.getElementById("menul");
    var currentOpacity = parseFloat(menul.style.opacity) || 0;
    if (currentOpacity < 1) {
        menul.style.opacity = currentOpacity + 0.2;
        setTimeout(menufadeout, 1);
    }
}

function menuhide(){
    var Istart = document.getElementById("Istart");
    var menul = document.getElementById("menul");
    
    Istart.className = "start";
    menul.style.display = "none";
    menul.style.opacity = 0;
}

function showorhide(cname){
    var obj = document.getElementById(cname);
    if(obj.style.display == "none") 
        obj.style.display = 'block';
    else 
        obj.style.display = 'none';
}

function showTime(){
    var d = new Date();
    var s = d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
    document.getElementById("timediv").innerHTML = s;
    document.getElementById("timediv").title = d.getFullYear() + "年" + (d.getMonth()+1) + "月" + d.getDate() + "日";
    setTimeout(showTime, 10000);
}

function bodyclick(event){
    menuhide();
    if(curIcon) {
        curIcon.className = "icontext";
        var iconParent = curIcon.closest('[id^="floater"]');
        if (iconParent) {
            var iconImg = iconParent.querySelector('img');
            if (iconImg) iconImg.className = "";
        }
    }
    if (event) event.stopPropagation();
}

function iconClick(fnicon, event){
    if (event && event.detail > 1) return;
    if(curIcon) {
        curIcon.className = "icontext";
        var iconParent = curIcon.closest('[id^="floater"]');
        if (iconParent) {
            var iconImg = iconParent.querySelector('img');
            if (iconImg) iconImg.className = "";
        }
    }
    
    var iconTextA = fnicon.querySelector('a.icontext');
    if (iconTextA) {
        iconTextA.focus();
        iconTextA.className = "selecttxt";
    }
    
    var iconImg = fnicon.querySelector('img');
    if (iconImg) iconImg.className = "iconsel";
    
    curIcon = iconTextA;
    if (event) event.stopPropagation();
}

function grabIt(e) {
    e = e || window.event;
    whichIt = e.target;
    while (whichIt && whichIt.id.indexOf("floater") == -1) {
        whichIt = whichIt.parentElement;
        if (whichIt == null) { return true; }
    }

    if(curIcon) {
        var nowIcon = curIcon.closest('[id^="floater"]');
        if(nowIcon != whichIt) {
            if(curIcon.className == "selecttxt") {
                curIcon.className = "icontext";
                var iconImg = nowIcon.querySelector('img');
                if (iconImg) iconImg.className = "";
            }
        }
        else {
            var iconImg = nowIcon.querySelector('img');
            if (iconImg) iconImg.className = "iconmove";
        }
    }

    whichIt.style.left = whichIt.offsetLeft + "px";
    whichIt.style.top = whichIt.offsetTop + "px";
    currentX = (e.clientX + document.body.scrollLeft);
    currentY = (e.clientY + document.body.scrollTop);
    return true;
}

function moveIt(e) {
    e = e || window.event;
    if (whichIt == null) { return false; }
    newX = (e.clientX + document.body.scrollLeft);
    newY = (e.clientY + document.body.scrollTop);
    distanceX = (newX - currentX); 
    distanceY = (newY - currentY); 
    currentX = newX; 
    currentY = newY;
    
    whichIt.style.left = (parseInt(whichIt.style.left) + distanceX) + "px";
    whichIt.style.top = (parseInt(whichIt.style.top) + distanceY) + "px";
    
    if(parseInt(whichIt.style.top) < document.body.scrollTop) 
        whichIt.style.top = document.body.scrollTop + "px";
    if(parseInt(whichIt.style.left) < document.body.scrollLeft) 
        whichIt.style.left = document.body.scrollLeft + "px";
    if(parseInt(whichIt.style.left) > document.body.offsetWidth - document.body.scrollLeft - whichIt.offsetWidth) 
        whichIt.style.left = (document.body.offsetWidth - whichIt.offsetWidth) + "px";
    if(parseInt(whichIt.style.top) > document.body.offsetHeight + document.body.scrollTop - whichIt.offsetHeight - 5-26) 
        whichIt.style.top = (document.body.offsetHeight + document.body.scrollTop - whichIt.offsetHeight - 5-26) + "px";
    
    if(e.preventDefault) e.preventDefault();
    return false;
}

function dropIt() {
    whichIt = null;
    return true;
}

function displayMenu(e) {
    e = e || window.event;
    var whichDiv = e.target;
    var menu1;

    while (whichDiv && whichDiv.id != "startmenu" && whichDiv.className != "taskbtn") {
        whichDiv = whichDiv.parentElement;
        if (whichDiv == null) {
            whichDiv = e.target;
            break;
        }
    }

    if(whichDiv.id == "startmenu") 
        menu1 = document.getElementById("cmenustart");
    else if (whichDiv.className == "taskbtn") 
        menu1 = document.getElementById("cmenusys");
    else
        menu1 = document.getElementById("cmenudesk");

    if (curContextMenu != null) 
        curContextMenu.style.display = "none";
    
    menu1.style.left = e.clientX + "px";
    menu1.style.top = e.clientY + "px";
    
    if(e.clientY + menu1.offsetHeight > document.body.clientHeight) 
        menu1.style.top = (e.clientY - menu1.offsetHeight) + "px";
    if(e.clientX + menu1.offsetWidth > document.body.clientWidth) 
        menu1.style.left = (e.clientX - menu1.offsetWidth) + "px";
    
    menu1.style.display = "";
    curContextMenu = menu1;
    
    if(e.preventDefault) e.preventDefault();
    return false;
}

function switchMenu() {
    var el = event.target;
    if (el.className == "menuItem") {
        el.className = "highlightItem";
    } else if (el.className == "highlightItem") {
        el.className = "menuItem";
    }
}

function clickMenu() {
    var el = event.target;
    if (curContextMenu) {
        curContextMenu.style.display = "none";
    }
    
    if (el.id == "mnuRed") {
        whichDiv.style.backgroundColor = "red";
    } else if (el.id == "mnuGreen") {
        whichDiv.style.backgroundColor = "Green";
    } else if (el.id == "reicon") {
        for(var i = 0; i < 5; i++){
            var floater = document.getElementById("floater" + i);
            if (floater) {
                floater.style.left = "25px";
                floater.style.top = (i * 60 + 10) + "px";
            }
        }
    } else if (el.id == "winrefresh") {
        window.location.reload();   
    } else if (el.id == "condisplay") {
		openInnerWin("condisplay.htm", 420, 430, 600, 200, "显示属性", 0,"display");
		
    } else if (el.id == "mnuHelp") {
		openInnerWin("help.htm",395,250,600,200,"帮助",0,"help");
    } else if (el.id == "td") {
		openInnerWin("time.htm",395,280,800,200,"日期和时间",0,"time");
    }
    curContextMenu = null;
}

// 点击页面空白处关闭当前右键菜单，但点击菜单内部不关闭
document.addEventListener('mousedown', function (e) {
    if (!curContextMenu || curContextMenu.style.display === 'none') return;

    // 如果事件目标在菜单内部，就不关闭
    if (curContextMenu.contains(e.target)) return;

    curContextMenu.style.display = 'none';
    curContextMenu = null;
});

function openmypc(){

	openInnerWin("folder/mypc.htm",640,480,200,50,"我的电脑",1,"mypc");
}
function openmydoc(){
    openInnerWin("folder/document.htm",640,480,220,70,"我的文档",1,"mydoc");
}
function opennet(){
    openInnerWin("folder/favorite.htm",640,480,240,90,"网上邻居",1,"bm");
}
function openrecycle(){
    openInnerWin("folder/recycle.htm",640,480,260,110,"回收站",1,"rec");
}
function openie(){
    window.open("about:blank", "_blank");
}
function email(){
    window.open("mailto:10066601@qq.com", "_blank");
}

function ActiveCurWin(hWin){
    var curZindex = hWin.style.zIndex;
    for(var i = 1; i < 5; i++) {
        var o = document.getElementById("IfrmBox" + i);
        if(o && o.style.zIndex > curZindex) {
            o.style.zIndex = o.style.zIndex - 1;
            var child = o.querySelector('.backboxhead');
            if (child) child.className = "backboxhead";
        }
    }
    hWin.style.zIndex = 54;
    var head = hWin.querySelector('.boxhead');
    if (head) head.className = "boxhead";
    hWin.style.display = "";
}

function startlogout(){
    menuhide();
    var revalue = window.open("logout.htm", "_blank", "width=340,height=140,left=600,top=400");
    // Note: This won't actually return a value in modern browsers due to security restrictions
    // You would need to implement a different approach for cross-window communication
}

function totdstart() {
    openInnerWin("help.htm",395,250,600,200,"帮助",0,"help");
}

function totdinit() {
    totdstart();
}

function shake_xy(n) {
    if (window.moveBy) {
        for (var i = 10; i > 0; i--) {
            for (var j = n; j > 0; j--) {
                window.moveBy(0,i);
                window.moveBy(i,0);
                window.moveBy(0,-i);
                window.moveBy(-i,0);
            }
        }
    }
}

// Event listeners
document.addEventListener('mousedown', grabIt);
document.addEventListener('mousemove', moveIt);
document.addEventListener('mouseup', dropIt);
window.onerror = function() { return true; };