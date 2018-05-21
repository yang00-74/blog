<?php
  require 'config.php';

  $sql = "INSERT INTO blog_blog (title,content,submit_date)
          VALUES('{$_POST['title']}','{$_POST['content']}',NOW())";
  $mysqli->query($sql);
  sleep(2);
  echo mysqli_affected_rows($mysqli);
  mysqli_close($mysqli);

?>