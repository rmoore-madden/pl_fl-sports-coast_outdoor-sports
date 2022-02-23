<?php
function callAPI($method, $url, $data){
    $curl = curl_init();

    switch ($method){
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);
            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        default:
            if ($data)
                $url = sprintf("%s?%s", $url, http_build_query($data));
    }

    // OPTIONS:
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
        'APIKEY: 111111111111111111111',
        'Content-Type: application/json',
    ));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);

    // EXECUTE:
    $result = curl_exec($curl);
    if(!$result){die("Connection Failure");}
    curl_close($curl);
    return $result;
}



$cityName = $_GET['cityName'];
$cityID = $_GET['cityID'];
$apiKey = '1c19d0384e647feb644e01488b1c1beb';
if ($cityName) {
    $url = 'http://api.openweathermap.org/data/2.5/weather?q='.$cityName.'&appid='.$apiKey.'&units=imperial';
} elseif ($cityID) {
    $url = 'http://api.openweathermap.org/data/2.5/weather?id='.$cityID.'&appid='.$apiKey.'&units=imperial';
}

$filename = 'cache/'.$_GET['cityName'].'.txt';
$getNewData = false;
if (file_exists($filename)) {
    if (time()-filemtime($filename) > 2 * 3600) $getNewData = true;
} else {
    $getNewData = true;
}

if ($getNewData) {
    $get_data = callAPI('GET',$url, false);
    $response = json_decode($get_data, true);
    $responseCode = $response['cod'];

    if ($responseCode != 200) {
        $returnData = array('error' => $response['message']);
        $returnData = json_encode($returnData);
    } else {
        $data = $response['response']['data'][0];
        $returnData = array(
            'temp' => round($response['main']['temp']),
            'icon' => '',
            'conditions' => 'clear',
            'conditionsCode' => ''
        );
        if ($response['weather'][0]['main']) {
            $returnData['conditions'] = $response['weather'][0]['main'];
        }
        if ($response['weather'][0]['id']) {
            $returnData['conditionsCode'] = $response['weather'][0]['id'];
        }
        if ($response['weather'][0]['icon']) {
            $returnData['icon'] = $response['weather'][0]['icon'];
        }

        $returnData = json_encode($returnData);
    }

    $myfile = fopen($filename, "w") or die("Unable to open file!");
    fwrite($myfile, $returnData);
    fclose($myfile);
}

echo file_get_contents($filename);
?>
