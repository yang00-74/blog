<?php
  require 'config.php';
 // print_r($_POST);

  $_pass = sha1($_POST['password']);
  $sql = "SELECT user FROM blog_user WHERE user='{$_POST['user']}' AND pass='{$_pass}'";
  $mysqli->query($sql);
  sleep(2);
  if(mysqli_affected_rows($mysqli) == 1){ //用户和密码正确
     echo 1;
  } else {
      echo 0;
  }
  mysqli_close($mysqli);

?>