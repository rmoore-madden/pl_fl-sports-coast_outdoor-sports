<?php
/**
 * mobile kc app v2 database update script
 * @author Curtis Thompson
 *
 * PENDING: not using customfields in events as of now - don't think it's needed
 */

// includes
set_include_path(get_include_path() . PATH_SEPARATOR . '/var/www/html/frameworks/');
class_exists('CronUtil', false) or require 'cron/CronUtil.class.php';
class_exists('CronBase', false) or require 'cron/CronBase.class.php';

class UpdateTucson2016 extends Cronbase {

    // cron settings
    protected $writeData = true;
    protected $echoErrors = false;

    protected $databaseName = 'mobile_Tucson';
    protected $lastUpdateFile = '/var/www/html/global/code/gemshow/last_database_update_2016.txt';

    protected $FEED_URL_LISTINGS = "http://tucson.simpleviewcrm.com/webapi/listings/xml/listings.cfm";
    protected $USERNAME = "Tucson_API";
    protected $PASSWORD = "c@ctusam0unta1n";

    protected $PAGE_SIZE = 250;

    protected $CATEGORY_FIELDS = array(
        'listingid', 'CATNAME', 'CATID', 'SUBCATID', 'SUBCATNAME'
    );

    protected $VALID_CAT_IDS = array("1272", "3", "7");     // "Gem & Lapidary", "Restaurants", "Transportation"
    protected $VALID_SUB_CURL_RUN_LISTING_TYPES = array("Gem & Lapidary");
    protected $SUB_CURL_AMMENTIES_KEYS = array(
        "Wholesale?" => "saletype", 
        "Begin Date" => "startdate", 
        "End Date" => "enddate", 
        "Major Cross Streets" => "crossstreets",
        "Location" => "gemshowlocation",
        "Gem Show Ride Stop #" => "gemridestop",
        "Gem Ride Loop" => "gemrideloop"
    );
    protected $ADDITIONALINFORMATION_KEYS = array(
        "Start Date (Gem Show)" => "startdate", 
        "End Date (Gem Show)" => "enddate", 
        "Gem Ride Loop" => "gemrideloop", 
        "Gem Show Ride Stop #" => "gemridestop", 
    );

    protected $DATETIME_DASH_FORMAT_IN = 'Y-m-d H:i:s';
    protected $DATETIME_LASH_AMPM_FORMAT_IN = 'Y-m-d H:i:s A';
    protected $DATE_DASH_FORMAT_IN = 'm-d-Y';
    protected $DATETIME_SLASH_FORMAT_IN = 'm/d/Y H:i:s';
    protected $DATETIME_SLASH_AMPM_FORMAT_IN = 'm/d/Y H:i:s A';
    protected $DATE_SLASH_FORMAT_IN = 'm/d/Y';
    protected $DATETIME_FORMAT_OUT = 'Y-m-d H:i:s';
    protected $DATE_FORMAT_OUT = 'Y-m-d';

    /**
	 * Common run method
	 * 	on construct this will be run
	 */
    protected function run(PDO $db = NULL) {

        global $argv;
            $this->log('Downloading Listings');
        // parse the listings
        // if ($this->RUN_LISTINGS) {
        if ($argv[1] == "listings") {
            $this->log('Downloading Listings');
            $response_data = "";
            $this->doListingsCurl("getListings", "", 1, 1, $response_data);
            if (empty($response_data)){
                $this->log('Error downloading data for listings');
            } else {
                // learn how many entries there are
                $raw_response_xml = new SimpleXMLElement($response_data);
                $response = CronUtil::simplexmlToArray($raw_response_xml);
                $data_count = intval($response["REQUESTSTATUS"]["RESULTS"]);
                if ($data_count > 0) {
                    // loop through pages
                    $retrieved = 0;
                    $page = 1;
                    while ($retrieved <= $data_count) {
                        // now get the total number of items
                        $raw_data = "";
                        $this->doListingsCurl("getListings", "", $page, $this->PAGE_SIZE, $raw_data);
                        $raw_xml = new SimpleXMLElement($raw_data);
                        $truncate = ($page == 1) ? true : false;
                        $this->parseListings($db, CronUtil::simplexmlToArray($raw_xml), $truncate);

                        // DEBUG
                        // echo "<hr>{$page} / {$retrieved}";
                        // echo "<pre>";
                        // $dr = CronUtil::simplexmlToArray($raw_response_xml);
                        // $dc = intval($dr["REQUESTSTATUS"]["RESULTS"]);
                        // echo count($response['LISTINGS']['LISTING'])." | {$data_count}<br/>";
                        // echo "</pre>";

                        // talles
                        $page++;
                        $retrieved += $this->PAGE_SIZE;
                    }
                }
            }
        }
    }

    /**
	 * parse the listings
	 */
    protected function parseListings(PDO $db, $xml, $truncate=false) {

        $tablename_listing = "v2_listings";
        $tablename_listing_category = "v2_listingcategory";
        $counter = 0;

        // archive
        if ( ($truncate) && (count($xml['LISTINGS']['LISTING']) > 0) && ($this->writeData) ) {
            $this->log("Emptying {$tablename_listing} and {$tablename_listing_category} tables");
            $db->query("TRUNCATE TABLE {$tablename_listing_category}");
            $db->query("TRUNCATE TABLE {$tablename_listing}");
        }

        // get the valid fields
        $valid_fields = $db->query("SHOW COLUMNS FROM {$tablename_listing}")->fetchAll(PDO::FETCH_COLUMN);
        $valid_cat_fields = $db->query("SHOW COLUMNS FROM {$tablename_listing_category}")->fetchAll(PDO::FETCH_COLUMN);

        // custom prep work needed
        $dateFields = array('CREATED', 'LASTUPDATED');
        $urlFields = array('WEBURL');
        $imageFields = array('LOGOFILE', 'PHOTOFILE');

        // just shoot me
        for ($i=0; $i < count($valid_fields); $i++) { $valid_fields[$i] = strtoupper($valid_fields[$i]); }
        for ($i=0; $i < count($valid_cat_fields); $i++) { $valid_cat_fields[$i] = strtoupper($valid_cat_fields[$i]); }
        // loop
        foreach ($xml['LISTINGS']['LISTING'] as $listing) {

            $fieldsValues = array();

            echo "--------------------------------------------------------------------------\n";
            echo "--------------------------------------------------------------------------\n";
            echo "--------------------------------------------------------------------------\n";
            echo "--------------------------------------------------------------------------\n";
            print_r($listing);
            echo $listing['LISTINGID'] . " / " . $listing['COMPANY'] . "\n";

            foreach ($listing as $field => $value) {
                // get the extra data for this listing via another cURL call
                if (($field == 'LISTINGID') && (in_array($listing['CATNAME'], $this->VALID_SUB_CURL_RUN_LISTING_TYPES)) ) {
                    $this->doListingsCurl("getListing", $listing['LISTINGID'], 1, 0, $listing_response_data);
                    if (empty($listing_response_data)){
                        $this->log("Error downloading meta data for listing: {$value}");
                        echo "Error downloading meta data for listing: {$value}\n";
                    } else {
                        // learn how many entries there are
                        $raw_listing_response_xml = new SimpleXMLElement($listing_response_data);
                        $listing_response = CronUtil::simplexmlToArray($raw_listing_response_xml);

                        // DEBUG
                        echo "|||--------------------------------------------------------------------------\n";
                        echo "|||--------------------------------------------------------------------------\n";
                        print_r($listing_response);
                        echo $listing['LISTINGID'] . " / " . $listing['COMPANY'] . "\n";

                        // get the amenities
                        foreach ($listing_response['LISTING']['AMENITIES']['ITEM'] as $meta) {
                            if (in_array($meta['NAME'], array_keys($this->SUB_CURL_AMMENTIES_KEYS))) {
                                $ak = $this->SUB_CURL_AMMENTIES_KEYS[$meta['NAME']];
                                if ( (isset($meta['VALUEARRAY'])) && (is_array($meta['VALUEARRAY'])) ) {
                                    // get the value array data
                                    $allVAs = array();
                                    foreach ($meta['VALUEARRAY'] as $va) {
                                        if (isset($va['LISTVALUE'])) {
                                            $allVAs[] = $va['LISTVALUE'];
                                        }
                                    }
                                    // PENDING is a comma-delimited list good for all?
                                    $fieldsValues[strtoupper(":{$ak}")] = implode(",", $allVAs);
                                } else if (isset($meta['VALUE'])) {
                                    // simple value
                                    $fieldsValues[strtoupper(":{$ak}")] = $meta['VALUE'];
                                }

                                // DEBUG
                                // echo "-----------------------\n";
                                // echo strtoupper(":{$ak}")."\n";
                                // print_r($fieldsValues[strtoupper(":{$ak}")]);
                                // echo "\n";
                            }
                        }

                        // get the additional info (new dates)
                        foreach ($listing_response['LISTING']['ADDITIONALINFORMATION']['ITEM'] as $meta) {
                            if (in_array($meta['NAME'], array_keys($this->ADDITIONALINFORMATION_KEYS))) {
                                $ak = $this->ADDITIONALINFORMATION_KEYS[$meta['NAME']];
                                if (isset($meta['VALUE']) && $meta['VALUE'] != '') {
                                    // simple value
                                    $fieldsValues[strtoupper(":{$ak}")] = $meta['VALUE'];
                                    // DEBUG
                                    //                                 echo "-----------------------\n";
                                    //                                 echo strtoupper(":{$ak}")."\n";
                                    //                                 print_r($fieldsValues[strtoupper(":{$ak}")]);
                                    //                                 echo "\n";
                                }

                            }
                        }
                    }
                }

                // remove $nbsp; in the description field
                if ($field == 'DESCRIPTION') {
                    $value = str_replace("&nbsp;", " ", $value);				
                }

                if ($field == 'ADDITIONALSUBCATS') {
                    // parse listing categories into the database
                    if ( (isset($listing['ADDITIONALSUBCATS']['ITEM'])) && 
                        (is_array($listing['ADDITIONALSUBCATS']['ITEM'])) ) {
                        if (is_array($listing['ADDITIONALSUBCATS']['ITEM'][0])) {
                            // multiple entries
                            $this->parseCategories($tablename_listing_category, $listing['ADDITIONALSUBCATS']['ITEM'], 'LISTINGID', $fieldsValues[':LISTINGID'], $db);
                        } else {
                            // just one
                            $this->parseCategories($tablename_listing_category, $value, 'LISTINGID', $fieldsValues[':LISTINGID'], $db);
                        }
                    }
                }

                if ($field == 'SUBCATNAME') {
                    // main subcategory is in entry - add it to the listings category
                    $sc_fieldValues = array(
                        $this->CATEGORY_FIELDS[0] => $fieldsValues[':LISTINGID'],
                        $this->CATEGORY_FIELDS[1] => $listing[$this->CATEGORY_FIELDS[1]],
                        $this->CATEGORY_FIELDS[2] => $listing[$this->CATEGORY_FIELDS[2]],
                        $this->CATEGORY_FIELDS[3] => $listing[$this->CATEGORY_FIELDS[3]],
                        $this->CATEGORY_FIELDS[4] => $listing[$this->CATEGORY_FIELDS[4]]
                    );
                    $stmtAddCat = $db->prepare("REPLACE INTO {$tablename_listing_category} (" 
                                               . strtolower(implode(', ', $this->CATEGORY_FIELDS)) 
                                               . ") VALUES (:" . implode(', :', $this->CATEGORY_FIELDS) . ")");
                    $stmtAddCat->execute($sc_fieldValues);

                }

                if (in_array($field, $valid_fields)) {
                    // add the fields and values

                    // parse dates
                    if (in_array($field, $dateFields)) {
                        $value = $this->formatDate($field, $value);
                    }

                    // add url protocol
                    if (in_array($field, $urlFields)) {
                        if ($value != "") {
                            $value = CronUtil::addProtocolToAddress($value);						
                        }
                    }

                    // deal with image paths
                    if (in_array($field, $imageFields)) {
                        if ($value != "") {
                            // they have image meta, plus they need the root from another field
                            $bits = explode("/", $value, 2);
                            // it's better to just not have a busted path, so clear it out if we can't match
                            $value = ($bits[1] != "") ? ($listing["IMGPATH"].$bits[1]) : "";
                        }
                    }

                    // add to fields values
                    if ($field != "") {
                        $fieldsValues[":{$field}"] = $value;
                    }
                }
            }

            // perform the listing query
            $stmtAddListing = $db->prepare(
                "REPLACE INTO {$tablename_listing} (" . str_replace(':', '', strtolower(implode(', ', array_keys($fieldsValues))))
                .	') VALUES (' . implode(', ', array_keys($fieldsValues)) . ')'
            );

            //print_r($fieldsValues);

            if ($this->writeData) {
                // our skip test somehow lets these through
                if ($fieldsValues[":LISTINGID"] != "") {
                    $stmtAddListing->execute($fieldsValues);
                    $counter++;
                }
            }
            // DEBUG
            //            echo "|||--------------------------------------------------------------------------\n";
            //            echo "|||--------------------------------------------------------------------------\n";
            //            print_r($fieldsValues);
            //            echo $listing['LISTINGID'] . " / " . $listing['COMPANY'] . "\n";
        }

        // log
        $this->log("parsed {$tablename_listing} ({$counter})");
    }

    /**
	 * parse categories helper method to put associative categories in the database
	 * @param String $tablename the name of the table
	 * @param Array $categories the categories to parse
	 * @param String $assoc_id_name the name of the accociative id
	 * @param Integer $assoc_id_value the value of the accociative id
	 */
    protected function parseCategories($tablename, $categories, $assoc_id_name, $assoc_id_value, PDO $db) {

        // build the fields
        $fields = array();

        if (strpos($tablename, 'coupon') !== false) {
            $fields = array($assoc_id_name, $this->CATEGORY_COUPON_FIELDS[1], $this->CATEGORY_COUPON_FIELDS[2]);			
        } else {
            $fields = array($assoc_id_name, $this->CATEGORY_FIELDS[1], $this->CATEGORY_FIELDS[2]);
            if (strpos($tablename, 'listing') !== false) {
                $fields[] = $this->CATEGORY_FIELDS[3];
                $fields[] = $this->CATEGORY_FIELDS[4];
            }			
        }

        $stmtAddCat = $db->prepare("REPLACE INTO {$tablename} (" 
                                   . strtolower(implode(', ', $fields)) 
                                   . ") VALUES (:" . strtolower(implode(', :', $fields)) . ")");

        foreach ($categories as $cat) {
            // assure default param values
            $params = array(strtolower(":{$assoc_id_name}") => $assoc_id_value);
            foreach ($fields as $field) {
                $field = strtolower($field);
                if (!isset($params[":{$field}"])) {
                    $params[":{$field}"] = '';	
                }
            }

            // put actual values into the params
            foreach ($cat as $field => $val) {
                // simpleview has varied field names. yay!
                if (strpos($tablename, 'event') !== false) {
                    $field = str_replace("category", "cat", $field);
                }
                if (preg_grep("/{$field}/i", $fields)) {
                    $params[strtolower(":{$field}")] = $val;	
                }
            }

            if ($this->writeData) {
                $stmtAddCat->execute($params);
            }
        }
    }

    /**
	 * A function for code cleanliness up above
	 */
    protected function doListingsCurl ($action, $listingId="", $pagenum, $pagesize, &$return) {

        $post_data = array(
            "action" => $action,
            "username" => $this->USERNAME,
            "password" => $this->PASSWORD,
            "pagenum" => $pagenum,
            "pagesize" => $pagesize,
            // "filters" => $this->formatFilterGroupXML($filterGroupXML)
        );

        // for a specific listing?
        if ($listingId != "") {
            $post_data["listingid"] = $listingId;
        }

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
                CURLOPT_URL => $this->FEED_URL_LISTINGS,
                CURLOPT_POST => count($post_data),
                CURLOPT_POSTFIELDS => $post_body,
                CURLOPT_RETURNTRANSFER => 1,
                CURLOPT_HTTPHEADER => array('Connection: close'),
                CURLOPT_SSL_VERIFYPEER => FALSE,
                CURLOPT_SSL_VERIFYHOST => 2,
            )
        );

        $return = curl_exec($ch);

        // DEBUG
        // echo $return;

        curl_close($ch);
    }

    /**
	 * Formats a date.
	 */
    protected function formatDate ($field, $dateStr) {
        $fDateStr = "";

        if ($dateStr != "") {
            // in
            if (strpos($dateStr, ":") !== false) {
                // date and time
                if (preg_match("/[AM|PM]$/", $dateStr)) {
                    $formatIn = (strpos($dateStr, "/") !== false) ? $this->DATETIME_SLASH_AMPM_FORMAT_IN : $this->DATETIME_DASH_AMPM_FORMAT_IN;
                } else {
                    $formatIn = (strpos($dateStr, "/") !== false) ? $this->DATETIME_SLASH_FORMAT_IN : $this->DATETIME_DASH_FORMAT_IN;					
                }
            } else {
                // just date
                $formatIn = (strpos($dateStr, "/") !== false) ? $this->DATE_SLASH_FORMAT_IN : $this->DATE_DASH_FORMAT_IN;
            }
            // out
            $formatOut = (strpos($dateStr, ":") !== false) ? $this->DATETIME_FORMAT_OUT : $this->DATE_FORMAT_OUT;

            // occasionally they have a microsecond on a date - just get rid of it
            $dateStr = preg_replace("/\.[\d]+$/", "", $dateStr);

            // DEBUG
            // echo "DATE $field / $dateStr ($formatIn || $formatOut)";

            // format
            $date = DateTime::createFromFormat($formatIn, $dateStr);
            $fDateStr = $date->format($formatOut);

            // DEBUG
            // echo " = '{$fDate}'\n";
        }

        return $fDateStr;
    }

    /**
     * Formats XML for filtering category IDs for POST request
     */
    protected function formatFilterGroupXML ($filterGroupXML) {
        $filterGroupXML = "<FILTERGROUP><FILTERS>";
        for ($i=0; $i < count($this->VALID_CAT_IDS); $i++) {
            $filterGroupXML .= "<ITEM><FIELDCATEGORY>Listing</FIELDCATEGORY><FIELDNAME>CatID</FIELDNAME><FILTERTYPE>Equal To</FILTERTYPE><FILTERVALUE>";

            $catid = $this->VALID_CAT_IDS[$i];
            $filterGroupXML .= $catid;

            $filterGroupXML .= "</FILTERVALUE></ITEM>";
        }
        $filterGroupXML .= "</FILTERS><ANDOR>OR</ANDOR></FILTERGROUP>";

        return $filterGroupXML;
    }
    
}
// run it
$cron = new UpdateTucson2016(__FILE__);
