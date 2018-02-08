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

//跨浏览器获取Style
function getStyle(element, attr) {
    if (typeof window.getComputedStyle != 'undefined') {//w3c
        return window.getComputedStyle(element, null)[attr];
    } else if (typeof element.currentStyle != 'undefined') {//ie
        return element.currentStyle[attr];
    }
}

//判断class是否存在
function hasClass(element, className) {
    return element.className.match(
        new RegExp('(\\s|^)' + className + '(\\s|$)'));
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
//删除左右空格
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}
//滚动条清零
function scrollTop() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}
