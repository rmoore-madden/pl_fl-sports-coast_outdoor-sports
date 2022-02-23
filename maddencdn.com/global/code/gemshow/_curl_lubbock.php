<?php

if (isset($_GET["viewthesource"])) { 
	echo "<pre>";
	echo highlight_file("./_curl_lubbock.php");
	echo "</pre>";
	exit;
}

if ( (isset($_GET["src"])) && ($_GET["src"] == "works") ) { 
	$feedURL = "https://tucson.simpleviewcrm.com/webapi/listings/xml/listings.cfm";
	$username = "Tucson_API";
	$password = "c@ctusam0unta1n&sv";
} else {
	$feedURL = "https://lubbock.simpleviewcrm.com/webapi/listings/xml/listings.cfm";
	$username = "madden_api";
	$password = "4lubbock&sv";
}

$postData = array(
	"action" 	=> "getListings",
	"username"	=> $username,
	"password"	=> $password,
	"pagenum"	=> 1,
	"pagesize"	=> 20,
);

$postBody = ""; 
foreach ($postData as $key => $value){
	$postBody .= ($postBody == "" ) ? "" : "&";
	$postBody .= "{$key}={$value}";
}

$ch = curl_init();
curl_setopt_array(
	$ch,
	array(
		CURLINFO_HEADER_OUT => true,
		CURLOPT_URL => $feedURL,
		CURLOPT_POST => count($postData),
		CURLOPT_POSTFIELDS => http_build_query($postData),
		CURLOPT_RETURNTRANSFER => 1,
		CURLOPT_HTTPHEADER => array('Connection: close'),
		CURLOPT_SSL_VERIFYPEER => FALSE,
		CURLOPT_SSL_VERIFYHOST => 2,
	)
);

$return = curl_exec($ch);
echo "<pre>";
print_r($return);
echo "</pre>";

curl_close($ch);
exit;


?>

