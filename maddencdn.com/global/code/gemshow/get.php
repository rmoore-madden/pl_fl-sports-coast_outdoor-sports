<?php

header('Content-Type: application/json');
include("dbconnectTucson.php");
include("_redirect_placeholder_data.php");
$category = $_REQUEST["category"];
$id = $_REQUEST["id"];
$requestMonth = $_REQUEST['month'];

$query = "";
$cols = "listingid, acctid as accountid, typeid, typename, catid as categoryid, catname as categoryname, '' as subcategoryid, '' as subcategoryname, regionid, region, rankid, rankname, '' as ranksort, company, sortcompany as companysort, addr1 as address1, addr2 as address2, addr3 as address3, city, state, zip, phone, altphone, fax, tollfree, primarycontactfullname as contact, primarycontacttitle as title, email, weburl as website, url_facebook, url_googleplus, url_instagram, url_linkedin, url_pinterest, url_twitter, url_yelp, description, latitude, longitude, created, lastupdated, '' as meetingfacilityid, '' as fieldid, crossstreets, company as customname, gemshowlocation, gemridestop, gemrideloop, listingkeywords, accountkeywords as keywords, saletype, startdate, enddate";

if (isset($category)){
    switch ($category) {
        case ("dining"):{
            // $query = "SELECT {$cols} FROM v2_listings WHERE catname LIKE '%Restaurant%'";
            $query = "SELECT {$cols} FROM v2_listings WHERE catname = 'Nightlife'";
            break;
        }
        case ("transportation"):{
            // EFS - 3/29/2018 - Commenting out temporarily: Client only wants shows to display
						// MM - Collin - 12/14/21 - changed to LIKE and added the %% to make sure it sees the category
            $query = "SELECT {$cols} FROM v2_listings WHERE catname = 'Suppliers. Services & Transportation' GROUP BY company";



            // $query = "SELECT * FROM listings INNER JOIN customfields ON listings.listingid=customfields.listingid WHERE name = 'Gem Show Location (Gem Show)' AND categoryname='Ground Transportation'";
            break;
        }
        case ("shows"):{
            $today = date("Y-m-d");
            $month = intval(date("m"));
            $year = intval(date("y"));

            $query = "SELECT {$cols} FROM v2_listings WHERE catname = 'Gem & Lapidary'";

            if ($requestMonth) {
                //we don't know if the month request is last year, so keep it a year behind just in case
                $query .= " AND startdate >= '20" . ($year - 1) . "-" . $requestMonth . "-1'";
            }
            elseif($month < 3){
                $query .= " AND startdate >= '20" . ($year - 1) . "-9-1' AND enddate < '20" . $year . "-3-1'";
            }
            elseif($month >= 3 && $month < 9){
                $query .= " AND startdate >= '20" . $year . "-3-1' AND enddate < '20" . $year . "-10-1'";
            }
            elseif($month >= 9){
                $query .= " AND startdate >= '20" . $year . "-10-1' AND enddate < '20" . ($year + 1) . "-3-1'";
            }

            // regardless, don't returns shows that are in the past AND order by earliest startdate
            $query .= " AND enddate >= NOW() ORDER BY startdate ASC";

            break;
        }
    }

} else if (isset($id)){
    $query = "SELECT {$cols} FROM v2_listings WHERE listingid = '{$id}'";
}
// echo $query;
runQuery($query, $link);

/////FUNCTIONS//////////////////////////////////////////////////////

function runQuery($query, $link){

    global $_REQUEST;
    global $redirectShowEntry;
    global $redirectDiningEntry;
    global $redirectTransportationEntry;

    $jsonarr = array();

    // mobile app is going away - give them a single entry with info about the new location on the web
    if (! isset($_REQUEST["web"])) {
        if (strpos($query, "Gem & Lapidary") !== false) {
            $jsonarr[] = $redirectShowEntry;
        } else if (strpos($query, "Restaurants") !== false) {
            $jsonarr[] = $redirectDiningEntry;
        } else if (strpos($query, "Transportation") !== false) {
            $jsonarr[] = $redirectTransportationEntry;
        }
    } else {

        $result = mysqli_query($link, $query);
        while ($row = mysqli_fetch_array($result)){
            //if zip code has an extra '-' on the end remove it
            if (strlen($row["zip"]) == 6){
                $row["zip"] = substr($row["zip"], 0, 5);
            }

            $entry = array();
            foreach ($row as $key => $val){
                if (is_string($key)){

                    if ($val == 'Tucson Gem and Mineral Show?') {
                        $val = 'Tucson Gem and Mineral Show &reg;';
                    }
                    if ($val == 'AGTA GemFair? Tucson') {
                        $val = 'AGTA GemFair &trade; Tucson';
                    }

                    // Else if will NOT encode the html from the description and social links, due to special character (description) and null (social data) issues
                    if ($key == "startdate" || $key == "enddate"){
                        // $newdate = date_create_from_format("m/d/Y", strtotime($val));
                        // $entry[$key] = date_format($newdate, "M j, Y");
                        $entry[$key] = date("M j, Y", strtotime($val));
                        $entry["{$key}B"] = date("Y-m-d", strtotime($val));
                    } else if ( $key == "description" || $key == "url_facebook" || $key == "url_googleplus" || $key == "url_instagram" || $key == "url_linkedin" || $key == "url_pinterest" || $key == "url_twitter" || $key == "url_yelp" ) {
                        $entry[$key] = $val;

                        // lets remove the html tag encoding from descriptions
                        if ($key == "description") {
                            $entry[$key] = htmlentities($val);
                            $replaceString = str_replace(array("&lt;", "&gt;"), array("<", ">"), $entry[$key]);
                            $entry[$key] = $replaceString;
                        }
                    } else if ($key == "saletype") {
                        // 2016-10-05: YAY!
                        $replaceString = str_replace("Public & Wholesale", "Wholesale &amp; Public", $val);
                        // echo $key .': '.$replaceString . ' | '. $val . '<br/>';
                        $entry[$key] = $replaceString;
                    } else {
                        // pending: ugh. some fields are the utf8 ascii and some are already ascii codes. UGLY
                        if (strpos($val, "&trade;") !== false) {
                            $entry[$key] = $val;
                        } else {
                            $entry[$key] = htmlentities(convertSmartQuotes($val)); // HTML encode all others
                        }
                    }
                }
            }
            $jsonarr[] = $entry;
        }
    }

    // go through all the data and catch any lat/lng points that are duplicates, and move them aside slightly
    $foundLatLngs = array();
    $rangeMin = 1;
    $rangeMax = 3;
    $tweakPoint = 3; // how far down the decimal to randomize
    for ($i=0; $i < count($jsonarr); $i++) {
        if (in_array("{$jsonarr[$i]["latitude"]},{$jsonarr[$i]["longitude"]}", $foundLatLngs)) {
            // it exists - offset these slightly via a rand calc - move the thousandths for each by some range between 1 and 3

            // DEBUG echo ($_GET["test"] != "") ? "{$jsonarr[$i]["company"]} -----> old: {$jsonarr[$i]["latitude"]},{$jsonarr[$i]["longitude"]}\n" : "";

            $latBits = explode(".", $jsonarr[$i]["latitude"]);
            $lBit = intval(substr($latBits[1], $tweakPoint, 1));
            $rand = ($lBit + ( ((rand(0,1) * 2) - 1) * rand($rangeMin, $rangeMax)) );
            $rand = ($rand < 0) ? 0 : $rand;
            $latBits[1] = substr_replace($latBits[1], $rand, $tweakPoint, 1);
            $jsonarr[$i]["latitude"] = implode(".", $latBits);

            $lngBits = explode(".", $jsonarr[$i]["longitude"]);
            $lBit = intval(substr($lngBits[1], $tweakPoint, 1));
            $rand = ($lBit + ( ((rand(0,1) * 2) - 1) * rand($rangeMin, $rangeMax)) );
            $rand = ($rand < 0) ? 0 : $rand;
            $lngBits[1] = substr_replace($lngBits[1], $rand, $tweakPoint, 1);
            $jsonarr[$i]["longitude"] = implode(".", $lngBits);

            // DEBUG echo ($_GET["test"] != "") ? "{$jsonarr[$i]["company"]} -----> new: {$jsonarr[$i]["latitude"]},{$jsonarr[$i]["longitude"]}\n" : "";

        } else {
            // add it
            $foundLatLngs[] = "{$jsonarr[$i]["latitude"]},{$jsonarr[$i]["longitude"]}";
        }
    }

    // now output
    $data = array();
    $data["data"] = $jsonarr;
    $callback = $_REQUEST['callback'];
    if ($callback) {
        //header('Content-Type: text/javascript');
        echo $callback . '(' . json_encode($data) . ');';
    } else if ($_REQUEST["json"] == "true") {
        // 23.nov.2k15 - callback adds callback in, so also include
        //    mobile app json version to leave that untouched
        $wrapper = array(
            "status" => 200,
            "message" => "OK",
            "count" => count($data["data"]),
            "data" => $data["data"]
        );
        echo json_encode($wrapper);

    } else {
        // header('Content-Type: text/html; charset=UTF-8');
        print_r($data);
        // echo json_encode($data);
    }

}

//
// http://shiflett.org/blog/2005/oct/convert-smart-quotes-with-php
//
function convertSmartQuotes ($string) {
    $search = array(chr(145),
                    chr(146),
                    chr(147),
                    chr(148),
                    chr(151));

    $replace = array("'",
                     "'",
                     '"',
                     '"',
                     '-');

    return str_replace($search, $replace, $string);
}

?>
