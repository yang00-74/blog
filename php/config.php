<?php
    header('Content-Type:text/html;charset=utf-8');
    define('DB_HOST','localhost');
    define('DB_USER','root');
    define('DB_PWD','root');
    define('DB_NAME','blog');

    $mysqli = @new mysqli(DB_HOST,DB_USER,DB_PWD,DB_NAME) or die('数据库连接失败:'.mysql_error());
?>