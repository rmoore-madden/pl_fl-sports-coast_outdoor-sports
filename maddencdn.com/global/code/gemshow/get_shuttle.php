<?php

header('Content-Type: application/json');
include("dbconnectTucson.php");

$shuttle = $_REQUEST["shuttle"];
$id = $_REQUEST["id"];

// during off season, we can just return empty data to keep the map cleaner
$OFF_SEASON = false;

/////FUNCTIONS//////////////////////////////////////////////////////

$jsonarr = array();
$entry = array();

if ($shuttle == "parking") {
	
	$entry["icon"] = "iconparking.png";
	$entry["title"] = "West Congress Parking Hub A";
	$entry["address"] = "855 W Congress St.";
	$entry["lat"] = "32.219119";
	$entry["lon"] = "-110.984488";
	$jsonarr[] = $entry;
		
	$entry["icon"] = "iconparking.png";
	$entry["title"] = "West Congress Parking Hub B";
	$entry["address"] = "700 W Congress St.";
	$entry["lat"] = "32.218093";
	$entry["lon"] = "-110.983436";
	$jsonarr[] = $entry;
	
	$entry["icon"] = "iconparking.png";
	$entry["title"] = "City State Garage";
	$entry["address"] = "498 W Congress St.";
	$entry["lat"] = "32.221815";
	$entry["lon"] = "-110.978404";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconparking.png";
	$entry["title"] = "TCC B";
	$entry["address"] = "400-498 W Cushing St";
	$entry["lat"] = "32.217358";
	$entry["lon"] = "-110.976183";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconparking.png";
	$entry["title"] = "TCC C";
	$entry["address"] = "270-286 S Church Ave";
	$entry["lat"] = "32.217494";
	$entry["lon"] = "-110.972782";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconparking.png";
	$entry["title"] = "Pennington Garage";
	$entry["address"] = "110 E Pennington St.";
	$entry["lat"] = "32.223073";
	$entry["lon"] = "-110.969312";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconparking.png";
	$entry["title"] = "Depot Plaza";
	$entry["address"] = "1 N 5th Ave.";
	$entry["lat"] = "32.222613";
	$entry["lon"] = "-110.967305";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconparking.png";
	$entry["title"] = "Centro Garage";
	$entry["address"] = "345 E Congress St";
	$entry["lat"] = "32.221987";
	$entry["lon"] = "-110.965656";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconparking.png";
	$entry["title"] = "Freeway and 22nd";
	$entry["address"] = "1125 S I-10 West-Bound Frontage Rd";
	$entry["lat"] = "32.207830";
	$entry["lon"] = "-110.978361";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconparking.png";
	$entry["title"] = "Doubletree";
	$entry["address"] = "445 S Alvernon Way";
	$entry["lat"] = "32.215715";
	$entry["lon"] = "-110.908651";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconparking.png";
	$entry["title"] = "FC Tucson";
	$entry["address"] = "E Ajo Way";
	$entry["lat"] = "32.181553";
	$entry["lon"] = "-110.929883";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconparking.png";
	$entry["title"] = "TEP";
	$entry["address"] = "2500 E Ajo Way";
	$entry["lat"] = "32.173843";
	$entry["lon"] = "-110.933155";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconparking.png";
	$entry["title"] = "TEP2";
	$entry["address"] = "2900 E Milber St.";
	$entry["lat"] = "32.172027";
	$entry["lon"] = "-110.931321";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconparking.png";
	$entry["title"] = "CC lot";
	$entry["address"] = "4501-4505 S Country Club Rd";
	$entry["lat"] = "32.169657";
	$entry["lon"] = "-110.924830";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconparking.png";
	$entry["title"] = "CC lot2";
	$entry["address"] = "3401 E Gas Rd";
	$entry["lat"] = "32.168358";
	$entry["lon"] = "-110.919809";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconparking.png";
	$entry["title"] = "Expo";
	$entry["address"] = "3726 E Irvington Rd";
	$entry["lat"] = "32.162491";
	$entry["lon"] = "-110.912771";
	$jsonarr[] = $entry;
	
} 

elseif ($shuttle == "stops") {

	/////////////////////////////

	$entry["gemrideloop"] = "Downtown";
	$entry["gemridestop"] = 1;
	$entry["icon"] = "downtown1.png";
	$entry["title"] = "Downtown Mercado Shuttle/Parking Hub";
	$entry["lat"] = "32.219264";
	$entry["lon"] = "-110.983382";
	$entry["description"] = "<b>African Art Village:</b> Feb 1 – Feb 16, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Downtown";
	$entry["gemridestop"] = 2;
	$entry["icon"] = "downtown2.png";
	$entry["title"] = "Red Lion Inn & Suites";
	$entry["lat"] = "32.219473";
	$entry["lon"] = "-110.980566";
	$entry["description"] = "<b>GIGM Show – Globex Gem and Mineral Show:</b> Jan 31 – Feb 15, 2020<br/><b>Rapa River Gem & Mineral Show:</b> Jan 31 – Feb 16, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Downtown";
	$entry["gemridestop"] = 3;
	$entry["icon"] = "downtown3.png";
	$entry["title"] = "Ramada by Wyndham Tucson";
	$entry["lat"] = "32.216278";
	$entry["lon"] = "-110.980330";
	$entry["description"] = "<b>Pueblo Gem & Mineral Show:</b> Jan 31 – Feb 12, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Downtown";
	$entry["gemridestop"] = 4;
	$entry["icon"] = "downtown4.png";
	$entry["title"] = "Howard Johnson Inn, Quality Inn";
	$entry["lat"] = "32.208662";
	$entry["lon"] = "-110.980512";
	$entry["description"] = "GIGM Show--Motel 6 Gem and Mineral Show:</b> Jan 31 – Feb 15, 2020<br/><b>GIGM Show – Quality Inn Gem & Mineral Show:</b> Jan 31 – Feb 15, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Downtown";
	$entry["gemridestop"] = 5;
	$entry["icon"] = "downtown5.png";
	$entry["title"] = "1530 S. Freeway";
	$entry["lat"] = "32.205648";
	$entry["lon"] = "-110.980234";
	$entry["description"] = "<b>Tucson Showplace:</b> Jan 31 – Feb 16, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Downtown";
	$entry["gemridestop"] = 6;
	$entry["icon"] = "downtown6.png";
	$entry["title"] = "600 W. 22nd St.";
	$entry["lat"] = "32.207645";
	$entry["lon"] = "-110.978624";
	$entry["description"] = "<b>22nd St. Mineral, Fossil & Gem Show:</b> Jan 30 – Feb 16, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Downtown";
	$entry["gemridestop"] = 7;
	$entry["icon"] = "downtown7.png";
	$entry["title"] = "633 W. 18th St.";
	$entry["lat"] = "32.211840";
	$entry["lon"] = "-110.978280";
	$entry["description"] = "<b>Sonoran Glass Art Show:</b> Feb 5 – Feb 9, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Downtown";
	$entry["gemridestop"] = 8;
	$entry["icon"] = "downtown8.png";
	$entry["title"] = "601 W. Simpson St.";
	$entry["lat"] = "32.214590";
	$entry["lon"] = "-110.978420";
	$entry["description"] = "<b>JG&M Simpson Street:</b> Feb 1 – Feb 16, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Downtown";
	$entry["gemridestop"] = 9;
	$entry["icon"] = "downtown9.png";
	$entry["title"] = "Tucson Convention Center";
	$entry["lat"] = "32.218356";
	$entry["lon"] = "-110.975513";
	$entry["description"] = "<b>66th Annual Tucson Gem and Mineral Show&reg;:</b> Feb 13 – Feb 16, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Downtown";
	$entry["gemridestop"] = 10;
	$entry["icon"] = "downtown10.png";
	$entry["title"] = "5th Ave. at Hotel Congress";
	$entry["lat"] = "32.222668";
	$entry["lon"] = "-110.967241";
	$entry["description"] = "<b>Congress St. Entertainment District and East End Parking:</b> Feb 3 - Feb 8, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Downtown";
	$entry["gemridestop"] = 11;
	$entry["icon"] = "downtown11.png";
	$entry["title"] = "Tucson Metro Chamber";
	$entry["lat"] = "32.227519";
	$entry["lon"] = "-110.977948";
	$entry["description"] = "<b>Arizona Mineral & Fossil Show:</b> Feb 1 – Feb 15, 2020<br/><b>Fine Minerals International Show:</b> Jan 31 – Feb 15, 2020<br/><b>The Granada Show:</b> Jan 26 – Feb 15, 2020<br/><b>Granada Gallery:</b> Jan 24 – Feb 16, 2020<br/>";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Downtown";
	$entry["gemridestop"] = 12;
	$entry["icon"] = "downtown12.png";
	$entry["title"] = "498 W. Congress St.";
	$entry["lat"] = "32.221724";
	$entry["lon"] = "-110.978324";
	$entry["description"] = "City/State Garage Parking";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Downtown";
	$entry["gemridestop"] = 13;
	$entry["icon"] = "downtown13.png";
	$entry["title"] = "Tucson Convention Center";
	$entry["lat"] = "32.217839";
	$entry["lon"] = "-110.975899";
	$entry["description"] = "<b>Gem & Jewelry Exchange AGTA GemFair&trade; Tucson:</b> Feb 4 – Feb 9, 2020<br/><b>66th Annual Tucson Gem and Mineral Show&reg;:</b> Feb 13 – Feb 16, 2020";
	$jsonarr[] = $entry;

	/////////////////////////////
	
	$entry["gemrideloop"] = "Mineral &amp; Fossil";
	$entry["gemridestop"] = 1;
	$entry["icon"] = "mineral1.png";
	$entry["title"] = "Downtown Mercado Shuttle & Parking Hub";
	$entry["lat"] = "32.219948";
	$entry["lon"] = "-110.984380";
	$entry["description"] = "";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Mineral &amp; Fossil";
	$entry["gemridestop"] = 2;
	$entry["icon"] = "mineral2.png";
	$entry["title"] = "Tucson Metro Chamber";
	$entry["lat"] = "32.227215";
	$entry["lon"] = "-110.978436";
	$entry["description"] = "<b>Arizona Mineral & Fossil Show:</b> Feb 1 – Feb 15, 2020<br/><b>Fine Minerals International Show:</b> Jan 31 – Feb 15, 2020<br/><b>The Granada Show:</b> Jan 26 – Feb 15, 2020<br/><b>Granada Gallery:</b> Jan 24 – Feb 16, 2020<br/>";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Mineral &amp; Fossil";
	$entry["gemridestop"] = 2;
	$entry["icon"] = "mineral2b.png";
	$entry["title"] = "707 N. Main Ave";
	$entry["lat"] = "32.231270";
	$entry["lon"] = "-110.978270";
	$entry["description"] = "<b>Tucson&#39;s Hidden Gem Show:</b> Jan 30 – Feb 13, 2020<br/>";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Mineral &amp; Fossil";
	$entry["gemridestop"] = 3;
	$entry["icon"] = "mineral3.png";
	$entry["title"] = "Main Ave./Speedway Blvd. (Sun Tran Bus Stop)";
	$entry["lat"] = "32.238276";
	$entry["lon"] = "-110.976612";
	$entry["description"] = "<b>Main Avenue Gem Show:</b> Jan 30 - Feb 14, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Mineral &amp; Fossil";
	$entry["gemridestop"] = 4;
	$entry["icon"] = "mineral4.png";
	$entry["title"] = "Fortuna Inn & Suites";
	$entry["lat"] = "32.238802";
	$entry["lon"] = "-110.976247";
	$entry["description"] = "<b>Executive Inn Mineral & Fossil Shows:</b> Jan 31 - Feb 15, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Mineral &amp; Fossil";
	$entry["gemridestop"] = 5;
	$entry["icon"] = "mineral5.png";
	$entry["title"] = "1300 N. Stone Ave.";
	$entry["lat"] = "32.239247";
	$entry["lon"] = "-110.972097";
	$entry["description"] = "<b>American Indian Exposition:</b> Jan 26 - Feb 16, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Mineral &amp; Fossil";
	$entry["gemridestop"] = 6;
	$entry["icon"] = "mineral6.png";
	$entry["title"] = "Lester St./10th Ave.";
	$entry["lat"] = "32.243619";
	$entry["lon"] = "-110.974747";
	$entry["description"] = "<b>Madagascar Minerals Gem Show:</b> Jan 20 - Feb 15, 2020<br/><b>1820 Oracle Wholesale Show:</b> Jan 27 - Feb 14, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Mineral &amp; Fossil";
	$entry["gemridestop"] = 7;
	$entry["icon"] = "mineral7.png";
	$entry["title"] = "Lester St./11th Ave.";
	$entry["lat"] = "32.243780";
	$entry["lon"] = "-110.976470";
	$entry["description"] = "<b>1820 Oracle Wholesale Show:</b> Jan 29 - Feb 16, 10am - 5pm<br/><b>Just Minerals Event:</b> Feb 1 - Feb 3, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Mineral &amp; Fossil";
	$entry["gemridestop"] = 8;
	$entry["icon"] = "mineral8.png";
	$entry["title"] = "Grand Luxe Hotel & Resort";
	$entry["lat"] = "32.243702";
	$entry["lon"] = "-110.976344";
	$entry["description"] = "<b>1801 Oracle Mineral, Gem & Fossil Show:</b> Jan 27 - Feb 17, 10am - 5pm<br/><b>Mineral City/Silver Street:</b> Feb 1 - Feb 15, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Mineral &amp; Fossil";
	$entry["gemridestop"] = 9;
	$entry["icon"] = "mineral9.png";
	$entry["title"] = "Ramada Limited Tucson West";
	$entry["lat"] = "32.242568";
	$entry["lon"] = "-110.976354";
	$entry["description"] = "<b>La Fuente de Piedras Mineral Show:</b> Jan 24 - Feb 10, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Mineral &amp; Fossil";
	$entry["gemridestop"] = 10;
	$entry["icon"] = "mineral10.png";
	$entry["title"] = "1333 N. Oracle Rd.";
	$entry["lat"] = "32.239715";
	$entry["lon"] = "-110.978194";
	$entry["description"] = "<b>Arizona Mineral & Fossil Marketplace:</b> Feb 1 - Feb 15, 2020";
	$jsonarr[] = $entry;
	
	$entry["gemrideloop"] = "Mineral &amp; Fossil";
	$entry["gemridestop"] = 11;
	$entry["icon"] = "mineral11.png";
	$entry["title"] = "Monterey Court";
	$entry["lat"] = "32.249873";
	$entry["lon"] = "-110.981001";
	$entry["description"] = "";
	$jsonarr[] = $entry;
	
	$entry["gemrideloop"] = "Mineral &amp; Fossil";
	$entry["gemridestop"] = 12;
	$entry["icon"] = "mineral12.png";
	$entry["title"] = "Tucson&#39;s New Mineral Show";
	$entry["lat"] = "32.250820";
	$entry["lon"] = "-110.989160";
	$entry["description"] = "";
	$jsonarr[] = $entry;
	
	$entry["gemrideloop"] = "Mineral &amp; Fossil";
	$entry["gemridestop"] = 13;
	$entry["icon"] = "mineral13.png";
	$entry["title"] = "Grand Luxe Hotel & Resort";
	$entry["lat"] = "32.249550";
	$entry["lon"] = "-110.993650";
	$entry["description"] = "<b>Grant Gem & Jewelry Show:</b> Jan 30 - Feb 12, 2020";
	$jsonarr[] = $entry;
	
	$entry["gemrideloop"] = "Mineral &amp; Fossil";
	$entry["gemridestop"] = 14;
	$entry["icon"] = "mineral14.png";
	$entry["title"] = "Days Inn Tucson City Center";
	$entry["lat"] = "32.231513";
	$entry["lon"] = "-110.984036";
	$entry["description"] = "<b>Fossil & Mineral Alley at Days Inn Tucson City Center:</b> Feb 1 - Feb 15, 2020";
	$jsonarr[] = $entry;
	
	/////////////////////////////
	
	$entry["gemrideloop"] = "Kino";
	$entry["gemridestop"] = 1;
	$entry["icon"] = "kino1.png";
	$entry["title"] =  "Kino Gem Loop Shuttle/Parking Hub";
	$entry["lat"] = "32.172730";
	$entry["lon"] = "-110.930120";
	$entry["description"] = "Parking Hub Official Gem, Mineral & Fossil Showcase Concierge";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Kino";
	$entry["gemridestop"] = 2;
	$entry["icon"] = "kino2.png";
	$entry["title"] =  "Kino Sports Complex";
	$entry["lat"] = "32.175667";
	$entry["lon"] = "-110.933515";
	$entry["description"] = "<b>Kino Sports Complex Gem Show:</b> Jan 30 - Feb 16, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Kino";
	$entry["gemridestop"] = 3;
	$entry["icon"] = "kino3.png";
	$entry["title"] =  "Holidome";
	$entry["lat"] = "32.170170";
	$entry["lon"] = "-110.925630";
	$entry["description"] = "<b>Holidome by Gem & Lapidary Wholesalers, Inc.:</b> Feb 1 - Feb 9, 2020<br/><b>Gem Mall by Gem & Lapidary Wholesalers:</b> Feb 1 – Feb 9, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Kino";
	$entry["gemridestop"] = 4;
	$entry["icon"] = "kino4.png";
	$entry["title"] =  "JG&M Expo Michigan St.";
	$entry["lat"] = "32.170245";
	$entry["lon"] = "-110.924910";
	$entry["description"] = "<b>JG&M Expo Michigan St.:</b> Feb 1 - Feb 16, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Kino";
	$entry["gemridestop"] = 5;
	$entry["icon"] = "kino5.png";
	$entry["title"] =  "Tucson Expo Center";
	$entry["lat"] = "32.161420";
	$entry["lon"] = "-110.912380";
	$entry["description"] = "<b>JOGS Tucson Gem and Jewelry Show:</b> Jan 30 - Feb 10, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Kino";
	$entry["gemridestop"] = 6;
	$entry["icon"] = "kino6.png";
	$entry["title"] =  "Stay Tucson Inn &amp; Suites";
	$entry["lat"] = "32.156600";
	$entry["lon"] = "-110.917860";
	$entry["description"] = "<b>Silk Road Gem Shows:</b> Jan 28 - Feb 11, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Kino";
	$entry["gemridestop"] = 7;
	$entry["icon"] = "kino7.png";
	$entry["title"] =  "1500 E Apache Park Place";
	$entry["lat"] = "32.170970";
	$entry["lon"] = "-110.948910";
	$entry["description"] = "<b>Arizona Independent Warehouse Show:</b> Jan 26 - Feb 16, 2020";
	$jsonarr[] = $entry;	

	$entry["gemrideloop"] = "Kino";
	$entry["gemridestop"] = 8;
	$entry["icon"] = "kino8.png";
	$entry["title"] =  "Kino Sports Complex";
	$entry["lat"] = "32.177100";
	$entry["lon"] = "-110.935231";
	$entry["description"] = "<b>Kino Sports Complex Gem Show:</b> Jan 30 - Feb 16, 2020";
	$jsonarr[] = $entry;	

	/////////////////////////////
	
	$entry["gemrideloop"] = "Casino del Sol";
	$entry["gemridestop"] = 1;
	$entry["icon"] = "bead1.png";
	$entry["title"] = "Downtown Mercado Shuttle/Parking Hub";
	$entry["lat"] = "32.219264";
	$entry["lon"] = "-110.983382";
	$entry["description"] = "<b>African Art Village:</b> Feb 1 – Feb 16, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Casino del Sol";
	$entry["gemridestop"] = 2;
	$entry["icon"] = "bead2.png";
	$entry["title"] = "Tucson Convention Center";
	$entry["lat"] = "32.217839";
	$entry["lon"] = "-110.975899";
	$entry["description"] = "<b>Gem & Jewelry Exchange AGTA GemFair&trade; Tucson:</b> Feb 4 – Feb 9, 2020<br/><b>66th Annual Tucson Gem and Mineral Show&reg;:</b> Feb 13 – Feb 16, 2020";
	$jsonarr[] = $entry;

	$entry["gemrideloop"] = "Casino del Sol";
	$entry["gemridestop"] = 3;
	$entry["icon"] = "bead3.png";
	$entry["title"] =  "Casino Del Sol Resort";
	$entry["lat"] = "32.133070";
	$entry["lon"] = "-111.085570";
	$entry["description"] = "<b>Colors of the Stone:</b> Feb 1 - Feb 8, 2020";
	$jsonarr[] = $entry;	

	$entry["gemrideloop"] = "Casino del Sol";
	$entry["gemridestop"] = 4;
	$entry["icon"] = "bead4.png";
	$entry["title"] =  "Kino Shuttle/Parking Hub";
	$entry["lat"] = "32.172730";
	$entry["lon"] = "-110.930120";
	$entry["description"] = "Parking hub - 2901 E. Milber St.";
	$jsonarr[] = $entry;	
	
}

elseif ($shuttle == "a") {
	$entry["lat"] = "32.227651";
	$entry["lon"] = "-110.978117";
	$jsonarr[] = $entry;
	
	$entry["lat"] = "32.230638";
	$entry["lon"] = "-110.977905";
	$jsonarr[] = $entry;
	
	$entry["lat"] = "32.235909";
	$entry["lon"] = "-110.9779";
	$jsonarr[] = $entry;

}

elseif ($shuttle == "b") {
	$entry["lat"] = "32.227000";
	$entry["lon"] = "-110.978030";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.226968";
	$entry["lon"] = "-110.978014";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.226884";
	$entry["lon"] = "-110.978406";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.226736";
	$entry["lon"] = "-110.978773";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.226780";
	$entry["lon"] = "-110.979020";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.226879";
	$entry["lon"] = "-110.979055";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.227002";
	$entry["lon"] = "-110.978730";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.227000";
	$entry["lon"] = "-110.978030";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.227325";
	$entry["lon"] = "-110.978123";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.227651";
	$entry["lon"] = "-110.978117";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.227778";
	$entry["lon"] = "-110.978686";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.229022";
	$entry["lon"] = "-110.981014";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.229249";
	$entry["lon"] = "-110.981728";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.229312";
	$entry["lon"] = "-110.982833";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.231139";
	$entry["lon"] = "-110.983425";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.233226";
	$entry["lon"] = "-110.984005";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.237927";
	$entry["lon"] = "-110.985121";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.240377";
	$entry["lon"] = "-110.986065";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.243553";
	$entry["lon"] = "-110.987910";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.249245";
	$entry["lon"] = "-110.992692";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.250302";
	$entry["lon"] = "-110.993567";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.250341";
	$entry["lon"] = "-110.995463";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.249196";
	$entry["lon"] = "-110.995447";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.250341";
	$entry["lon"] = "-110.995463";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.250323";
	$entry["lon"] = "-110.992202";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.245735";
	$entry["lon"] = "-110.988586";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.243717";
	$entry["lon"] = "-110.986880";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.240069";
	$entry["lon"] = "-110.984799";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.235767";
	$entry["lon"] = "-110.983447";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.235909";
	$entry["lon"] = "-110.9779";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.239049";
	$entry["lon"] = "-110.97797";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.239521";
	$entry["lon"] = "-110.977943";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.239403";
	$entry["lon"] = "-110.977203";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.239467";
	$entry["lon"] = "-110.971830";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.238524";
	$entry["lon"] = "-110.971814";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.238542";
	$entry["lon"] = "-110.970285";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.239486";
	$entry["lon"] = "-110.970301";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.239467";
	$entry["lon"] = "-110.971830";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.243814";
	$entry["lon"] = "-110.971868";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.243782";
	$entry["lon"] = "-110.975698";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.243773";
	$entry["lon"] = "-110.978101";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.242661";
	$entry["lon"] = "-110.978104";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.240474";
	$entry["lon"] = "-110.978093";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.240093";
	$entry["lon"] = "-110.978061";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.239521";
	$entry["lon"] = "-110.977943";
	$jsonarr[] = $entry;

}

elseif ($shuttle == "green") {

	$entry["lat"] = "32.239521";
	$entry["lon"] = "-110.977943";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.226942";
	$entry["lon"] = "-110.978012";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.223586";
	$entry["lon"] = "-110.977004";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.222515";
	$entry["lon"] = "-110.976500";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.222421";
	$entry["lon"] = "-110.976893";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.222489";
	$entry["lon"] = "-110.978714";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.222591";
	$entry["lon"] = "-110.979516";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.222391";
	$entry["lon"] = "-110.979516";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.221615";
	$entry["lon"] = "-110.978878";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.221291";
	$entry["lon"] = "-110.978601";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.221071";
	$entry["lon"] = "-110.978422";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.221226";
	$entry["lon"] = "-110.977026";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.221263";
	$entry["lon"] = "-110.976103";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.220627";
	$entry["lon"] = "-110.975845";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.219511";
	$entry["lon"] = "-110.975953";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.218685";
	$entry["lon"] = "-110.976360";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217414";
	$entry["lon"] = "-110.977884";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217242";
	$entry["lon"] = "-110.978538";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217142";
	$entry["lon"] = "-110.980770";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217287";
	$entry["lon"] = "-110.981467";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217786";
	$entry["lon"] = "-110.982830";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217822";
	$entry["lon"] = "-110.983366";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217768";
	$entry["lon"] = "-110.983849";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.218576";
	$entry["lon"] = "-110.984042";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.220437";
	$entry["lon"] = "-110.983860";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.220736";
	$entry["lon"] = "-110.980909";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.220640";
	$entry["lon"] = "-110.980708";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.220427";
	$entry["lon"] = "-110.980499";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.219110";
	$entry["lon"] = "-110.980317";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.218530";
	$entry["lon"] = "-110.980252";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.214725";
	$entry["lon"] = "-110.980073";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.205876";
	$entry["lon"] = "-110.980126";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.205876";
	$entry["lon"] = "-110.980074";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.206667";
	$entry["lon"] = "-110.980074";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.206703";
	$entry["lon"] = "-110.979010";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.209700";
	$entry["lon"] = "-110.978962";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.214674";
	$entry["lon"] = "-110.979112";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.214900";
	$entry["lon"] = "-110.978399";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.214674";
	$entry["lon"] = "-110.979112";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217069";
	$entry["lon"] = "-110.979010";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217132";
	$entry["lon"] = "-110.978439";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217386";
	$entry["lon"] = "-110.977715";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.216996";
	$entry["lon"] = "-110.977302";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.216841";
	$entry["lon"] = "-110.976857";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.216746";
	$entry["lon"] = "-110.976283";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.216737";
	$entry["lon"] = "-110.975735";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.218266";
	$entry["lon"] = "-110.975741";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.218357";
	$entry["lon"] = "-110.975961";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.218675";
	$entry["lon"] = "-110.976283";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.219537";
	$entry["lon"] = "-110.975864";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.220622";
	$entry["lon"] = "-110.975719";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.221302";
	$entry["lon"] = "-110.975939";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.221389";
	$entry["lon"] = "-110.973810";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.221048";
	$entry["lon"] = "-110.972377";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.220980";
	$entry["lon"] = "-110.971675";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.221162";
	$entry["lon"] = "-110.969754";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.221216";
	$entry["lon"] = "-110.967067";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.222945";
	$entry["lon"] = "-110.967034";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.224702";
	$entry["lon"] = "-110.968987";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.226308";
	$entry["lon"] = "-110.971428";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.226372";
	$entry["lon"] = "-110.971734";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.226394";
	$entry["lon"] = "-110.972812";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.226540";
	$entry["lon"] = "-110.973558";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.226789";
	$entry["lon"] = "-110.973944";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.227601";
	$entry["lon"] = "-110.975285";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.227724";
	$entry["lon"] = "-110.975585";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.227747";
	$entry["lon"] = "-110.977838";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.227783";
	$entry["lon"] = "-110.978144";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.227311";
	$entry["lon"] = "-110.978155";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.227025";
	$entry["lon"] = "-110.978090";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.227021";
	$entry["lon"] = "-110.978756";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.226880";
	$entry["lon"] = "-110.979094";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.226753";
	$entry["lon"] = "-110.979026";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.226715";
	$entry["lon"] = "-110.978787";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.226884";
	$entry["lon"] = "-110.978359";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.226942";
	$entry["lon"] = "-110.978012";
	$jsonarr[] = $entry;

}

elseif ($shuttle == "kino") {

	$entry["lat"] = "32.215122";
	$entry["lon"] = "-110.909034";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.215129";
	$entry["lon"] = "-110.909683";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.196144";
	$entry["lon"] = "-110.909541";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.195427";
	$entry["lon"] = "-110.909681";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.194474";
	$entry["lon"] = "-110.910260";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.194029";
	$entry["lon"] = "-110.910829";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.191688";
	$entry["lon"] = "-110.914782";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.189698";
	$entry["lon"] = "-110.916719";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.188953";
	$entry["lon"] = "-110.917105";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.189280";
	$entry["lon"] = "-110.917684";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.190742";
	$entry["lon"] = "-110.917159";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.191069";
	$entry["lon"] = "-110.918629";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.191069";
	$entry["lon"] = "-110.926477";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.182861";
	$entry["lon"] = "-110.926477";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.182842";
	$entry["lon"] = "-110.928252";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.182497";
	$entry["lon"] = "-110.928800";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.182107";
	$entry["lon"] = "-110.929239";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.181881";
	$entry["lon"] = "-110.929634";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.181772";
	$entry["lon"] = "-110.929714";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.181772";
	$entry["lon"] = "-110.930707";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.178983";
	$entry["lon"] = "-110.930707";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.178983";
	$entry["lon"] = "-110.932029";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.174851";
	$entry["lon"] = "-110.932029";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.174851";
	$entry["lon"] = "-110.930752";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.172681";
	$entry["lon"] = "-110.930752";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.172681";
	$entry["lon"] = "-110.926332";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.169690";
	$entry["lon"] = "-110.926332";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.169690";
	$entry["lon"] = "-110.923306";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.167032";
	$entry["lon"] = "-110.923306";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.167032";
	$entry["lon"] = "-110.922019";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.171638";
	$entry["lon"] = "-110.922019";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.171638";
	$entry["lon"] = "-110.918967";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.170639";
	$entry["lon"] = "-110.918967";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.170639";
	$entry["lon"] = "-110.917722";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.163138";
	$entry["lon"] = "-110.917722";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.163138";
	$entry["lon"] = "-110.912191";
	$jsonarr[] = $entry;	
	
}	

elseif ($shuttle == "paloverde") {
	$entry["lat"] = "32.182861";
	$entry["lon"] = "-110.926477";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.172681";
	$entry["lon"] = "-110.926332";
	$jsonarr[] = $entry;
}

elseif ($shuttle == "tgms") {

	$entry["lat"] = "32.218975";
	$entry["lon"] = "-110.983970";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.218648";
	$entry["lon"] = "-110.984042";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217768";
	$entry["lon"] = "-110.983828";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217723";
	$entry["lon"] = "-110.983055";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217102";
	$entry["lon"] = "-110.980877";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217105";
	$entry["lon"] = "-110.978646";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217162";
	$entry["lon"] = "-110.978439";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217366";
	$entry["lon"] = "-110.977715";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.216980";
	$entry["lon"] = "-110.977302";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.216824";
	$entry["lon"] = "-110.976857";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.216729";
	$entry["lon"] = "-110.976283";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.216720";
	$entry["lon"] = "-110.975715";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.218276";
	$entry["lon"] = "-110.975715";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.218367";
	$entry["lon"] = "-110.975951";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.218685";
	$entry["lon"] = "-110.976273";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217366";
	$entry["lon"] = "-110.977715";
	$jsonarr[] = $entry;

}

elseif ($shuttle == "streetcar") {

	$entry["lat"] = "32.237343";
	$entry["lon"] = "-110.946314";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.237316";
	$entry["lon"] = "-110.946872";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.233790";
	$entry["lon"] = "-110.946754";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.233790";
	$entry["lon"] = "-110.956788";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.231724";
	$entry["lon"] = "-110.956764";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.231651";
	$entry["lon"] = "-110.965648";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.223824";
	$entry["lon"] = "-110.965570";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.222322";
	$entry["lon"] = "-110.966004";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.222116";
	$entry["lon"] = "-110.966228";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.221875";
	$entry["lon"] = "-110.971264";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.221558";
	$entry["lon"] = "-110.973854";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.221392";
	$entry["lon"] = "-110.975863";
	$jsonarr[] = $entry;
	
	$entry["lat"] = "32.221327";
	$entry["lon"] = "-110.976005";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.221197";
	$entry["lon"] = "-110.976075";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.221109";
	$entry["lon"] = "-110.976056";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.220669";
	$entry["lon"] = "-110.975879";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.220446";
	$entry["lon"] = "-110.975863";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.219532";
	$entry["lon"] = "-110.975982";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.218874";
	$entry["lon"] = "-110.976288";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.218479";
	$entry["lon"] = "-110.976680";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217535";
	$entry["lon"] = "-110.977779";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217276";
	$entry["lon"] = "-110.978439";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217231";
	$entry["lon"] = "-110.979067";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217199";
	$entry["lon"] = "-110.980177";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217185";
	$entry["lon"] = "-110.981009";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217267";
	$entry["lon"] = "-110.981373";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217784";
	$entry["lon"] = "-110.982849";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217843";
	$entry["lon"] = "-110.983278";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217775";
	$entry["lon"] = "-110.983771";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217884";
	$entry["lon"] = "-110.983846";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.218520";
	$entry["lon"] = "-110.984018";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.218728";
	$entry["lon"] = "-110.984045";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.220104";
	$entry["lon"] = "-110.983884";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.220276";
	$entry["lon"] = "-110.983991";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.220335";
	$entry["lon"] = "-110.984174";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.220321";
	$entry["lon"] = "-110.984281";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.220249";
	$entry["lon"] = "-110.985075";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.220203";
	$entry["lon"] = "-110.985150";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.220104";
	$entry["lon"] = "-110.985231";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.219976";
	$entry["lon"] = "-110.985247";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217821";
	$entry["lon"] = "-110.984828";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217703";
	$entry["lon"] = "-110.984742";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217657";
	$entry["lon"] = "-110.984581";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217775";
	$entry["lon"] = "-110.983766";
	$jsonarr[] = $entry;
	
	// EFS - 1/15/2018 - New Coords to Complete Loop
	
	$entry["lat"] = "32.217843";
	$entry["lon"] = "-110.983278";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.217784";
	$entry["lon"] = "-110.982849";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.217267";
	$entry["lon"] = "-110.981373";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.217185";
	$entry["lon"] = "-110.981009";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.217199";
	$entry["lon"] = "-110.980177";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.217231";
	$entry["lon"] = "-110.979067";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.217276";
	$entry["lon"] = "-110.978439";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.217535";
	$entry["lon"] = "-110.977779";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.218479";
	$entry["lon"] = "-110.976680";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.218874";
	$entry["lon"] = "-110.976288";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.219532";
	$entry["lon"] = "-110.975982";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.220446";
	$entry["lon"] = "-110.975863";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.220669";
	$entry["lon"] = "-110.975879";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.221109";
	$entry["lon"] = "-110.976056";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.221197";
	$entry["lon"] = "-110.976075";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.221327";
	$entry["lon"] = "-110.976005";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.221334";
	$entry["lon"] = "-110.975487";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.221402";
	$entry["lon"] = "-110.974050";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.221343";
	$entry["lon"] = "-110.973406";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.220974";
	$entry["lon"] = "-110.972068";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.221189";
	$entry["lon"] = "-110.969447";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.221189";
	$entry["lon"] = "-110.966993";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.221248";
	$entry["lon"] = "-110.965343";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.221498";
	$entry["lon"] = "-110.965295";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.222085";
	$entry["lon"] = "-110.965944";
	$jsonarr[] = $entry;


	$entry["lat"] = "32.222317";
	$entry["lon"] = "-110.966010";
	$jsonarr[] = $entry;
	
}

elseif ($shuttle == "streetcarbroadway") {
	
	$entry["lat"] = "32.221488";
	$entry["lon"] = "-110.974134";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.221352";
	$entry["lon"] = "-110.973469";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.220961";
	$entry["lon"] = "-110.971892";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.221052";
	$entry["lon"] = "-110.970808";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.221170";
	$entry["lon"] = "-110.969285";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.221197";
	$entry["lon"] = "-110.965530";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.221333";
	$entry["lon"] = "-110.965294";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.221533";
	$entry["lon"] = "-110.965347";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.222141";
	$entry["lon"] = "-110.966002";
	$jsonarr[] = $entry;

	$entry["lat"] = "32.222348";
	$entry["lon"] = "-110.965991";
	$jsonarr[] = $entry;	
	
}


elseif ($shuttle == "streetcarstops") {

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "Convento | Congress St.";
	$entry["lat"] = "32.217707";
	$entry["lon"] = "-110.984740";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "Cushing St. | Convento";
	$entry["lat"] = "32.220135";
	$entry["lon"] = "-110.985249";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "Linda Ave. | Cushing St.";
	$entry["lat"] = "32.218039";
	$entry["lon"] = "-110.983897";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "Cushing St. | Frontage Rd.";
	$entry["lat"] = "32.217190";
	$entry["lon"] = "-110.980471";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "Granada Ave. | Cushing St.";
	$entry["lat"] = "32.217694";
	$entry["lon"] = "-110.977604";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "Congress St. | Granada Ave.";
	$entry["lat"] = "32.221420";
	$entry["lon"] = "-110.975626";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "Congress St. | Church Ave.";
	$entry["lat"] = "32.221728";
	$entry["lon"] = "-110.972568";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "Congress St. | Stone Ave.";
	$entry["lat"] = "32.221869";
	$entry["lon"] = "-110.970948";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "Congress St. | 6th Ave.";
	$entry["lat"] = "32.222019";
	$entry["lon"] = "-110.968620";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "Centro Parking Garage";
	$entry["lat"] = "32.221742";
	$entry["lon"] = "-110.965583";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "Broadway Blvd. | Church Ave.";
	$entry["lat"] = "32.221075";
	$entry["lon"] = "-110.972493";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "Broadway Blvd. | Stone Ave.";
	$entry["lat"] = "32.221048";
	$entry["lon"] = "-110.970878";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "Broadway Blvd. | 6th Ave.";
	$entry["lat"] = "32.221211";
	$entry["lon"] = "-110.968453";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "4th Ave. | 9th St.";
	$entry["lat"] = "32.224015";
	$entry["lon"] = "-110.965573";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "4th Ave. | 6th St./7th St.";
	$entry["lat"] = "32.226552";
	$entry["lon"] = "-110.965578";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "4th Ave. | 4th St./5th St.";
	$entry["lat"] = "32.229638";
	$entry["lon"] = "-110.965610";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "University Blvd. | 3rd Ave.";
	$entry["lat"] = "32.231680";
	$entry["lon"] = "-110.964650";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "University Blvd. | Tyndall Ave.";
	$entry["lat"] = "32.231671";
	$entry["lon"] = "-110.958121";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "2nd St. | Olive Rd.";
	$entry["lat"] = "32.233786";
	$entry["lon"] = "-110.955681";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "2nd St. | Highland Ave.";
	$entry["lat"] = "32.233776";
	$entry["lon"] = "-110.951067";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "2nd St. | Cherry Ave.";
	$entry["lat"] = "32.233831";
	$entry["lon"] = "-110.947194";
	$jsonarr[] = $entry;

	$entry["icon"] = "iconstreetcarstop.png";
	$entry["title"] = "Warren Ave. | Helen St.";
	$entry["lat"] = "32.237343";
	$entry["lon"] = "-110.946314";
	$jsonarr[] = $entry;

}

elseif ($shuttle == "dashedpolys") {

	$entry["icon"] = "casinoshuttle_blue.png";
	$entry["title"] = "Casino Del Sol Shuttle";
	$entry["lat"] = "32.127149";
	$entry["lon"] = "-111.081648";
	$entry["color"] = "#005595";
	$jsonarr["shuttlecasinodelsol"][] = $entry;

	$entry["icon"] = "casinoshuttle_blue.png";
	$entry["title"] = "Shuttle end point";
	$entry["lat"] = "32.218958";
	$entry["lon"] = "-110.985110";
	$entry["color"] = "#005595";
	$jsonarr["shuttlecasinodelsol"][] = $entry;

	$entry["icon"] = "hubshuttle_green.png";
	$entry["title"] = "Hub Express Shuttle";
	$entry["lat"] = "32.161395";
	$entry["lon"] = "-110.906982";
	$entry["color"] = "#006f45";
	$jsonarr["shuttlehubexpress"][] = $entry;

	$entry["icon"] = "hubshuttle_green.png";
	$entry["title"] = "Shuttle end point";
	$entry["lat"] = "32.218958";
	$entry["lon"] = "-110.985110";
	$entry["color"] = "#006f45";
	$jsonarr["shuttlehubexpress"][] = $entry;

}

$data = array();
$data["data"] = $jsonarr;
$callback = $_REQUEST['callback'];
if ($callback) {
	//header('Content-Type: text/javascript');
	echo $callback . '(' . json_encode($data) . ');';
} else if ($_REQUEST["json"] == "true") {

	// 23.nov.2k15 - callback adds callback in, so also include 
	//	mobile app json version to leave that untouched
	if ($_REQUEST["all"] == "true") {
		
		if ($OFF_SEASON) {
			$data["data"]["parking"] = array();
			$data["data"]["shuttle"] = array();
			$data["data"]["streetcar"] = array();
			$data["data"]["streetcar_route"] = array();
			$data["data"]["dashedpolys"] = array("shuttlecasinodelsol" => array(), "shuttlehubexpress" => array());
		} else {
			// PENDING: this is not efficient, but it works to keep app development going. this
			//	page should be adjusted to serve this sans calls to itself.
            $dataParking = json_decode(implode("", file("https://maddencdn.com/global/code/gemshow/get_shuttle.php?shuttle=parking&json=true")));
            $dataShuttle = json_decode(implode("", file("https://maddencdn.com/global/code/gemshow/get_shuttle.php?shuttle=stops&json=true")));
            $dataSteetcar = json_decode(implode("", file("https://maddencdn.com/global/code/gemshow/get_shuttle.php?shuttle=streetcarstops&json=true")));
            $dataSteetcarRoute = json_decode(implode("", file("https://maddencdn.com/global/code/gemshow/get_shuttle.php?shuttle=streetcar&json=true"))); 
            $dataDashedPolys = json_decode(implode("", file("https://maddencdn.com/global/code/gemshow/get_shuttle.php?shuttle=dashedpolys&json=true")));
		
			$data["data"]["parking"] = $dataParking->data;
			$data["data"]["shuttle"] = $dataShuttle->data;
			$data["data"]["streetcar"] = $dataStreetcar->data;
			$data["data"]["streetcar_route"] = $dataStreetcarRoute->data;
			$data["data"]["dashedpolys"] = $dataDashedPolys->data;
		
			// 2020 - app is going away so just serve empty data for these
			if (! isset($_REQUEST["web"])) {
				$data["data"]["streetcar"] = array();
				$data["data"]["streetcar_route"] = array();
			}
		}
		
		$wrapper = array(
			"status" => 200,
			"message" => "OK",
			"count" => count($data["data"]),
			"data" => $data["data"]
		);
		echo json_encode($wrapper);
		
	} else {
		$wrapper = array(
			"status" => 200,
			"message" => "OK",
			"count" => count($data["data"]),
			"data" => $data["data"]
		);
		echo json_encode($wrapper);
	}

} else {
	// header('Content-Type: text/html; charset=UTF-8');
	print_r($data);
	// echo json_encode($data);
}



