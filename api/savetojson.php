<?php
	$data = file_get_contents("php://input");
	$file = fopen("../json/colours.json","w");
	echo fwrite($file, $data);
	fclose($file);
?>