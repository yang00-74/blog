
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
        login.center(350, 250).css('display', 'block');
        screen.lock().animate({
            attr: 'o',
            target: 30,
            t: 30,
            step: 10
        });
    });

    $('#login .close').click(function () {
        login.css('display', 'none');
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
        reg.center(600, 550).css('display', 'block');
        screen.lock().animate({
            attr: 'o',
            target: 30,
            t: 30,
            step: 10
        });
    });

    $('#reg .close').click(function () {
        reg.css('display', 'none');
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
        $('#share').animate({
            attr: 'y',
            target: getScroll().top + getInner().height / 5
        });
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

    //用户验证
    $('form').form('user').bind('focus', function () {
        $('#reg .info_user').css('display', 'block');
        $('#reg .error_user').css('display', 'none');
        $('#reg .succ_user').css('display', 'none');
    }).bind('blur', function () {
        if (trim($(this).value()) == '') {
            $('#reg .info_user').css('display', 'none');
            $('#reg .error_user').css('display', 'none');
            $('#reg .succ_user').css('display', 'none');
        } else if (!/[\w]{2,20}/.test(trim($(this).value()))) {
            $('#reg .error_user').css('display', 'block');
            $('#reg .info_user').css('display', 'none');
            $('#reg .succ_user').css('display', 'none');
        } else {
            $('#reg .succ_user').css('display', 'block');
            $('#reg .error_user').css('display', 'none');
            $('#reg .info_user').css('display', 'none');
        }
    });

    //密码验证  
    $('form').form('password').bind('focus', function () {
        $('#reg .info_pass').css('display', 'block');
        $('#reg .error_pass').css('display', 'none');
        $('#reg .succ_pass').css('display', 'none');
    }).bind('blur', function () {
        if (trim($(this).value()) == '') {
            $('#reg .info_pass').css('display', 'none');
            $('#reg .error_pass').css('display', 'none');
            $('#reg .succ_pass').css('display', 'none');
        } else {
            if (check_pass(this)) {
                $('#reg .info_pass').css('display', 'none');
                $('#reg .error_pass').css('display', 'none');
                $('#reg .succ_pass').css('display', 'block');
            } else {
                $('#reg .info_pass').css('display', 'none');
                $('#reg .error_pass').css('display', 'block');
                $('#reg .succ_pass').css('display', 'none');
            }
        }
    });

    //密码强度验证
    $('form').form('password').bind('keyup', function () {
        check_pass(this);
    });

    function check_pass(_this) {
        var value = trim($(_this).value());
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
    $('form').form('config_password').bind('focus', function () {
        $('#reg .info_notpass').css('display', 'block');
        $('#reg .error_notpass').css('display', 'none');
        $('#reg .succ_notpass').css('display', 'none');
    }).bind('blur', function () {
        if (trim($(this).value()) == '') {
            $('#reg .info_notpass').css('display', 'none');
            $('#reg .error_notpass').css('display', 'none');
            $('#reg .succ_notpass').css('display', 'none');
        } else if (trim($(this).value()) == trim($('form').form('password').value())) {
            $('#reg .info_notpass').css('display', 'none');
            $('#reg .error_notpass').css('display', 'none');
            $('#reg .succ_notpass').css('display', 'block');
        } else {
            $('#reg .info_notpass').css('display', 'none');
            $('#reg .error_notpass').css('display', 'block');
            $('#reg .succ_notpass').css('display', 'none');
        }
    });

    //回答验证
    $('form').form('ans').bind('focus', function () {
        $('#reg .info_ans').css('display', 'block');
        $('#reg .error_ans').css('display', 'none');
        $('#reg .succ_ans').css('display', 'none');
    }).bind('blur', function () {
        if (trim($(this).value()) == '') {
            $('#reg .info_ans').css('display', 'none');
            $('#reg .error_ans').css('display', 'none');
            $('#reg .succ_ans').css('display', 'none');
        } else if (trim($(this).value()).length >= 2 && trim($(this).value()).length <= 32) {
            $('#reg .info_ans').css('display', 'none');
            $('#reg .error_ans').css('display', 'none');
            $('#reg .succ_ans').css('display', 'block');
        } else {
            $('#reg .info_ans').css('display', 'none');
            $('#reg .error_ans').css('display', 'block');
            $('#reg .succ_ans').css('display', 'none');
        }
    });

    //电子邮件验证
    $('form').form('email').bind('focus', function () {
        $('#reg .info_email').css('display', 'block');
        $('#reg .error_email').css('display', 'none');
        $('#reg .succ_email').css('display', 'none');
    }).bind('blur', function () {
        if (trim($(this).value()) == '') {
            $('#reg .info_email').css('display', 'none');
            $('#reg .error_email').css('display', 'none');
            $('#reg .succ_email').css('display', 'none');
        } else if (/^[\w\-\.]+@[\w\-]+(\.[a-zA-Z]{2,4}){1,2}$/.test(trim($(this).value()))) {
            $('#reg .info_email').css('display', 'none');
            $('#reg .error_email').css('display', 'none');
            $('#reg .succ_email').css('display', 'block');
        } else {
            $('#reg .info_email').css('display', 'none');
            $('#reg .error_email').css('display', 'block');
            $('#reg .succ_email').css('display', 'none');
        }
    });
});