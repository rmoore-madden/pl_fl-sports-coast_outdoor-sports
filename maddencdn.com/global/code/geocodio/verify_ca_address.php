<?php

//
// Geocod.io Canadian address lookup
//

// NOTE: Specifically not setting "Access-Control-Allow-Origin: *" here because it's set on the server level
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: X-Requested-With");
header('Content-Type: application/json');
header("Vary: Origin");

// load the lib
require('vendor/autoload.php');
use Stanley\Geocodio\Client;

$API_KEY = "f8bdaa783bdba2af51d28f888f12d65d165dfff";
$VALID_DOMAINS = array(
	"maddenmedia.com",
	"stage-mokcdw.maddenmedia.com"
);

//
// input vars
//
$a1 = (isset($_GET["a1"])) ? $_GET["a1"] : null;
$a2 = (isset($_GET["a2"])) ? $_GET["a2"] : "";
$city = (isset($_GET["city"])) ? $_GET["city"] : "";
$state = (isset($_GET["state"])) ? $_GET["state"] : "";
$zip = (isset($_GET["zip"])) ? $_GET["zip"] : null;
$country = (isset($_GET["country"])) ? $_GET["country"] : "Canada";
$referrer = (isset($_GET["itsasecret"])) ? $_GET["itsasecret"] : $_SERVER["HTTP_REFERER"];

// can they use this?
if ( (! isset($referrer)) && (! isValidDomain($referrer, $VALID_DOMAINS)) ) {
	echo (isset($referrer))
		? '{"message":"ERROR", "data": "caller '.$referrer.' not allowed"}'
		: '{"message":"ERROR", "data": "caller unknown not allowed"}';
	exit;
}

// address present?
if ( ($a1 == null) || ($zip == null) ) {
 	echo '{"message":"ERROR", "data": "not enough address info provided. Please include at least one street address and a zip code."}';
 	exit;
}

// create lookup client
$client = new Client($API_KEY);

// query the address
$fullAddressStr = "{$a1} {$a2} {$city} {$state} {$zip} {$country}";
$geocodeResult = $client->geocode($fullAddressStr);
if (isset($geocodeResult->response->results)) {
	// loop thrrough and find best match
	$found = false;
	foreach ($geocodeResult->response->results as $address) {
		if ($address->accuracy_type == "rooftop") {
			$found = true;
			$return = array(
					"message" => "SUCCESS",
					"return" => $address->address_components);
			echo json_encode($return);
		}
	}
	if (! $found) {
		echo '{"message":"ERROR", "data": "no matching address found for \''.$fullAddressStr.'\'"}';
	}
} else {
	echo '{"message":"ERROR", "data": "address cannot be verified"}';
}

exit;

//
// local functions
//
function isValidDomain ($referrer, $goodSet) {
	
	foreach ($goodSet as $domain) {
		if (strpos($referrer, $domain) !== false) {
			// MAY EXIT THIS BLOCK
			return true;
		}
	}
	
	return false;
}


?>
