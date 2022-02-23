<?php

header('Content-Type: application/json');
include("dbconnectTucson.php");

$category = $_REQUEST["category"];
$id = $_REQUEST["id"];

$query = "";

if (isset($category)){

	switch ($category) {
		case ("dining"):{

			$query = "SELECT * FROM listings "
			.   " INNER JOIN customfields ON listings.listingid=customfields.listingid "
			. 	" WHERE name = 'Gem Show Location (Gem Show)' "
			. 	" 	AND (categoryname LIKE '%Culinary%' OR categoryname LIKE '%Restaurants%')";
			// echo "/*{$query}*/";
			break;
		}
		case ("transportation"):{
			//$query = "SELECT listings.* FROM listings INNER JOIN amenitytabs ON listings.listingid = amenitytabs.listingid
					//WHERE tabname LIKE '%gem%' AND categoryname='Ground Transportation'";
			$query = "SELECT * FROM listings INNER JOIN customfields ON listings.listingid=customfields.listingid WHERE name = 'Gem Show Location (Gem Show)' AND categoryname='Ground Transportation'";
			break;
		}
		case ("shows"):{
			$today = date("Y-m-d");

			$query = "SELECT * FROM listings INNER JOIN (
								SELECT listingid, value AS saletype FROM customfields WHERE name = 'Wholesale? (Gem Show)') AS customsaletype
								ON listings.listingid=customsaletype.listingid
						INNER JOIN (
								SELECT listingid, STR_TO_DATE(value, '%m/%d/%Y') AS startdateB, value as startdate FROM customfields WHERE name='Dates Start (Gem Show)' and value != '') AS customstartdate
								ON listings.listingid=customstartdate.listingid
						INNER JOIN (
								SELECT listingid, STR_TO_DATE(value, '%m/%d/%Y') AS enddateB, value as enddate FROM customfields WHERE name='Date End (Gem Show)' and value != '') AS customenddate
								ON listings.listingid=customenddate.listingid
						INNER JOIN (
								SELECT listingid, value AS gemshowlocation FROM customfields WHERE name='Gem Show Location (Gem Show)') AS customloc
								ON listings.listingid=customloc.listingid
						INNER JOIN (
								SELECT listingid, value AS crossstreets FROM customfields WHERE name='Major Cross Streets (Gem Show)') AS customstreet
								ON listings.listingid=customstreet.listingid
						INNER JOIN (
								SELECT listingid, value AS customname FROM customfields WHERE name='Show Name (Gem Show)') AS customname
								ON listings.listingid=customname.listingid
						WHERE listings.typeid=3 AND enddateB >= CURDATE() ORDER BY startdateB";

						// Use: "enddateB >= CURDATE()" in the future

						// echo $query;
			break;
		}
	}

}else if (isset($id)){
	$query = "SELECT * FROM listings INNER JOIN (
								SELECT listingid, value AS saletype FROM customfields WHERE name = 'Wholesale? (Gem Show)') AS customsaletype
								ON listings.listingid=customsaletype.listingid
						INNER JOIN (
								SELECT listingid, value AS startdate FROM customfields WHERE name='Dates Start (Gem Show)') AS customstartdate
								ON listings.listingid=customstartdate.listingid
						INNER JOIN (
								SELECT listingid, value AS enddate FROM customfields WHERE name='Date End (Gem Show)') AS customenddate
								ON listings.listingid=customenddate.listingid
						INNER JOIN (
								SELECT listingid, value AS gemshowlocation FROM customfields WHERE name='Gem Show Location (Gem Show)') AS customloc
								ON listings.listingid=customloc.listingid
						INNER JOIN (
								SELECT listingid, value AS crossstreets FROM customfields WHERE name='Major Cross Streets (Gem Show)') AS customstreet
								ON listings.listingid=customstreet.listingid
						WHERE listings.listingid=$id ORDER BY STR_TO_DATE(startdate, '%c/%d/%Y')";
}

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


				if ($val == 'Tucson Gem and Mineral Show?') {
					$val = 'Tucson Gem and Mineral Show &reg;';
				}

				if ($key == "startdate" || $key == "enddate"){
					$newdate = date_create_from_format("m/d/Y", $val);
					$entry[$key] = date_format($newdate, "M j, Y");
				} else{
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