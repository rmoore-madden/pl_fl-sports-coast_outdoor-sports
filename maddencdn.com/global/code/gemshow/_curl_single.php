<?php


	$FEED_URL_LISTINGS = "http://tucson.simpleviewcrm.com/webapi/listings/xml/listings.cfm";
	$USERNAME = "Tucson_API";
	$PASSWORD = "c@ctusam0unta1n";

	$response_data = "";
	doCurl("getListing", 1, $response_data);
	$raw_response_xml = new SimpleXMLElement($response_data);
	echo "<hr><pre>";
	print_r($raw_response_xml);
	echo "</pre><hr>";
	// echo $response_data;
	
	function doCurl ($action, $pagesize, &$return) {
	
		$post_data = array(
			"action" => $action,
			"username" => $GLOBALS["USERNAME"],
			"password" => $GLOBALS["PASSWORD"],
			"pagenum" => 1,
			"listingid" => $_GET["id"],
			"pagesize" => $pagesize);

		$post_body = ""; 
		foreach ($post_data as $key=>$value){
			$post_body .= ($post_body == "" ) ? "" : "&";
			$post_body .= "{$key}={$value}";
		}
	
		$ch = curl_init();
		curl_setopt($ch, CURLINFO_HEADER_OUT, true);

		curl_setopt_array(
			$ch,
			array(
				CURLOPT_URL => $GLOBALS["FEED_URL_LISTINGS"],
				CURLOPT_POST => count($post_data),
				CURLOPT_POSTFIELDS => $post_body,
				CURLOPT_RETURNTRANSFER => 1,
				CURLOPT_HTTPHEADER => array('Connection: close'),
				CURLOPT_SSL_VERIFYPEER => FALSE,
				CURLOPT_SSL_VERIFYHOST => 2,
			)
		);

		$return = curl_exec($ch);

		curl_close($ch);
	}

?>
