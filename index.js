
$(function () {
    //个人中心
    $('#header .member').hover(function () {
        $('#header ul').show().animate({
            t: 50,
            step: 10,
            mul:{
                o:100,
                h:110
            }
        });
        $(this).css('background', 'url(images/up.jpg) no-repeat right center');
    }, function () {
        $('#header ul').animate({
            t: 50,
            step: 10,
            mul:{
                o:0,
                h:0
            },
            fn: function(){
                $('#header ul').hide();
            }
        });
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

    //拖拽窗口
    login.drag($('#log h2').first());

    //百度分享初始化位置
    $('#share').css('top', getScroll().top + getInner().height / 5 + 'px');

    addEvent(window,'scroll',function(){
        $('#share').animate({
            attr:'y',
            target: getScroll().top + getInner().height / 5
        });
       
    });

    //百度分享收缩效果
    $('#share').hover(function () {
        $(this).animate({
            t:30,
            mul:{
                o:100,
                x:0
            }
        });
    }, function () {
        $(this).animate({
            target: -211,
            t:30,
            mul:{
                0:0,
                x:-211
            }
        });
    });

    //滑动导航
    $('#nav .about li').hover(function(){ 
       var target = $(this).first().offsetLeft;
       $('#nav .nav_bg').animate({
          attr : 'x',
          target: target + 20,
          t:30,
          step:10,
          fn:function(){
              $('#nav .white').animate({
                  attr:'x',
                  target: -target
              });
          }
       });
    },function(){
        $('#nav .nav_bg').animate({
            attr : 'x',
            target: 20,
            t:30,
            step:10,
            fn:function(){
                $('#nav .white').animate({
                    attr:'x',
                    target: 0
                });
            }
         });
    });


});