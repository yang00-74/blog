
$(function () {
    //个人中心
    $('#header .member').hover(function () {
        $('#header ul').show();
        $(this).css('background', 'url(images/up.jpg) no-repeat right center');
    }, function () {
        $('#header ul').hide();
        $(this).css('background', 'url(images/down.jpg) no-repeat right center');
    });

    //登录框
    var login = $('#login');
    var screen = $('#screen');

    login.center(350, 250).resize(function () {
        login.center(350, 250);
        if (login.css('display') == 'block') {
            screen.lock();
        }
    });

    $('#header .login').click(function () {
        login.center(350, 250);
        login.css('display', 'block');
        screen.lock();
    });

    $('#login .close').click(function () {
        login.css('display', 'none');
        screen.unlock();
    });

    //拖拽窗口
    login.drag($('#log h2').first());

    //百度分享初始化位置
    $('#share').css('top', getInner().height / 2 + 'px');

    //百度分享收缩效果
    $('#share').hover(function(){
        $(this).animate({
            attr:'x',
            target : 0
        });
    },function(){
        $(this).animate({
            attr:'x',
            target : -211
        });
    });
});