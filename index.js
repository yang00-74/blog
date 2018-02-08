
window.onload = function () {

    //个人中心
    $('.member').hover(function () {
        $('ul').show();
        $(this).css('background', 'url(images/up.jpg) no-repeat right center');
    }, function () {
        $('ul').hide();
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

    $('.login').click(function () {
        login.center(350, 250);
        login.css('display', 'block');
        screen.lock();
    });

    $('.close').click(function () {
        login.css('display', 'none');
        screen.unlock();
    });

    //拖拽窗口
    login.drag([$('h2').getElement(0)]);

};