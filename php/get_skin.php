<?php
  require 'config.php';

  if($_POST['type']=='all') {
    $sql = "SELECT small_bg,big_bg,bg_color,bg_text FROM blog_skin LIMIT 0,3";
    $data = $mysqli->query($sql);
    $json ='';
    while(!!$row = mysqli_fetch_array($data,MYSQL_ASSOC)) {
        $json .= json_encode($row).',';
    }
    sleep(1);
    echo '['.substr($json,0,strlen($json)-1).']';
 } else if($_POST['type']=='main') {
    $sql = "SELECT big_bg,bg_color FROM blog_skin WHERE bg_flag=1";
    $data = $mysqli->query($sql);
    echo json_encode(mysqli_fetch_array($data,MYSQL_ASSOC));
 } else if($_POST['type']=='set') {
    $sql = "UPDATE blog_skin SET bg_flag=0 WHERE bg_flag=1";
    $mysqli->query($sql);
    $sql = "UPDATE blog_skin SET bg_flag=1 WHERE big_bg='{$_POST['big_bg']}'";
    $mysqli->query($sql);
    echo mysqli_affected_rows($mysqli);
 }
  mysqli_close($mysqli);
?>