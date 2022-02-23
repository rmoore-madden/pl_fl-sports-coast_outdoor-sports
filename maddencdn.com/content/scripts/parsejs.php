<?php 

// we are json!
header("Content-type: application/json; charset=utf-8");

/********************************
			CONSTANTS
*********************************/
define('OLDEST_YEAR_TO_SEARCH', 2014);
define('DEBUG', false);

/********************************
			 MAIN
*********************************/

// No nulls allowed!
@$keyword = isset($_REQUEST['kw']) ? urldecode($_REQUEST['kw']) : "";
@$year = isset($_REQUEST['yr']) ? urldecode($_REQUEST['yr']) : 0;

$log = "";
$finalResult = search($year, $keyword);

echo json_encode($finalResult);

//echo phpinfo();
if(DEBUG){
	echo $log;
}

/********************************
			FUNCTIONS
*********************************/

// Master search function
function search($year = 0, $keyword){	// Keyword should ALWAYS be present
	$results = array();
	if($year){		// Year was provided
		$dirItr = new RecursiveDirectoryIterator(strval($year));
			
		foreach($dirItr as $searchFolder){	// For each folder within year
			$tmpResult = search_folder($searchFolder, $keyword);  // Search folder
			$results = array_merge($results, $tmpResult);
		}
	}
	else{			// No year provided, search all
		$year = intval(date('Y')) + 1;		// Get current year plus one
			
		// For each year: 
		while($year >= OLDEST_YEAR_TO_SEARCH){	// For each year
			if(!file_exists(strval($year))){  // If no such year exists, skip
				$year--;
				continue;
			}
			$dirItr = new RecursiveDirectoryIterator(strval($year));
			
			foreach($dirItr as $searchFolder){	// For each folder within year
				$tmpResult = search_folder($searchFolder, $keyword);  // Search folder
				$results = array_merge($results, $tmpResult);
			}
			
			$year--;									// And decrement
		}
	}
		
	return $results;
}

function search_folder($folder, $keyword){
	global $log;
	$results = array();
	
	$dirItr = new RecursiveDirectoryIterator($folder);	// Initialize directory iterator
	$itrItr = new RecursiveIteratorIterator($dirItr);	// Build list of filenames with path
	
	
	foreach($itrItr as $relPath){
		if(preg_match('/\.js$/', $relPath)){	// Make sure its a .js file
			$fileToRead = file_get_contents($relPath);
			$log .= "Searching for {$keyword} in {$relPath}<br/>";
			
			$searchTerms = explode(" ", $keyword);
			foreach($searchTerms as $kw){
				$regResult = preg_match("/{$kw}/i", $fileToRead);	// Search for keyword
				if(!$regResult){	// If nothing was found, bail (This is an 'AND' search, dammit!)
					$regResult = false;
					break;
				}
			}
			
			
			//$regResult = preg_match("/{$keyword}/i", $fileToRead);
			
			if($regResult){	
				$log .= "{$keyword} Found!!<br/>";
			
				// Build path, replacing backslash with forward slash
				$path = str_replace('\\', '/', "\\content\\scripts\\" . $relPath);
				$log .= "PATH = {$path}<br/>";
				
				$results[] = $path;
			}
		}
	}
	
	return $results;
}


?>