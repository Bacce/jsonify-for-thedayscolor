<?php
	$page = file_get_contents('http://www.thedayscolor.com/index.html');
	$obj = new stdClass();
	$obj->status = "OK";
	$obj->data = $page;
	$output = json_encode($obj);
	echo $output;
?>