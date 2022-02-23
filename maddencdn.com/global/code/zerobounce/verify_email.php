<?php

//
// Zerobounce email lookup
//

// NOTE: Specifically not setting "Access-Control-Allow-Origin: *" here because it's set on the server level
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: X-Requested-With");
header('Content-Type: application/json');
header("Vary: Origin");
date_default_timezone_set('America/Phoenix');

$DEFAULT_API_KEY = "25a35229c33f4cf9b9bb4bc4dc2a1c4c";
$VALID_DOMAINS = array(
    "maddenmedia.com",
    "maddencdn.com",
    "phxvalleyguide.com",
    "tenwest.com",
    "stage-mokcdw.maddenmedia.com",
    "demo.maddenmedia.com",
    "travelwyoming.com",
    "centerofthewest.org",
    "visitcasper.com",
    "hammockcoastsc.com",
    "experiencecolumbiasc.com",
    "tuc-dt-800-ct" // curtis dev box
);

// start with default
$apiKey = $DEFAULT_API_KEY;

// 
//
// input vars
//
$lookupEmail = (isset($_GET["email"])) ? $_GET["email"] : null;
$referrer = (isset($_GET["itsasecret"])) ? $_GET["itsasecret"] : $_SERVER["HTTP_REFERER"];

if (isset($_GET["itsasecret"])) {
	$referrer = $_SERVER["HTTP_HOST"];
}

//an array for tracking important information
$trackingData = array($referrer,$lookupEmail);


// can they use this?
if ( (empty($referrer)) || (! isValidDomain($referrer, $VALID_DOMAINS)) ) {

    writeToLogs($trackingData,"invalidReferrer");

    echo (! empty($referrer))
        ? '{"message":"ERROR", "data": "caller '.$referrer.' not allowed"}'
        : '{"message":"ERROR", "data": "caller unknown not allowed"}';
    exit;
}

// email present?
if ($lookupEmail == null) {

    
    writeToLogs($trackingData,"noEmail");

    echo '{"message":"ERROR", "data": "no email provided"}';
    exit;
}

// CURTIS (27.May.2020) - we have custom keys
if (strpos($referrer, "travelwyoming.com") !== false) {
    $apiKey = "22f80b66cb024b3083fd00e23a8eb27e";
} else if (strpos($referrer, "centerofthewest.org") !== false) {
    $apiKey = "af46331e53b548579ac3fe8137ccde26";
}

// CURTIS (31.May) - leaving for reference
// $IPToValidate = '99.123.12.122';
// $url = 'https://api.zerobounce.net/v1/validatewithip?apikey='.$apiKey.'&email='.urlencode($lookupEmail).'&ipaddress='.urlencode($IPToValidate);

// use curl to make the request
$url = "https://api.zerobounce.net/v1/validate?apikey={$apiKey}&email=".urlencode($lookupEmail);
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 15);
curl_setopt($ch, CURLOPT_TIMEOUT, 150);
$response = curl_exec($ch);
curl_close($ch);

if ($response === false) {  
    array_push($trackingData, $apiKey);
    writeToLogs($trackingData,"zerobounceFailedToResopnd");
    echo '{"message":"ERROR", "error": "'.str_replace('"', '\\"', $ch).'"}';
} else {
    $return = array(
        "message" => "SUCCESS",
        "return" => json_decode($response));

    array_push($trackingData, $apiKey, $return["return"]->status);
    writeToLogs($trackingData,"allZerobounceSuccesses");
    if ($apiKey === $DEFAULT_API_KEY) {
        writeToLogs($trackingData,"defaultApiSuccesses");
    }

    $referrer = preg_replace( "#^[^:/.]*[:/]+#i", "", $referrer );
    $referrer = str_replace('.', '_', $referrer);
    $referrer = substr($referrer, 0, strpos( $referrer, '/'));
    writeToLogs($trackingData,$referrer);

    echo json_encode($return);

}
exit;

//
// local functions
//
function isValidDomain ($referrer, $goodSet) {

    if ($referrer == $_SERVER["HTTP_HOST"]) {
        // it was a secret
        // MAY EXIT THIS BLOCK
        return true;
    }
    
    foreach ($goodSet as $domain) {
        if (strpos($referrer, $domain) !== false) {
            // MAY EXIT THIS BLOCK
            return true;
        }
    }

    return false;
}

//write to logs
 function writeToLogs ($arr, $file){

    
    array_push($arr, date("m-d-Y h:i:sa"));

    $fp = fopen("logs/".$file.".csv", "a");
        fputcsv($fp,$arr);
     fclose($fp);


 };

?>
