<?php

const VALID_EXTENSIONS = [
    "js", 
    "css"
];

if (! isset($_GET["s"])) {
    exit;
}

// output as a custom content type
if ( (isset($_GET["t"])) && ($_GET["t"] != "") ) {
    header("Content-type: {$_GET["t"]}");
}

// get the requested file list
$fList = explode("|", $_GET["s"]);

// loop over what we were asked for
for ($x=0; $x < count($fList); $x++) {
    // remove whitespace in case it snuck through
    $fList[$x] = trim(preg_replace('/\s+/', ' ', $fList[$x]));
    // no trying to sneak around
    if (strpos($fList[$x], "..") === false) {
        // build the full path
        $fFullPath = "{$_SERVER["DOCUMENT_ROOT"]}{$fList[$x]}";
        $pathBits = pathinfo($fFullPath);
        if (! in_array($pathBits["extension"], VALID_EXTENSIONS)) {
            // oops
            echo "SKIP: {$fFullPath}".PHP_EOL.PHP_EOL;
            // MAY EXIT THIS BLOCK
            exit;            
        }
		// url?
		if (preg_match("/^http/", $fList[$x])) {
			echo file_get_contents($fList[$x]);
        } else if (is_file($fFullPath)) {
            // does it exist? load it
            echo file_get_contents($fFullPath).PHP_EOL.PHP_EOL;
        } else {
            // oops
             echo "404: {$fFullPath}".PHP_EOL.PHP_EOL;
        }
    } else {
        // another oops
         echo "SKIP: {$fList[$x]}".PHP_EOL.PHP_EOL;
        // MAY EXIT THIS BLOCK
        exit;            
    }
}

?>
