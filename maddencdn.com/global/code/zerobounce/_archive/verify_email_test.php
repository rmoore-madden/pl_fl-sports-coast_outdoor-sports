<?php

//
// Zerobounce email lookup
//

$request_headers        = apache_request_headers();
$http_origin            = $request_headers['Origin'];
echo "<pre>";
print_r($request_headers);
echo "</pre>";
exit;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: X-Requested-With");
header('Content-Type: application/json');

$API_KEY = "25a35229c33f4cf9b9bb4bc4dc2a1c4c";
$VALID_DOMAINS = array(
	"maddenmedia.com",
	"phxvalleyguide.com",
	"tenwest.com"
);

//
// input vars
//
$lookupEmail = (isset($_GET["email"])) ? $_GET["email"] : null;
$referrer = (isset($_GET["itsasecret"])) ? $_GET["itsasecret"] : $_SERVER["HTTP_REFERER"];

// can they use this?
if ( (! isset($referrer)) && (! isValidDomain($referrer, $VALID_DOMAINS)) ) {
	echo (isset($referrer))
		? '{"message":"ERROR", "data": "caller '.$referrer.' not allowed"}'
		: '{"message":"ERROR", "data": "caller unknown not allowed"}';
	exit;
}

// email present?
if ($lookupEmail == null) {
	echo '{"message":"ERROR", "data": "no email provided"}';
	exit;
}

// CURTIS 31.May) - leaving for reference
// $IPToValidate = '99.123.12.122';
// $url = 'https://api.zerobounce.net/v1/validatewithip?apikey='.$API_KEY.'&email='.urlencode($lookupEmail).'&ipaddress='.urlencode($IPToValidate);

// use curl to make the request
$url = "https://api.zerobounce.net/v1/validate?apikey={$API_KEY}&email=".urlencode($lookupEmail);
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 15); 
curl_setopt($ch, CURLOPT_TIMEOUT, 150); 
$response = curl_exec($ch);
curl_close($ch);
 
echo $response;
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
