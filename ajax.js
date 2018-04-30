//使用同步方式
/*
addEvent(document,'click',function(){
    var xhr=new XMLHttpRequest();//创建XHR对象
    xhr.open('get','ajax.php',false);
    xhr.send(null);//发送请求
   
    //获取响应
    if(xhr.status==200){
       alert(xhr.responseText); 
     }else{
         alert('错误'+xhr.status+' '+xhr.statusText);
    }
    
});
*/

//使用异步方式
/*
addEvent(document,'click',function(){
    var xhr=new XMLHttpRequest();//创建XHR对象
    var url='ajax.php?rand='+Math.random();//GET方式发送数据

    xhr.onreadystatechange=function(){
    if(xhr.readyState==4){
      if(xhr.status==200){
        alert(xhr.responseText); 
      }else{
          alert('错误'+xhr.status+' '+xhr.statusText);
      }
    }
  }

    xhr.open('post',url,true);
    xhr.setRequestHeader('Content-Type',
                         'application/x-www-form-urlencoded');//POST方式
    xhr.send('name=yang&age=24');//发送请求  
});
*/

//封装ajax
function ajax(obj) {
    var xhr = new XMLHttpRequest();
    obj.url = obj.url + '?rand=' + Math.random();
    obj.data = (function (data) { //处理参数
        var arr = [];
        for (var i in data) {
            arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
        }
        return arr.join('&');
    })(obj.data);

    if (obj.method === 'get') {
        obj.url = obj.url.indexOf('?') == -1 ?
            obj.url + '?' + obj.data : obj.url + '&' + obj.data;
    }

    if (obj.async === true) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    obj.success(xhr.responseText); //回调传参
                } else {
                    alert('错误' + xhr.status + ' ' + xhr.statusText);
                }
            }
        };
    }
    xhr.open(obj.method, obj.url, obj.async);
    if (obj.method === 'post') {
        xhr.setRequestHeader('Content-Type',
            'application/x-www-form-urlencoded');//POST方式
        xhr.send(obj.data);//发送请求  
    } else {
        xhr.send(null);
    }

    if (obj.async === false) {
        if (xhr.status == 200) {
            obj.success(xhr.responseText); //回调传参
        } else {
            alert('错误' + xhr.status + ' ' + xhr.statusText);
        }
    }
}