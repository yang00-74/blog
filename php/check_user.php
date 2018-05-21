<?php
  require 'config.php';
 // print_r($_POST);

  $sql = "SELECT user FROM blog_user WHERE user='{$_POST['user']}'";
  $mysqli->query($sql);
  //sleep(2);
  if(mysqli_affected_rows($mysqli) > 0){
     echo 1;
  }
  mysqli_close($mysqli);

?>