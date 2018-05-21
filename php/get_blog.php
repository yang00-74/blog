<?php
  require 'config.php';
 
  $sql = "SELECT title,content,submit_date FROM blog_blog ORDER BY submit_date DESC LIMIT 0,3";
  $data = $mysqli->query($sql);
  $json ='';
  while(!!$row = mysqli_fetch_array($data,MYSQL_ASSOC)) {
    $json .= json_encode($row).',';
  }
  sleep(1);
  echo '['.substr($json,0,strlen($json)-1).']';
  mysqli_close($mysqli);
?>