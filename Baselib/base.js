
//前台调用
var $ = function (args) {
    return new Base(args);
}
//封装库的核心对象
function Base(args) {
    //存储节点对象的数组
    this.elements = [];

    if (typeof args == 'string') {//在构造方法中根据字符串获取节点对象
        //适应Css的模拟
        if (args.indexOf(' ') != -1) {
            var elements = args.split(' ');//拆分字符串保存至数组，作为节点名
            var childElements = [];         //存放临时节点对象,防止被覆盖
            var node = [];                  //存放父节点
            for (var i = 0; i < elements.length; i++) {
                if (node.length == 0) {
                    node.push(document);//无父节点时默认为document
                }
                switch (elements[i].charAt(0)) {
                    case '#':
                        childElements = [];   //清理临时数组，以使父节点失效
                        childElements.push(this.getId(elements[i].substring(1)));
                        node = childElements; //保存父节点
                        break;
                    case '.':
                        childElements = [];
                        for (var j = 0; j < node.length; j++) {
                            var temps = this.getClass(elements[i].substring(1), node[j]);
                            for (var k = 0; k < temps.length; k++) {
                                childElements.push(temps[k]);
                            }
                        }
                        node = childElements;
                        break;
                    default:
                        childElements = [];
                        for (var j = 0; j < node.length; j++) {
                            var temps = this.getTagName(elements[i], node[j]);
                            for (var k = 0; k < temps.length; k++) {
                                childElements.push(temps[k]);
                            }
                        }
                        node = childElements;
                        break;
                }
            }
            this.elements = childElements;
        } else {
            //适应find方法的模拟
            switch (args.charAt(0)) {
                case '#':
                    this.elements.push(this.getId(args.substring(1)));
                    break;
                case '.':
                    this.elements = this.getClass(args.substring(1));
                    break;
                default:
                    this.elements = this.getTagName(args);
                    break;
            }
        }
    } else if (typeof args == 'object') {
        if (args != undefined) {//_this是对象，必须与undefined 比较
            this.elements[0] = args;
        }
    } else if (typeof args == 'function') {
        this.ready(args);
    }
}

//DOM加载完毕
Base.prototype.ready = function (fn) {
    addDomLoaded(fn);
};

//获取ID节点
Base.prototype.getId = function (id) {
    return document.getElementById(id);
};

//获取元素节点数组
Base.prototype.getTagName = function (tag, parentNode) {
    var node = null;
    var temp = [];
    if (parentNode != undefined) {
        node = parentNode;
    } else {
        node = document;
    }
    var tags = node.getElementsByTagName(tag);
    for (var i = 0; i < tags.length; i++) {
        temp.push(tags[i]);
    }
    return temp;
}

//设置css
Base.prototype.css = function (attr, value) {
    for (var i = 0; i < this.elements.length; i++) {
        if (arguments.length == 1) {
            return getStyle(this.elements[i], attr);
        }
        this.elements[i].style[attr] = value;
    }
    return this;
}

//添加classs属性
Base.prototype.addClass = function (className) {
    for (var i = 0; i < this.elements.length; i++) {
        if (!hasClass(this.elements[i], className)) {
            this.elements[i].className += ' ' + className;
        }
    }
    return this;
}

//移除class属性
Base.prototype.removeClass = function (className) {
    for (var i = 0; i < this.elements.length; i++) {
        if (hasClass(this.elements[i], className)) {
            this.elements[i].className = this.elements[i].className.replace(
                new RegExp('(\\s|^)' + className + '(\\s|$)'), '');
        }
    }
    return this;
}

//添加link或style的css规则
Base.prototype.addRule = function (num, selectorText, cssText, position) {
    var sheet = document.styleSheets[num];
    insertRule(sheet, selectorText, cssText, position);
    return this;
}

//移除link或style的css规则
Base.prototype.removeRule = function (num, index) {
    var sheet = document.styleSheets[num];
    deleteRule(sheet, index);
    return this;
}

//获取具有class属性的节点数组
Base.prototype.getClass = function (className, parentNode) {

    var node = null;
    var temp = [];
    if (parentNode != undefined) {
        node = parentNode;
    } else {
        node = document;
    }
    var all = node.getElementsByTagName('*');
    for (var i = 0; i < all.length; i++) {
        if ((new RegExp('(\\s|^)' + className + '(\\s|$)')).test(all[i].className)) {
            temp.push(all[i]);
        }
    }
    return temp;
}

//设置CSS选择器子节点
Base.prototype.find = function (str) {
    var childElements = [];
    for (var i = 0; i < this.getElement.length; i++) {
        switch (str.charAt(0)) {
            case '#':
                childElements.push(this.getId(str.substring(1)));
                break;
            case '.':
                var temp = this.getClass(str.substring(1), this.elements[i]);
                for (var j = 0; j < temp.length; j++) {
                    childElements.push(temp[j]);
                }
                break;
            default:
                var temp = this.getClass(str, this.elements[i]);
                for (var j = 0; j < temp.length; j++) {
                    childElements.push(temp[j]);
                }
                break;
        }
    }
    this.elements = childElements;
    return this;
}

//获取特定下标的一个节点，并返回节点对象
Base.prototype.getElement = function (num) {
    return this.elements[num];
}

//获取同名的首个节点，返回该节点对象
Base.prototype.first = function () {
    return this.elements[0];
}

//获取同名的最后一个节点对象
Base.prototype.last = function () {
    return this.elements[this.elements.length - 1];
}

//获取某一组节点的数量
Base.prototype.length = function () {
    return this.elements.length;
}

//获取某节点的属性
Base.prototype.attr = function (attr, value) {
    for (var i = 0; i < this.elements.length; i++) {
        if (arguments.length == 1) {
            return this.elements[i].getAttribute(attr);
        } else {
            this.elements[i].setAttribute(attr, value);
        }
    }
    return this;
}

//获取某个节点在节点组中的下标
Base.prototype.index = function () {
    var children = this.elements[0].parentNode.children;
    for (var i = 0; i < children.length; i++) {
        if (this.elements[0] == children[i]) {
            return i;
        }
    }
}

//设置节点透明度
Base.prototype.opacity = function (num) {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.opacity = num / 100;
        this.elements[i].style.filter = 'alpha(opacity=' + num + ')';
    }
    return this;
}

//获取某一个节点,并返回Base对象
Base.prototype.eq = function (num) {
    var element = this.elements[num];
    this.elements = [];
    this.elements[0] = element;
    return this;
}

// 获取当前结点的下一个节点
Base.prototype.next = function () {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i] = this.elements[i].nextSibling;
        if (this.elements[i] == null) {
            throw new Error('没有下一个同级元素节点');
        }
        if (this.elements[i].nodeType == 3) {
            this.next();
        }
    }
    return this;
}

// 获取当前结点的上一个节点
Base.prototype.prev = function () {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i] = this.elements[i].previousSibling;
        if (this.elements[i] == null) {
            throw new Error('没有上一个同级元素节点');
        }
        if (this.elements[i].nodeType == 3) {
            this.prev();
        }
    }
    return this;
}

//设置html
Base.prototype.html = function (str) {
    for (var i = 0; i < this.elements.length; i++) {
        if (arguments.length == 0) {
            return this.elements[i].innerHTML;
        }
        this.elements[i].innerHTML = str;
    }
    return this;
}

//设置innerText
Base.prototype.text = function (str) {
    for (var i = 0; i < this.elements.length; i++) {
        if (arguments.length == 0) {
            return getInnerText(this.elements[i]);
        }
        setInnerText(this.elements[i], str);
    }
    return this;
}

//设置表单字段元素
Base.prototype.form = function (name) {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i] = this.elements[i][name];
    }
    return this;
}

//设置表单字段内容获取
Base.prototype.value = function (str) {
    for (var i = 0; i < this.elements.length; i++) {
        if (arguments.length == 0) {
            return this.elements[i].value;
        }
        this.elements[i].value = str;
    }
    return this;
}

//设置事件发生器
Base.prototype.bind = function (event, fn) {
    for (var i = 0; i < this.elements.length; i++) {
        addEvent(this.elements[i], event, fn);
    }
    return this;
}

//设置鼠标移入移出方法
Base.prototype.hover = function (over, out) {
    for (var i = 0; i < this.elements.length; i++) {
        addEvent(this.elements[i], 'mouseover', over);
        addEvent(this.elements[i], 'mouseout', out);
    }
    return this;
}

//设置点击切换方法
Base.prototype.toggle = function () {
    for (var i = 0; i < this.elements.length; i++) {
        (function (element, args) {
            var count = 0;
            addEvent(element, 'click', function () {
                args[count++ % args.length].call(this);
            });
        })(this.elements[i], arguments);
    }
    return this;
}

//设置显示
Base.prototype.show = function () {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'block';
    }
    return this;
}
//设置隐藏 
Base.prototype.hide = function () {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'none';
    }
    return this;
}
//设置物体居中
Base.prototype.center = function (width, height) {
    var top = (getInner().height - height) / 2 + getScroll().top;
    var left = (getInner().width - width) / 2 + getScroll().left;

    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.top = top + 'px';
        this.elements[i].style.left = left + 'px';
    }
    return this;
}

//锁屏功能
Base.prototype.lock = function () {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.width = getInner().width + getScroll().left + 'px';
        this.elements[i].style.height = getInner().height + getScroll().top + 'px';
        this.elements[i].style.display = 'block';

        //锁屏时隐藏滚动条
        parseFloat(sys.firefox) < 4 ? document.body.style.overflow = 'hidden'
            : document.documentElement.style.overflow = 'hidden';
        addEvent(document, 'mousedown', preDef);
        addEvent(document, 'mouseup', preDef);
        addEvent(document, 'selectstart', preDef);
    }
    return this;
}
//解锁屏
Base.prototype.unlock = function () {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'none';

        //解锁屏时显示滚动条
        parseFloat(sys.firefox) < 4 ? document.body.style.overflow = 'auto'
            : document.documentElement.style.overflow = 'auto';
        removeEvent(document, 'mousedown', preDef);
        removeEvent(document, 'mouseup', preDef);
        removeEvent(document, 'selectstart', preDef);
    }
    return this;
}

//设置点击事件
Base.prototype.click = function (fn) {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].onclick = fn;
    }
    return this;
}

//触发浏览器窗口事件
Base.prototype.resize = function (fn) {
    for (var i = 0; i < this.elements.length; i++) {
        var element = this.elements[i];
        window.onresize = function () {
            fn();
            if (element.offsetLeft > getInner().width + getScroll().left - element.offsetWidth) {
                element.style.left = getInner().width + getScroll().left - element.offsetWidth + 'px';
                if (element.offsetLeft <= 0 + getScroll().left) {
                    element.style.left = 0 + getScroll().left + 'px';
                }
            }
            if (element.offsetTop > getInner().height + getScroll().top - element.offsetHeight) {
                element.style.top = getInner().height + getScroll().top - element.offsetHeight + 'px';
                if (element.offsetTop <= 0 + getScroll().top) {
                    element.style.top = 0 + getScroll().top + 'px';
                }
            }
        };
    }

    return this;
}

//设置动画,方向只有left和top，表示从该方向开始，负值为相反方向
//设置时使用x y 分别表示动画方向 ，o表示透明度
//使用obj.fn参数作为方法实现动画队列
Base.prototype.animate = function (obj) {
    for (var i = 0; i < this.elements.length; i++) {
        var element = this.elements[i];
        var attr = obj['attr'] == 'x' ? 'left' : obj['attr'] == 'y' ? 'top' :
            obj['attr'] == 'w' ? 'width' : obj['attr'] == 'h' ? 'height' :
                obj['attr'] == 'o' ? 'opacity' : obj['attr'] != undefined ? obj['attr'] : 'left';
        var start = obj['start'] != undefined ? obj['start'] :
            attr == 'opacity' ? parseFloat(getStyle(element, attr)) * 100
                : parseInt(getStyle(element, attr));
        var t = obj['t'] != undefined ? obj['t'] : 20; //时间间隔
        var step = obj['step'] != undefined ? obj['step'] : 20; //一次移动的像素值
        var speed = obj['speed'] != undefined ? obj['speed'] : 10; //缓冲时设置的速度值
        var type = obj['type'] == 0 ? 'constant' : obj['type'] == 1 ? 'buffer' : 'buffer';

        var target = obj['target']; //必须的参数，动画移动距离
        var alter = obj['alter'];
        var mul = obj['mul'];//同步动画属性

        if (alter != undefined && target == undefined) {
            target = alter + start;
        } else if (alter == undefined && target == undefined && mul == undefined) {
            throw new Error('参数错误，必须设置alter 或 target');
        }

        if (start > target) {
            step = -step;
        }

        if (attr == 'opacity') {
            element.style.opacity = parseInt(start) / 100;
            element.style.filter = 'alpha(opacity=' + parseInt(start) + ')';
        } else {
            // element.style[attr] = start + 'px';
        }

        if (mul == undefined) {
            mul = {};
            mul[attr] = target;
        }

        clearInterval(element.timer);
        element.timer = setInterval(function () {

            var flag = true;

            for (var i in mul) {
                attr = i == 'x' ? 'left' : i == 'y' ? 'top' : i == 'w' ? 'width' : i == 'h' ? 'height' : i == 'o' ? 'opacity' :
                    i != undefined ? i : 'left';
                target = mul[i];

                if (type == 'buffer') {
                    step = attr == 'opacity' ? (target - parseFloat(getStyle(element, attr)) * 100) / speed
                        : (target - parseInt(getStyle(element, attr))) / speed;
                    step = step > 0 ? Math.ceil(step) : Math.floor(step);
                }

                if (attr == 'opacity') {
                    if (step == 0) {
                        setOpacity();
                    } else if (step > 0 && Math.abs(parseFloat(getStyle(element, attr)) * 100 - target) <= step) {
                        setOpacity();
                    } else if (step < 0 && parseFloat(getStyle(element, attr)) * 100 - target <= Math.abs(step)) {
                        setOpacity();
                    } else {
                        var temp = parseFloat(getStyle(element, attr)) * 100;
                        element.style.opacity = parseInt(temp + step) / 100;
                        element.style.filter = 'alpha(opacity=' + parseInt(temp + step) + ')';
                    }
                    if (parseInt(target) != parseInt(parseFloat(getStyle(element, attr)) * 100)) {
                        flag = false;
                    }
                } else {
                    if (step == 0) {
                        setTarget();
                    } else if (step > 0 && Math.abs(parseInt(getStyle(element, attr)) - target) <= step) {
                        setTarget();
                    } else if (step < 0 && parseInt(getStyle(element, attr)) - target <= Math.abs(step)) {
                        setTarget();
                    } else {
                        element.style[attr] = parseInt(getStyle(element, attr)) + step + 'px';
                    }
                    if (parseInt(target) != parseInt(getStyle(element, attr))) {
                        flag = false;
                    }
                }
            }

            if (flag) {
                clearInterval(element.timer);
                if (obj.fn != undefined) {
                    obj.fn();
                }
            }

        }, t);

        function setTarget() {
            element.style[attr] = target + 'px';
        }
        function setOpacity() {
            element.style.opacity = parseInt(target) / 100;
            element.style.filter = 'alpha(opacity=' + parseInt(target) + ')';

        }
    }
    return this;
}

//插件入口
Base.prototype.extend = function (name, fn) {
    Base.prototype[name] = fn;
}
