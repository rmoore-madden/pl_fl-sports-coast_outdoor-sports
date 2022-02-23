<?php

//
// USPS address lookup
//

// NOTE: Specifically not setting "Access-Control-Allow-Origin: *" here because it's set on the server level
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: X-Requested-With");
header('Content-Type: application/json');
header("Vary: Origin");

$URL = "https://production.shippingapis.com/ShippingAPITest.dll";
$USER_ID = "726MADDE7462";
$VALID_DOMAINS = array(
    "maddenmedia.com",
    "stage-mokcdw.maddenmedia.com",
    "demo.maddenmedia.com",
    "travelwyoming.com",
	"visitcasper.com"
);

//
// input vars
//
$a1 = (isset($_GET["a1"])) ? $_GET["a1"] : null;
$a2 = (isset($_GET["a2"])) ? $_GET["a2"] : "";
$city = (isset($_GET["city"])) ? $_GET["city"] : "";
$state = (isset($_GET["state"])) ? $_GET["state"] : "";
$zip = (isset($_GET["zip"])) ? $_GET["zip"] : null;
$referrer = (isset($_GET["itsasecret"])) ? $_GET["itsasecret"] : $_SERVER["HTTP_REFERER"];

// can they use this?
if ( (! isset($referrer)) && (! isValidDomain($referrer, $VALID_DOMAINS)) ) {
    echo (isset($referrer))
        ? '{"message":"ERROR", "data": "caller '.$referrer.' not allowed"}'
        : '{"message":"ERROR", "data": "caller unknown not allowed"}';
    exit;
}

// email present?
if ( ($a1 == null) || ($zip == null) ) {
    echo '{"message":"ERROR", "data": "not enough address info provided. Please include at least one street address and a zip code."}';
    exit;
}

$fieldsStr = "";
$addressXML = "<AddressValidateRequest USERID=\"{$USER_ID}\">"
    ."<Revision>1</Revision>"
    ."<Address ID=\"0\">"
    ."<Address1>{$a1}</Address1>"
    ."<Address2>{$a2}</Address2>"
    ."<City>{$city}</City>"
    ."<State>{$state}</State>"
    ."<Zip5>{$zip}</Zip5>"
    ."<Zip4></Zip4>"
    ."</Address>"
    ."</AddressValidateRequest>";

$fields = array(
    "API" => urlencode("Verify"),
    "XML" => urlencode($addressXML)
);

// url-ify the data for the POST
foreach($fields as $key => $value) {
    $fieldsStr .= "{$key}={$value}&";
}
rtrim($fieldsStr, "&");

//open connection
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $URL);
curl_setopt($ch, CURLOPT_POST, count($fields));
curl_setopt($ch, CURLOPT_POSTFIELDS, $fieldsStr);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
if ($response === false) {
    echo '{"message":"ERROR", "data": ".curl_error($ch)."}';
    exit;
} else {
    $xml = simplexml_load_string($response) or die('{"message":"ERROR", "error": "Could not parse USPS response"}');
    $return = array(
            "message" => "SUCCESS",
            "return" => $xml);
    echo json_encode($return);
}
curl_close($ch);

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
