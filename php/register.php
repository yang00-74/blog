<?php
  require 'config.php';
 // print_r($_POST);

  $_birthday = $_POST['year'].'-'.$_POST['month'].'-'.$_POST['day'];
  $sql = "INSERT INTO blog_user(user,pass,birthday)
          VALUES('{$_POST['user']}',sha1('{$_POST['password']}'),'{$_birthday}')";
  $mysqli->query($sql);
  sleep(2);
  echo mysqli_affected_rows($mysqli);
  mysqli_close($mysqli);

?>