
$(function () {
    //个人中心
    $('#header .member').hover(function () {
        $('#header ul').show().animate({
            t: 50,
            step: 10,
            mul: {
                o: 100,
                h: 110
            }
        });
        $(this).css('background', 'url(images/up.jpg) no-repeat right center');
    }, function () {
        $('#header ul').animate({
            t: 50,
            step: 10,
            mul: {
                o: 0,
                h: 0
            },
            fn: function () {
                $('#header ul').hide();
            }
        });
        $(this).css('background', 'url(images/down.jpg) no-repeat right center');
    });

    // 遮罩画布
    var screen = $('#screen');
    //登录框
    var login = $('#login');
    login.center(350, 250).resize(function () {
        if (login.css('display') == 'block') {
            screen.lock();
        }
    });

    $('#header .login').click(function () {
        login.center(350, 250).show();
        screen.lock().animate({
            attr: 'o',
            target: 30,
            t: 30,
            step: 10
        });
    });

    $('#login .close').click(function () {
        login.hide();
        screen.animate({
            attr: 'o',
            target: 0,
            t: 30,
            step: 10,
            fn: function () {
                screen.unlock();
            }
        });
    });

    //注册框
    var reg = $('#reg');
    reg.center(600, 550).resize(function () {
        if (reg.css('display') == 'block') {
            screen.lock();
        }
    });

    $('#header .reg').click(function () {
        $('form').eq(0).first().reset();
        reg.center(600, 550).show();
        screen.lock().animate({
            attr: 'o',
            target: 30,
            t: 30,
            step: 10
        });
    });

    $('#reg .close').click(function () {
        reg.hide();
        screen.animate({
            attr: 'o',
            target: 0,
            t: 30,
            step: 10,
            fn: function () {
                screen.unlock();
            }
        });
    });

    //拖拽窗口
    login.drag($('#login h2').first());
    reg.drag($('#reg h2').first());

    //百度分享初始化位置
    $('#share').css('top', getScroll().top + getInner().height / 5 + 'px');

    // addEvent(window, 'scroll', function () {
    //     $('#share').animate({
    //         attr: 'y',
    //         target: getScroll().top + getInner().height / 5
    //     });

    // });

    $(window).bind('scroll', function () {
        setTimeout(function () {
            $('#share').animate({
                attr: 'y',
                target: getScroll().top + getInner().height / 5
            });
        }, 100);
    });

    //百度分享收缩效果
    $('#share').hover(function () {
        $(this).animate({
            t: 30,
            mul: {
                o: 100,
                x: 0
            }
        });
    }, function () {
        $(this).animate({
            t: 30,
            mul: {
                o: 50,
                x: -211
            }
        });
    });

    //滑动导航
    $('#nav .about li').hover(function () {
        var target = $(this).first().offsetLeft;
        $('#nav .nav_bg').animate({
            attr: 'x',
            target: target + 20,
            t: 30,
            step: 10,
            fn: function () {
                $('#nav .white').animate({
                    attr: 'x',
                    target: -target
                });
            }
        });
    }, function () {
        $('#nav .nav_bg').animate({
            attr: 'x',
            target: 20,
            t: 30,
            step: 10,
            fn: function () {
                $('#nav .white').animate({
                    attr: 'x',
                    target: 0
                });
            }
        });
    });

    // 左侧菜单
    $('#sidebar h2').toggle(function () {
        $(this).next().animate({
            mul: {
                h: 0,
                o: 0
            }
        });
    }, function () {
        $(this).next().animate({
            mul: {
                h: 150,
                o: 100
            }
        });
    });

    //注册表单初始化
    $('form').eq(0).first().reset();

    //用户名验证
    $('form').eq(0).form('user').bind('focus', function () {
        $('#reg .info_user').show();
        $('#reg .error_user').hide();
        $('#reg .succ_user').hide();
    }).bind('blur', function () {
        if (trim($(this).value()) == '') {
            $('#reg .info_user').hide();
            $('#reg .error_user').hide();
            $('#reg .succ_user').hide();
        } else if (!check_user()) {
            $('#reg .error_user').show();
            $('#reg .info_user').hide();
            $('#reg .succ_user').hide();
        } else {
            $('#reg .succ_user').show();
            $('#reg .error_user').hide();
            $('#reg .info_user').hide();
        }
    });

    function check_user() {
        var flag = true;
        if (!/[\w]{2,20}/.test(trim($('form').eq(0).form('user').value()))) {
            $('#reg .error_user').html('输入不合法，请重新输入');
            return false;
        } else {
            $('#reg .info_user').hide();
            $('#reg .loading').show();

            ajax({ //ajax 异步查询
                method: 'post',
                url: 'php/check_user.php',//要提交的URL地址
                data: $('form').eq(0).serialize(), //表单序列化
                success: function (text) {
                    if (text == 1) {
                        $('#reg .error_user').html('用户已存在，请重新输入');
                        flag = false;
                    }
                    $('#reg .loading').hide();
                },
                async: false //同步状态查询
            });
        }
        return flag;
    }

    //密码验证  
    $('form').eq(0).form('password').bind('focus', function () {
        $('#reg .info_pass').show();
        $('#reg .error_pass').hide();
        $('#reg .succ_pass').hide();
    }).bind('blur', function () {
        if (trim($(this).value()) == '') {
            $('#reg .info_pass').hide();
            $('#reg .error_pass').hide();
            $('#reg .succ_pass').hide();
        } else {
            if (check_pass()) {
                $('#reg .info_pass').hide();
                $('#reg .error_pass').hide();
                $('#reg .succ_pass').show();
            } else {
                $('#reg .info_pass').hide();
                $('#reg .error_pass').show();
                $('#reg .succ_pass').hide();
            }
        }
    });

    //密码强度验证
    $('form').eq(0).form('password').bind('keyup', function () {
        check_pass();
    });

    function check_pass() {
        var value = trim($('form').form('password').value());
        var value_length = value.length;
        var code_length = 0;
        var flag = false;

        //6-20位
        if (value_length >= 6 && value_length <= 20) {
            $('#reg .info_pass .q1').html('●').css('color', 'green');
        } else {
            $('#reg .info_pass .q1').html('○').css('color', '#666');
        }

        //字母或数字非空字符满足其一
        if (value_length > 0 && !/\s/.test(value)) {
            $('#reg .info_pass .q2').html('●').css('color', 'green');
        } else {
            $('#reg .info_pass .q2').html('○').css('color', '#666');
        }

        //字母或数字非空字符满足其二
        if (/[\d]/.test(value)) {
            code_length++;
        }
        if (/[a-z]/.test(value)) {
            code_length++;
        }
        if (/[A-Z]/.test(value)) {
            code_length++;
        }
        if (/[^\w]/.test(value)) {
            code_length++;
        }
        if (code_length >= 2) {
            $('#reg .info_pass .q3').html('●').css('color', 'green');
        } else {
            $('#reg .info_pass .q3').html('○').css('color', '#666');
        }

        /** 
         * 安全级别
         * 高：大于等于10字符，三种不同类型字符
         * 中：大于等于8字符，两种不同类型字符
         * 低：大于等于1字符
         * 无：没有字符
         * 
         * 从高往低判断，防止高级别无法执行到
        */
        if (value_length >= 10 && code_length >= 3) {
            $('#reg .info_pass .s1').css('color', 'green');
            $('#reg .info_pass .s2').css('color', 'green');
            $('#reg .info_pass .s3').css('color', 'green');
            $('#reg .info_pass .s4').html('高').css('color', 'red');
        } else if (value_length >= 8 && code_length >= 2) {
            $('#reg .info_pass .s1').css('color', '#f60');
            $('#reg .info_pass .s2').css('color', '#f60');
            $('#reg .info_pass .s3').css('color', '#ccc');
            $('#reg .info_pass .s4').html('中').css('color', 'red');
        } else if (value_length >= 1) {
            $('#reg .info_pass .s1').css('color', 'maroon');
            $('#reg .info_pass .s2').css('color', '#ccc');
            $('#reg .info_pass .s3').css('color', '#ccc');
            $('#reg .info_pass .s4').html('低').css('color', 'red');
        } else {
            $('#reg .info_pass .s1').css('color', '#ccc');
            $('#reg .info_pass .s2').css('color', '#ccc');
            $('#reg .info_pass .s3').css('color', '#ccc');
            $('#reg .info_pass .s4').html(' ');
        }

        if (value_length >= 6 && value_length <= 20 && !/\s/.test(value) && code_length >= 2) {
            flag = true;
        }
        return flag;
    }

    //确认密码
    $('form').eq(0).form('config_password').bind('focus', function () {
        $('#reg .info_notpass').show();
        $('#reg .error_notpass').hide();
        $('#reg .succ_notpass').hide();
    }).bind('blur', function () {
        if (trim($(this).value()) == '') {
            $('#reg .info_notpass').hide();
            $('#reg .error_notpass').hide();
            $('#reg .succ_notpass').hide();
        } else if (check_notpass()) {
            $('#reg .info_notpass').hide();
            $('#reg .error_notpass').hide();
            $('#reg .succ_notpass').show();
        } else {
            $('#reg .info_notpass').hide();
            $('#reg .error_notpass').show();
            $('#reg .succ_notpass').hide();
        }
    });

    function check_notpass() {
        if (trim($('form').eq(0).form('config_password').value()) == trim($('form').eq(0).form('password').value())) {
            return true;
        }
        return false;
    }

    //提问
    $('form').eq(0).form('ques').bind('change', function () {
        if (check_ques()) {
            $('#reg .error_ques').hide();
        }
    });


    function check_ques() {
        if ($('form').form('ques').value() != 0) {
            return true;
        }
        return false;
    }

    //回答验证
    $('form').eq(0).form('ans').bind('focus', function () {
        $('#reg .info_ans').show();
        $('#reg .error_ans').hide();
        $('#reg .succ_ans').hide();
    }).bind('blur', function () {
        if (trim($(this).value()) == '') {
            $('#reg .info_ans').hide();
            $('#reg .error_ans').hide();
            $('#reg .succ_ans').hide();
        } else if (check_ans()) {
            $('#reg .info_ans').hide();
            $('#reg .error_ans').hide();
            $('#reg .succ_ans').show();
        } else {
            $('#reg .info_ans').hide();
            $('#reg .error_ans').show();
            $('#reg .succ_ans').hide();
        }
    });

    function check_ans() {
        if ($('form').form('ans').value().length >= 2 && trim($('form').form('ans').value()).length <= 32) {
            return true;
        }
        return false;
    }

    //电子邮件验证
    $('form').eq(0).form('email').bind('focus', function () {
        //显示补全界面
        if ($(this).value().indexOf('@') == -1) {
            $('#reg .all_email').show();
        }

        $('#reg .info_email').show();
        $('#reg .error_email').hide();
        $('#reg .succ_email').hide();
    }).bind('blur', function () {
        //隐藏补全界面
        $('#reg .all_email').hide();

        if (trim($(this).value()) == '') {
            $('#reg .info_email').hide();
            $('#reg .error_email').hide();
            $('#reg .succ_email').hide();
        } else if (check_email()) {
            $('#reg .info_email').hide();
            $('#reg .error_email').hide();
            $('#reg .succ_email').show();
        } else {
            $('#reg .info_email').hide();
            $('#reg .error_email').show();
            $('#reg .succ_email').hide();
        }
    });

    function check_email() {
        if (/^[\w\-\.]+@[\w\-]+(\.[a-zA-Z]{2,4}){1,2}$/.test(trim($('form').form('email').value()))) {
            return true;
        }
        return false;
    }

    //电子邮件键入补全
    $('form').eq(0).form('email').bind('keyup', function (event) {
        if ($(this).value().indexOf('@') == -1) {
            $('#reg .all_email').show();
            $('#reg .all_email li span').html($(this).value());
        } else {
            $('#reg .all_email').hide();
        }
        $('#reg .all_email li').css('background', 'none');
        $('#reg .all_email li').css('color', '#666');

        var length = $('#reg .all_email li').length();
        if (event.keyCode == 40) {
            if (this.index == undefined || this.index >= length - 1) {
                this.index = 0;
            } else {
                this.index++;
            }

            $('#reg .all_email li').eq(this.index).css('background', '#e5edf2');
            $('#reg .all_email li').eq(this.index).css('color', '#369');
        }

        if (event.keyCode == 38) {
            if (this.index == undefined || this.index <= 0) {
                this.index = length - 1;
            } else {
                this.index--;
            }
            $('#reg .all_email li').eq(this.index).css('background', '#e5edf2');
            $('#reg .all_email li').eq(this.index).css('color', '#369');
        }

        if (event.keyCode == 13) {
            $(this).value($('#reg .all_email li').eq(this.index).text());
            $('#reg .all_email').hide();
            this.index = undefined;
        }

    });

    //电子邮件点击补全
    $('#reg .all_email li').bind('mousedown', function () {
        $('form').eq(0).form('email').value($(this).text());
    });

    //电子邮件补全移入移出事件
    $('#reg .all_email li').hover(function () {
        $(this).css('background', '#e5edf2');
        $(this).css('color', '#369');
    }, function () {
        $(this).css('background', 'none');
        $(this).css('color', '#666');
    });

    //生日
    var year = $('form').eq(0).form('year');
    var month = $('form').eq(0).form('month');

    var day = $('form').eq(0).form('day');
    var day30 = [4, 6, 9, 11];
    var day31 = [1, 3, 5, 7, 8, 10, 12];


    for (var i = 1960; i < 2018; i++) {
        year.first().add(new Option(i, i), undefined);
    }
    for (var i = 1; i <= 12; i++) {
        month.first().add(new Option(i, i), undefined);
    }
    //年月改变触发修改日选项 
    year.bind('change', select_day);
    month.bind('change', select_day);
    day.bind('change', function () {
        if (check_birthday()) {
            $('#reg .error_birthday').hide();
        }
    });

    function select_day() {
        if (year.value() != 0 && year.value() != 0) {
            //清理之前的注入
            day.first().options.length = 1;
            var cur_day = 0;
            if (isInArray(day31, parseInt(month.value()))) {
                cur_day = 31;
            } else if (isInArray(day30, parseInt(month.value()))) {
                cur_day = 30;
            } else {
                if (parseInt(year.value()) % 4 == 0 && parseInt(year.value()) % 100 != 0
                    || parseInt(year.value()) % 400 == 0) {
                    cur_day = 29;
                } else {
                    cur_day = 28;
                }
            }
            for (var i = 1; i <= cur_day; i++) {
                day.first().add(new Option(i, i), undefined);
            }
        } else {
            //清理之前的注入
            day.first().options.length = 1;
        }
    }

    function check_birthday() {
        if (year.value() != 0 && month.value() != 0 && day.value() != 0) {
            return true;
        }
        return false;
    }

    //备注,键盘敲击，鼠标剪切黏贴触发
    $('form').eq(0).form('ps').bind('keyup', check_ps).bind('paste', function () {
        setTimeout(check_ps, 50);
    }).bind('cut', function () {
        setTimeout(check_ps, 50);
    });
    //清尾
    $('#reg .ps .clear').click(function () {
        $('form').eq(0).form('ps').value($('form').eq(0).form('ps').value().substring(0, 200));
        check_ps();
    });

    function check_ps() {
        var count = 200 - $('form').eq(0).form('ps').value().length;
        if (count >= 0) {
            $('#reg .ps').eq(0).show();
            $('#reg .ps .count').eq(0).html(count);
            $('#reg .ps').eq(1).hide();
            return true;
        } else {
            $('#reg .ps').eq(0).hide();
            $('#reg .ps .count').eq(1).html(Math.abs(count)).css('color', 'red');
            $('#reg .ps').eq(1).show();
            return false;
        }
    }
    //提交
    $('form').eq(0).form('sub').click(function () {
        var flag = true;

        if (!check_user()) {
            $('#reg .error_user').show();
            flag = false;
        }
        if (!check_pass()) {
            $('#reg .error_pass').show();
            flag = false;
        }
        if (!check_notpass()) {
            $('#reg .error_notpass').show();
            flag = false;
        }
        if (!check_ques()) {
            $('#reg .error_ques').show();
            flag = false;
        }
        if (!check_ans()) {
            $('#reg .error_ans').show();
            flag = false;
        }
        if (!check_email()) {
            $('#reg .error_email').show();
            flag = false;
        }
        if (!check_birthday()) {
            $('#reg .error_birthday').show();
            flag = false;
        }
        if (!check_ps()) {
            flag = false;
        }

        if (flag) {
            //$('form').eq(0).first().submit(); //传统表单提交
            var _this = this;
            _this.disabled = true;

            $('#loading').show().center(200, 40);
            $('#loading').html('正在提交');
            ajax({ //ajax 异步提交
                method: 'post',
                url: 'php/register.php',//要提交的URL地址
                data: $('form').eq(0).serialize(), //表单序列化
                async: true,
                success: function (text) {
                    if (text == 1) {
                        $('#loading').hide();
                        $('#success').show().center(200, 40);
                        $('#success').html('注册成功，请登录');

                        setTimeout(function () {
                            $('#success').hide();
                            reg.hide();
                            $('#reg .succ').hide();

                            $('form').eq(0).first().reset();
                            screen.animate({
                                attr: 'o',
                                target: 0,
                                t: 30,
                                step: 10,
                                fn: function () {
                                    screen.unlock();
                                }
                            });

                            _this.disabled = false;
                        }, 1500);
                    }
                }
            });
        }
    });

    //登录验证
    $('form').eq(1).form('sub').click(function () {
        if (/[\w]{2,20}/.test(trim($('form').eq(1).form('user').value()))
            && $('form').eq(1).form('password').value().length >= 6) {
            var _this = this;
            _this.disabled = true;
            $('#loading').show().center(200, 40);
            $('#loading').html('正在登录');

            ajax({ //ajax 异步提交
                method: 'post',
                url: 'php/login.php',//要提交的URL地址
                data: $('form').eq(1).serialize(), //表单序列化
                async: true,
                success: function (text) {
                    $('#loading').hide();
                    if (text == 1) {
                        $('#login .info').html('');
                        $('#success').show().center(200, 40);
                        $('#success').html('登录成功');

                        setCookie('user', trim($('form').eq(1).form('user').value()));

                        setTimeout(function () {
                            $('#success').hide();
                            login.hide();
                            $('form').eq(1).first().reset();
                            screen.animate({
                                attr: 'o',
                                target: 0,
                                t: 30,
                                step: 10,
                                fn: function () {
                                    screen.unlock();
                                }
                            });
                            $('#header .reg').hide();
                            $('#header .login').hide();
                            $('#header .info').show().html('欢迎,' + getCookie('user') + ' ');
                        }, 1500);

                    } else {
                        $('#login .info').html('登录失败,用户名或密码错误');
                    }
                    _this.disabled = false;
                }
            });
        } else {
            $('#login .info').html('登录失败,用户名或密码不合法');
        }

    });

    //轮播器初始化
    $('#banner img').opacity(0);
    $('#banner img').eq(0).opacity(100);
    $('#banner ul li').eq(0).css('color', '#fff');
    $('#banner strong').html($('#banner img').eq(0).attr('alt'));

    //轮播器计数器
    var banner_index = 0;
    //轮播器类别
    var banner_type = 2; //1.横向透明度渐变 2.纵向上下滚动
    //自动轮播定时器
    var banner_timer = setInterval(banner_fn, 3000);
    //手动轮播
    $('#banner ul li').hover(function () {
        clearInterval(banner_timer);
        if ($(this).css('color') != '#fff' && $(this).css('color') != 'rgb(255, 255, 255)') {
            banner(this, banner_index == 0 ? $('#banner ul li').length() - 1 : banner_index - 1);
        }
    }, function () {
        banner_index = $(this).index() + 1;
        banner_timer = setInterval(banner_fn, 3000);
    });

    function banner(obj, prev) {
        $('#banner ul li').css('color', '#333');
        $('#banner ul li').eq($(obj).index()).css('color', '#fff');
        $('#banner strong').html($('#banner img').eq($(obj).index()).attr('alt'));

        if (banner_type == 1) {
            $('#banner img').eq(prev).animate({
                attr: 'o',
                target: 100,
                step: 10,
                t: 30
            }).css('zIndex', 1);
            $('#banner img').eq($(obj).index()).animate({
                attr: 'o',
                target: 0,
                step: 10,
                t: 30
            }).css('zIndex', 2);
        } else if (banner_type == 2) {
            $('#banner img').eq(prev).animate({
                attr: 'y',
                target: 150,
                step: 10,
                t: 30,
            }).css('zIndex', 1).opacity(100);
            $('#banner img').eq($(obj).index()).animate({
                attr: 'y',
                target: 0,
                step: 10,
                t: 30,
            }).css('top', '-150px').css('zIndex', 2).opacity(100);
        }

    }
    function banner_fn() {
        if (banner_index >= $('#banner ul li').length()) {
            banner_index = 0;
        }
        banner($('#banner ul li').eq(banner_index).first(), banner_index == 0 ? $('#banner ul li').length() - 1 : banner_index - 1);
        banner_index++;
    }

    //延迟加载:
    //1.图片进入可见区域
    //2.将xsrc 地址替换到src
    var wait_load = $('.wait_load');
    wait_load.opacity(0);
    $(window).bind('scroll', _wait_load);
    $(window).bind('resize', _wait_load);
    function _wait_load() {
        setTimeout(function () {
            for (var i = 0; i < wait_load.length(); i++) {
                var photo = wait_load.getElement(i);
                if (getInner().height + getScroll().top >= offsetTop(photo)) {
                    $(photo).attr('src', $(photo).attr('xsrc')).animate({
                        attr: 'o',
                        target: 100,
                        step: 10,
                        t: 30
                    });
                }
            }
        }, 100);
    }

    //图片弹窗
    var photo_big = $('#photo_big');
    photo_big.center(620, 550).resize(function () {
        if (photo_big.css('display') == 'block') {
            screen.lock();
        }
    });

    $('#photo dl dt img').click(function () {
        photo_big.center(620, 550).show();
        screen.lock().animate({
            attr: 'o',
            target: 30,
            t: 30,
            step: 10
        });
        //图片加载
        //创建缓冲图片对象
        var temp_img = new Image();
        // temp_img.src = 'http://cn.bing.com/az/hprichbg/rb/GreatGhost_ROW10354803922_1920x1080.jpg';
        $(temp_img).bind('load', function () {
            $('#photo_big .big img').attr('src', temp_img.src).animate({
                attr: 'o',
                target: 100,
                t: 30,
                step: 10
            }).opacity(0);
        });
        temp_img.src = $(this).attr('bigsrc');

        // 预加载当前图片的前一张和后一张,将其作为属性存储
        var children = this.parentNode.parentNode;
        prev_next_img(children);

    });

    $('#photo_big .close').click(function () {
        photo_big.hide();
        screen.animate({
            attr: 'o',
            target: 0,
            t: 30,
            step: 10,
            fn: function () {
                screen.unlock();
            }
        });
        $('#photo_big .big img').attr('src', 'images/loading.gif');
    });
    //拖拽窗口
    photo_big.drag($('#photo_big h2').first());

    //鼠标滑过左侧切换图标
    $('#photo_big .big .left').hover(function () {
        $('#photo_big .big .sl').animate({
            attr: 'o',
            target: 100,
            step: 10,
            t: 30
        });
    }, function () {
        $('#photo_big .big .sl').animate({
            attr: 'o',
            target: 0,
            step: 10,
            t: 30
        });
    });

    //鼠标滑过右侧切换图标
    $('#photo_big .big .right').hover(function () {
        $('#photo_big .big .sr').animate({
            attr: 'o',
            target: 100,
            step: 10,
            t: 30
        });
    }, function () {
        $('#photo_big .big .sr').animate({
            attr: 'o',
            target: 0,
            step: 10,
            t: 30
        });
    });

    //切换上一张图片
    $('#photo_big .big .left').click(function () {

        $('#photo_big .big img').attr('src', 'images/loading.gif');
        var current_img = new Image();
        current_img.src = $(this).attr('src');

        $(current_img).bind('load', function () {
            $('#photo_big .big img').attr('src', current_img.src).animate({
                attr: 'o',
                target: 100,
                step: 10,
                t: 30
            }).opacity(0);
        });

        var children = $('#photo dl dt img')
            .getElement(prevIndex($('#photo_big .big img').attr('index'), $('#photo').first()))
            .parentNode.parentNode;
        prev_next_img(children);

    });

    //切换下一张图片
    $('#photo_big .big .right').click(function () {
        $('#photo_big .big img').attr('src', 'images/loading.gif');
        var current_img = new Image();
        current_img.src = $(this).attr('src');

        $(current_img).bind('load', function () {
            $('#photo_big .big img').attr('src', current_img.src).animate({
                attr: 'o',
                target: 100,
                step: 10,
                t: 30
            }).opacity(0);
        });

        var children = $('#photo dl dt img')
            .getElement(nextIndex($('#photo_big .big img').attr('index'), $('#photo').first()))
            .parentNode.parentNode;
        prev_next_img(children);

    });

    function prev_next_img(children) {
        var prev = prevIndex($(children).index(), children.parentNode);
        var next = nextIndex($(children).index(), children.parentNode);
        var prev_img = new Image();
        var next_img = new Image();
        prev_img.src = $('#photo dl dt img').eq(prev).attr('bigsrc');
        next_img.src = $('#photo dl dt img').eq(next).attr('bigsrc');
        $('#photo_big .big .left').attr('src', prev_img.src);
        $('#photo_big .big .right').attr('src', next_img.src);
        $('#photo_big .big img').attr('index', $(children).index());

        $('#photo_big .big .index').html($(children).index() + 1 + '/' + $('#photo dl dt img').length());
    }

    //博文发表弹窗
    var blog = $('#blog');
    blog.center(580, 320).resize(function () {
        if (blog.css('display') == 'block') {
            screen.lock();
        }
    });

    $('#header .member a').eq(0).click(function () {
        $('form').eq(2).first().reset();
        blog.center(580, 320).show();
        screen.lock().animate({
            attr: 'o',
            target: 30,
            t: 30,
            step: 10
        });
    });

    $('#blog .close').click(function () {
        blog.hide();
        screen.animate({
            attr: 'o',
            target: 0,
            t: 30,
            step: 10,
            fn: function () {
                screen.unlock();
            }
        });
    });
    blog.drag($('#blog h2').first());

    $('form').eq(2).form('sub').click(function () {
        if (trim($('form').eq(2).form('title').value()).length <= 0
            || trim($('form').eq(2).form('content').value()).length <= 0) {
            $('#blog .info').html('发表失败，标题或内容不能为空');
        } else {
            var _this = this;
            _this.disabled = true;
            $('#loading').show().center(200, 40);
            $('#loading').html('正在发表');

            ajax({ //ajax 异步提交
                method: 'post',
                url: 'php/add_blog.php',//要提交的URL地址
                data: $('form').eq(2).serialize(), //表单序列化
                async: true,
                success: function (text) {
                    $('#loading').hide();
                    if (text == 1) {
                        $('#blog .info').html('');
                        $('#success').show().center(200, 40);
                        $('#success').html('发表成功');
                        setTimeout(function () {
                            $('#success').hide();
                            blog.hide();
                            $('form').eq(2).first().reset();
                            screen.animate({
                                attr: 'o',
                                target: 0,
                                t: 30,
                                step: 10,
                                fn: function () {
                                    screen.unlock();
                                    //异步更新博客
                                    updateBlog();
                                }
                            });
                        }, 1500);
                    } else {
                        alert(text);
                    }
                    _this.disabled = false;
                }
            });
        }
    });

    updateBlog();
    //更新博文列表
    function updateBlog() {
        $('#index').html('<span class="loading"></span>');
        $('#index .loading').show();
        ajax({ //ajax 异步提交
            method: 'post',
            url: 'php/get_blog.php',//要提交的URL地址
            data: {}, //表单序列化
            async: true,
            success: function (text) {
                $('#index .loading').hide();
                var json = JSON.parse(text);
                var html = '';
                for (var i = 0; i < json.length; i++) {
                    html += '<div class="content"><h2><em>' + json[i].submit_date
                        + '</em>' + json[i].title + '</h2><p>' + json[i].content + '</p></div>';
                }
                $('#index').html(html);
                for (var i = 0; i < json.length; i++) {
                    $('#index .content').eq(i).animate({
                        attr: 'o',
                        target: 100,
                        step: 10,
                        t: 30
                    });
                }
            }
        });
    }

    //换肤弹窗
    var skin = $('#skin');
    skin.center(580, 320).resize(function () {
        if (skin.css('display') == 'block') {
            screen.lock();
        }
    });
    $('#header .member a').eq(1).click(function () {
        skin.center(580, 320).show();
        screen.lock().animate({
            attr: 'o',
            target: 30,
            t: 30,
            step: 10
        });
        $('#skin .skin_bg').html('<span class="loading"></span>');
        ajax({ //ajax异步请求
            method: 'post',
            url: 'php/get_skin.php',//要提交的URL地址
            data: {
                'type':'all'
            }, //表单序列化
            async: true,
            success: function (text) {
                var json = JSON.parse(text);
                var html = '';
                for (var i = 0; i < json.length; i++) {
                    html += '<dl><dt><img src ="images/' + json[i].small_bg + '" big_bg="'
                        + json[i].big_bg + '" bg_color="' + json[i].bg_color + '" alt=""></dt><dd>'
                        + json[i].bg_text + '</dd></dl>';
                }
                $('#skin .skin_bg').html(html).opacity(0).animate({
                    attr: 'o',
                    target: 100,
                    t: 30,
                    step: 10
                });
                $('#skin dl dt img').click(function () {
                    var color = $(this).attr('bg_color');
                    $('body').css('background',color+' '+'url(images/'+$(this).attr('big_bg')+') repeat-x');
                    skin.hide();
                    screen.unlock();
                    ajax({ //ajax异步
                        method: 'post',
                        url: 'php/get_skin.php',//要提交的URL地址
                        data: {
                            'type':'set',
                            'big_bg':$(this).attr('big_bg')
                        },
                        async: true,
                        success: function (text) {
                            if(text == 1) {
                                $('#success').show().center(200, 40);
                                $('#success').html('换肤成功');
                                setTimeout(function () {
                                    $('#success').hide();
                                },1500);
                            }
                        }
                    });
                });
            }
        });
    });
    $('#skin .close').click(function () {
        skin.hide();
        screen.animate({
            attr: 'o',
            target: 0,
            t: 30,
            step: 10,
            fn: function () {
                screen.unlock();
            }
        });
    });
    skin.drag($('#skin h2').first());
    //获取skin参数
    ajax({ //ajax异步请求
        method: 'post',
        url: 'php/get_skin.php',//要提交的URL地址
        data: {
            'type':'main'
        },
        async: true,
        success: function (text) {
          var json = JSON.parse(text)
          $('body').css('background',json.bg_color+' '+'url(images/'+json.big_bg+') repeat-x');
        }
    });
});