
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
    }
    else if (args != undefined) {//_this是对象，必须与undefined 比较
        this.elements[0] = args;
    }
}


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
        if (all[i].className == className) {
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

//获取某一个节点，并返回节点对象
Base.prototype.getElement = function (num) {
    return this.elements[num];
}

//获取某一个节点,并返回Base对象
Base.prototype.eq = function (num) {
    var element = this.elements[num];
    this.elements = [];
    this.elements[0] = element;
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

//设置鼠标移入移出方法
Base.prototype.hover = function (over, out) {
    for (var i = 0; i < this.elements.length; i++) {
        addEvent(this.elements[i], 'mouseover', over);
        addEvent(this.elements[i], 'mouseout', out);
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
    var top = (getInner().height - 250) / 2;
    var left = (getInner().width - 350) / 2;

    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.top = top + 'px';
        this.elements[i].style.left = left + 'px';
    }
    return this;
}

//锁屏功能
Base.prototype.lock = function () {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.width = getInner().width + 'px';
        this.elements[i].style.height = getInner().height + 'px';
        this.elements[i].style.display = 'block';

        //锁屏时隐藏滚动条
        document.documentElement.style.overflow = 'hidden';
        addEvent(window, 'scroll', scrollTop);
    }
    return this;
}
//解锁屏
Base.prototype.unlock = function () {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'none';

        //解锁屏时显示滚动条
        document.documentElement.style.overflow = 'auto';
        removeEvent(window, 'scroll', scrollTop);
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
            if (element.offsetLeft > getInner().width - element.offsetWidth) {
                element.style.left = getInner().width - element.offsetWidth + 'px';
            }
            if (element.offsetTop > getInner().height - element.offsetHeight) {
                element.style.top = getInner().height - element.offsetHeight + 'px';
            }
        };
    }

    return this;
}

//插件入口
Base.prototype.extend = function (name, fn) {
    Base.prototype[name] = fn;
}
