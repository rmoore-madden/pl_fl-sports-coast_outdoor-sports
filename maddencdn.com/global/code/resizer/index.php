<?php
/**
 * Dynamic image resizer
 *
 * Will output a resized image based on input parameters - typically used for
 *	tablet and mobile hero image resizing
 *
 * PARAMETERS:
 *	img: 		The image path from the web root to the image
 *	w: 			A pixel width to resize to
 *	h: 			A pixel height to resize to
 *	scale: 		A scaled percentage to resize to (use either w + h or this)
 *	quality: 	Compression quality (1-100; defaults to 30)
 *	ext:	 	An extension to convert the image to (e.g. "png" returns a PNG copy of the image)
 *	crop: 		A simple crop rule (left|center|right)
 *	offsetx:	A pixel offset on the X axis (use either crop or offsetx + offsety)
 *	offsety:	A pixel offset on the Y axis (use either crop or offsetx + offsety)
 */
 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include_once("library/vendor/autoload.php");
use Del\Image;
use Del\Image\Strategy\GifStrategy;
use Del\Image\Strategy\ImageTypeStrategyInterface;
use Del\Image\Strategy\JpegStrategy;
use Del\Image\Strategy\PngStrategy;
use Del\Image\Strategy\WebPStrategy;

//
// local vars
//
$img = (isset($_GET["img"])) ? $_GET["img"] : "";
$width = (isset($_GET["w"])) ? intval($_GET["w"]) : -1;
$height = (isset($_GET["h"])) ? intval($_GET["h"]) : -1;
$type = (isset($_GET["type"])) ? $_GET["type"] : null;
$scale = (isset($_GET["scale"])) ? intval($_GET["scale"]) : -1;
$quality = (isset($_GET["quality"])) ? intval($_GET["quality"]) : 30;
$crop = (isset($_GET["crop"])) ? $_GET["crop"] : "center";
$offsetX = (isset($_GET["offsetx"])) ? intval($_GET["offsetx"]) : -1;
$offsetY = (isset($_GET["offsety"])) ? intval($_GET["offsety"]) : -1;

$debug = (isset($_GET["debug"])) ? true : false;
$strategy = null;
$imgPath = $_SERVER["DOCUMENT_ROOT"].$img;
$imagePathInfo = pathinfo($imgPath);
$imgCacheRoot = "";
$imgCacheName = "";
$imgCachePath = "";
$useCache = true;
$mimeType = mime_content_type($imgPath);
$image = null;
$cacheDir = "_cache";

//
// check what we were given
//
if (! is_file($imgPath)) {
	err("Image not found on server: {$img}");
} else if (strpos($img, "..") !== false) {
	err("Whoopsie daisy: {$img}");
} else if (strpos($mimeType, "image/") === false) {
	err("Image doesn't appear to be an image: {$mimeType}");
}

//
// what's our strategy?
//
$type = ($type != null) ? $type : $imagePathInfo["filename"];
switch ($type) {
	case "jpg":
		$strategy = new JpegStrategy();
		break;
	case "png":
		$strategy = new PngStrategy();
		break;
	case "gif":
		$strategy = new GifStrategy();
		break;
	case "webp":
		$strategy = new WebPStrategy();
		break;
	default:
		$strategy = new JpegStrategy();
}

//
// build cache path and remove existing if debugging
//
$imgCacheRoot = str_ireplace($_SERVER["DOCUMENT_ROOT"], "", str_ireplace("/", "_", $imagePathInfo["dirname"]));
$imgCacheName = "{$imgCacheRoot}_{$imagePathInfo["filename"]}"
	."_w{$width}_h{$height}_s{$scale}_q{$quality}_c{$crop}_x{$offsetX}_y{$offsetY}.{$strategy->getFileExtension()}";
$imgCachePath = "{$cacheDir}/{$imgCacheName}";
if ($debug) {
	if (is_file($imgCachePath)) {
		unlink($imgCachePath);
	}
}

//
// handle image request
//
if (! file_exists($imgCachePath)) {

	$useCache = false;

	try {
		// make the image resize instance
		$image = new Image($imgPath, $quality);
		$image->setImageStrategy($strategy);
		
		// what are we doing to the image?
		$adjustingFocalPoint = ( ($offsetX != -1) || ($offsetY != -1) ) ? true : false;
		$cropping = ( ($width != -1) || ($height != -1) ) ? true : false;

		// crop and resize?
		if ($adjustingFocalPoint) {
			// don't leave offsets unset
			$offsetX = ($offsetX == -1) ? 0 : $offsetX;
			$offsetY = ($offsetY == -1) ? 0 : $offsetY;
			// now process
			$image->cropAndFocus($width, $height, $offsetX, $offsetY);
		} else if ($cropping) {
			// don't leave dimensions unset
			$width = ($width == -1) ? $image->getWidth() : $width;
			$height = ($height == -1) ? $image->getHeight() : $height;
			// now process
			$image->crop($width, $height, $crop);
		}
		
		// scale if requested
		if ($scale != -1) {
			$image->scale($scale);
		}
		
		// save a copy of it in the cache
		$image->save($imgCachePath, null, $quality);
	
	} catch (Exception $e) {
		err("There was an error: ".$e->getMessage());
	}
}

//
// output the result
//
if ($debug) {

	echo "<pre>";

	// remove cache and all other related sizes (assuming there was some testing)
	$cache = array_diff(scandir($cacheDir), array($imgCacheName, "..", "."));
	foreach ($cache as $c) {
		if (strpos($c, $imgCacheRoot) !== false) {
			// it's related - remove cache and note that
			$status = unlink("{$cacheDir}/{$c}");
			echo (($status) ? "[Y] " : "[N] ")."Removed cached variant: {$cacheDir}/{$c}".PHP_EOL.PHP_EOL;
		}
	}
	
	// new vs old image meta
	echo "Source image size: ".human_filesize(filesize($imgPath)).PHP_EOL;
	echo "Output image size: ".human_filesize(filesize($imgCachePath)).PHP_EOL;

	// now echo params for reference
	echo PHP_EOL;
	print_r($_GET);
	echo PHP_EOL;

	// generate the image sans debug param
	$params = explode("&", $_SERVER["QUERY_STRING"]);
	$paramStr = "";
	foreach ($params as $p) {
		if (strpos($p, "debug") === false) {
			$paramStr .= ($paramStr == "") ? "" : "&";
			$paramStr .= $p;
		}
	}
	// echo out the image in a tag
	echo "<hr>Output image<hr>";
	echo "<img src=\"{$imgCachePath}\" />";
	echo "<hr>Original image<hr>";
	echo "<img src=\"".str_ireplace($_SERVER["DOCUMENT_ROOT"], "", $imgPath)."\" />";
	echo "</pre>";

} else {
	
	// output the generated image if new, or stream out the cached copy
	header("Content-Type: {$mimeType}");
	if ($useCache) {
		// just stream cached file
		header("Content-Length: " . filesize($imgCachePath));
		readfile($imgCachePath);
	} else {
		// output new file
		$image->output();
		$image->destroy();
	}
	
}
exit;

//
// util function
//
function err ($msg) {
	echo $msg;
	exit;
}

//
// for debugging
//
function human_filesize ($bytes, $decimals = 2) {
	$sz = 'BKMGTP';
	$factor = floor((strlen($bytes) - 1) / 3);
	return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)) . @$sz[$factor];
}

?>
