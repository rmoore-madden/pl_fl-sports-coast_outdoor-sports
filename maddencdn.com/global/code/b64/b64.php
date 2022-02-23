<?php
/**
 * This extremely complex and over-engineered piece of code returns the base64 encoding of an image
 * at the url at the query param src.
 * 
 * Example request: [url]/base64.php?src=https://maddenmedia.com/wp-content/uploads/mm_logo_white.png
 */

isset($_GET['src']) ? $img_src = $_GET['src'] : die('Please provide src url in src query parameter.');
if (filter_var($img_src, FILTER_VALIDATE_URL) === FALSE) die('Image source must be a valid URL.');
$img_contents = file_get_contents($img_src);
echo base64_encode($img_contents);