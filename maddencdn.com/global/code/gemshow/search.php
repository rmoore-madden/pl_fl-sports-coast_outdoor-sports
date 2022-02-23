<?php

include("dbconnectTucson.php");

$date = $_REQUEST["date"];
$saletype = $_REQUEST["saletype"];

if ($saletype == "Wholesale & Public"){
	$salequery = "(saletype LIKE '%Wholesale%' OR saletype LIKE '%Public%')";
}else{
	$salequery = "saletype LIKE '%$saletype%'";
}

$query = "SELECT * FROM listings INNER JOIN (
								SELECT listingid, value AS saletype FROM customfields WHERE name='Wholesale?') AS customsaletype
								ON listings.listingid=customsaletype.listingid
						INNER JOIN (
								SELECT listingid, value AS startdate FROM customfields WHERE name='Dates Start') AS customstartdate
								ON listings.listingid=customstartdate.listingid
						INNER JOIN (
								SELECT listingid, value AS enddate FROM customfields WHERE name='Date End') AS customenddate
								ON listings.listingid=customenddate.listingid
						INNER JOIN (
								SELECT listingid, value AS gemshowlocation FROM customfields WHERE name='Gem Show Location') AS customloc
								ON listings.listingid=customloc.listingid
						INNER JOIN (
								SELECT listingid, value AS crossstreets FROM customfields WHERE name='Major Cross Streets') AS customstreet
								ON listings.listingid=customstreet.listingid
						WHERE listings.typeid=3 AND (STR_TO_DATE(startdate, '%c/%d/%Y')='$date' OR (STR_TO_DATE(startdate, '%c/%d/%Y')<'$date' AND STR_TO_DATE(enddate, '%c/%d/%Y')>='$date')) AND $salequery ORDER BY STR_TO_DATE(startdate, '%c/%d/%Y')";
						
						
//echo $query;
runQuery($query);

/////FUNCTIONS//////////////////////////////////////////////////////

function runQuery($query){
	$result = mysql_query($query);
	$jsonarr = array();
	while ($row = mysql_fetch_array($result)){
		//if zip code has an extra '-' on the end remove it
		if (strlen($row["zip"]) == 6){
			$row["zip"] = substr($row["zip"], 0, 5);
		}
	
		$entry = array();
		foreach ($row as $key => $val){
			if (is_string($key)){
			
				if ($key == "startdate" || $key == "enddate"){
					$newdate = date_create_from_format("m/d/Y", $val);
					$entry[$key] = date_format($newdate, "M j, Y");
				}else{
					$entry[$key] = $val;
				}
			}
		}
		$jsonarr[] = $entry;
	}
	
	$data = array();
	$data["data"] = $jsonarr;
	$callback = $_REQUEST['callback'];
	if ($callback) {
		//header('Content-Type: text/javascript');
		echo $callback . '(' . json_encode($data) . ');';
	} else {
		//header('Content-Type: application/x-json');
		echo json_encode($data);
	}
}

?>