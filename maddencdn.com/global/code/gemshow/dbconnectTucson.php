<?php
$username = "dev";
$password = "Why is a database on a cdn?";
$database = "mobile_Tucson";

$link = mysqli_connect('localhost', $username, $password, $database) or die("Unable to connect to database, aborting.\n");
//mysql_set_charset('utf8',$link);
mysqli_select_db($link, $database) or die ("Unable to select database, aborting\n");

?>