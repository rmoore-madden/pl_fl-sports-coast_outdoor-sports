<?php

$FEED_URL_LISTINGS = "http://tucson.simpleviewcrm.com/webapi/listings/xml/listings.cfm";
$USERNAME = "Tucson_API";
$PASSWORD = "c@ctusam0unta1n";

// $FEED_URL_LISTINGS = "https://lubbock.simpleviewcrm.com/webapi/listings/xml/listings.cfm";
// $USERNAME = "madden_api";
// $PASSWORD = "4lubbock&sv";

	$PAGE_SIZE = 20;

	$response_data = "";
	doCurl("getListings", 1, 10000, $response_data);
	echo "<pre>";
	print_r($response_data);
	echo "</pre>";
	exit;

	if (empty($response_data)){
		echo "err 1";
	} else {
		// learn how many entries there are
		$raw_response_xml = new SimpleXMLElement($response_data);
		$response = simplexmlToArray($raw_response_xml);
		$data_count = intval($response["REQUESTSTATUS"]["RESULTS"]);
		if ($data_count > 0) {
			$retrieved = 0;
			$page = 1;
			while ($retrieved <= $data_count) {
				$response_data = "";
				doCurl("getListings", $page, $PAGE_SIZE, $response_data);

				echo "<hr><hr>{$page} / {$retrieved}";
				echo "<pre>";
				$raw_response_xml = new SimpleXMLElement($response_data);
				print_r($raw_response_xml);
				//print_r($response_data);
				$response = simplexmlToArray($raw_response_xml);
				$data_count = intval($response["REQUESTSTATUS"]["RESULTS"]);
				echo count($response['LISTINGS']['LISTING'])." | {$data_count}<br/>";
				//print_r($response);
				echo "</pre>";

				// talles
				$page++;
				$retrieved += $PAGE_SIZE;
			}
		}
	}

	function doCurl ($action, $pagenum, $pagesize, &$return) {

        // filter out the 'gem & lapidary', 'restaurants' and 'transportation' listings
        $xml_content = '<FILTERGROUP><FILTERS><ITEM><FIELDCATEGORY>Listing</FIELDCATEGORY><FIELDNAME>CatID</FIELDNAME><FILTERTYPE>Equal To</FILTERTYPE><FILTERVALUE>1272</FILTERVALUE></ITEM><ITEM><FIELDCATEGORY>Listing</FIELDCATEGORY><FIELDNAME>CatID</FIELDNAME><FILTERTYPE>Equal To</FILTERTYPE><FILTERVALUE>3</FILTERVALUE></ITEM><ITEM><FIELDCATEGORY>Listing</FIELDCATEGORY><FIELDNAME>CatID</FIELDNAME><FILTERTYPE>Equal To</FILTERTYPE><FILTERVALUE>7</FILTERVALUE></ITEM></FILTERS><ANDOR>OR</ANDOR></FILTERGROUP>';

		$post_data = array(
			"action" => $action,
			"username" => $GLOBALS["USERNAME"],
			"password" => $GLOBALS["PASSWORD"],
			"pagenum" => $pagenum,
			// "listingid" => "28080",
			"pagesize" => $pagesize,
            // "filters" => $xml_content
		);

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



//////////////////////////////////
//////////////////////////////////

function simplexmlToArray($xml) {

	if(is_a($xml, 'SimpleXMLElement')) {
		if($xml->count() > 0) {
			return simplexmlToArray((array) $xml);
		}
	}
	elseif(is_array($xml)) {
		foreach($xml as $key => $val) {
			if(! is_string($val)) {
				$xml[$key] = simplexmlToArray($val);
			}
		}
		return $xml;
	}
}

?>
