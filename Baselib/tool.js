//跨浏览器检测
(function () {
    window.sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/msie([\d.]+)/)) ? sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
            (s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
                (s = ua.match(/opera\/.*version\/([\d.]+)/)) ? sys.opera = s[1] :
                    (s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;
    if (/webkit/.test(ua)) sys.webkit = ua.match(/webkit\/([\d.]+)/)[1];
})();

//DOM加载
function addDomLoaded(fn) {
    var isReady = false;
    var timer = null;
    function doReady(fn) {
        if (timer) clearInterval(timer);
        if (isReady) return;
        isReady = true;
        fn();
    }

    if (document.addEventListener) { //w3c
        addEvent(document, 'DOMContentLoaded', function () {
            fn();
            removeEvent(document, 'DOMContentLoaded', arguments.callee);
        });
    } else if ((sys.opera && sys.opera < 9) || (sys.firefox && sys.firefox < 3)) {
        timer = setInterval(function () {
            if (/loaded | complete /.test(document.readyState)) {
                doReady(fn);
            }
        }, 1);
    }
}

//跨浏览器获取视窗大小
function getInner() {
    if (typeof window.innerWidth != 'undefined') {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    } else {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }
    }
}

//跨浏览器获取滚动条位置
function getScroll() {
    return {
        top: document.body.scrollTop || document.documentElement.scrollTop,
        left: document.body.scrollLeft || document.documentElement.scrollLeft
    }
}

//跨浏览器获取Style
function getStyle(element, attr) {
    var value;
    if (typeof window.getComputedStyle != 'undefined') {//w3c
        value = window.getComputedStyle(element, null)[attr];
    } else if (typeof element.currentStyle != 'undefined') {//ie
        value = element.currentStyle[attr];
    }
    return value;
}

//判断class是否存在
function hasClass(element, className) {
    return element.className.match(
        new RegExp('(\\s|^)' + className + '(\\s|$)'));
}

//跨浏览器获取innerText
function getInnerText(element) {
    return (typeof element.textContent == 'string') ? element.textContent : element.innerText;
}
//跨浏览器设置innerText
function setInnerText(element, str) {
    if (typeof element.textContent == 'string') {
        element.textContent = str;
    } else {
        element.innerText = str;
    }
}

//跨浏览器添加link规则
function insertRule(sheet, selectorText, cssText, position) {
    if (typeof sheet.insertRule != 'undefined') {//w3c
        sheet.inertRule(selectorText + '{' + cssText + '}', position);
    } else if (typeof sheet.addRule != 'undefined') {//ie
        sheet.addRule(selectorText, cssText, position);
    }
}
//跨浏览器移除link规则
function deleteRule(sheet, index) {
    if (typeof sheet.removeRule != 'undefined') {//ie
        sheet.removeRule(index);
    } else if (typeof sheet.deleteRule != 'undefined') {//w3c
        sheet.deleteRule(index);
    }
}

//跨浏览器获取event对象
function getEvent(event) {
    return event || window.event;
}

//跨浏览器阻止默认行为
function preDef(evt) {
    var e = evt || window.event;
    if (e.preventDefault) {//w3c
        e.preventDefault();
    } else {//ie
        e.returnValue = false;
    }
}

//跨浏览器添加事件
function addEvent(obj, type, fn) {
    if (obj.addEventListener) {//w3c
        obj.addEventListener(type, fn, false);
    } else {//ie
        //创建存放事件的哈希表
        if (!obj.events) {
            obj.events = {};
        }
        //第一次执行，创建一个存放事件处理函数的数组
        if (!obj.events[type]) {
            obj.events[type] = [];
            //第一个事件处理函数存在第一个位置
            if (obj['on' + type]) {
                obj.events[type][0] = fn;
            } else {
                if (addEvent.equal(obj.events[type], fn)) {
                    return false;
                }
            }
        }
        obj.events[type][addEvent.ID++] = fn;
        //执行事件处理函数
        obj['on' + type] = addEvent.exec;
    }
}

//为事件分配计数器
addEvent.ID = 1;
//执行事件处理函数
addEvent.exec = function (event) {
    var e = event || addEvent.fixEvent(window.event);
    for (var i in this.events[e.type]) {
        this.events[e.type][i].call(this, e);
    }
}
//相同的注册函数屏蔽
addEvent.equal = function (es, fn) {
    for (var i in es) {
        if (es[i] == fn) {
            return true;
        }
    }
    return false;
}
//把ie常用的event对象配对到w3c
addEvent.fixEvent = function (event) {
    event.preventDefault = addEvent.fixEvent.preventDefault;
    event.stopPropagation = addEvent.fixEvent.stopPropagation;
    event.target = event.srcElement;
    return event;
};
//ie阻止默认行为
addEvent.fixEvent.preventDefault = function () {
    this.returnValue = false;
};
//ie取消冒泡
addEvent.fixEvent.stopPropagation = function () {
    this.cancelBubble = true;
};

//跨浏览器移除事件
function removeEvent(obj, type, fn) {
    if (obj.removeEventListener) {
        obj.removeEventListener(type, fn, false);
    } else {
        if (obj.events) {
            for (var i in obj.events[type]) {
                if (obj.events[type][i] == fn) {
                    delete obj.events[type][i];
                }
            }
        }
    }
}

//判断数组中是否有某个值
function isInArray(array, value) {
    for (var i in array) {
        if (array[i] == value) {
            return true;
        }
    }
    return false;
}
//获取某个元素到最外层顶点的距离
function offsetTop(element) {
    var top = element.offsetTop;
    var parent = element.offsetParent;
    while (parent != null) {
        top += parent.offsetTop;
        parent = parent.offsetParent;
    }
    return top;
}

//删除左右空格
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}



//获取某个节点的上一个同级节点的下标
function prevIndex(current, parent) {
    var length = parent.children.length;
    if (current == 0) {
        return length - 1;
    }
    return parseInt(current) - 1;
}
//获取摸个节点的下一个同级节点的下标
function nextIndex(current, parent) {
    var length = parent.children.length;
    if (current == length - 1) {
        return 0;
    }
    return parseInt(current) + 1;
}