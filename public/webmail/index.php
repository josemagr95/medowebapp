<?php
if($_SERVER['HTTP_HOST']=="me-do.cl") {
	header("Location: http://mail.me-do.cl/correoweb");
	die();
} else {
	header("Location: http://mail.medo-arauco.com/correoweb");
	die();
}
