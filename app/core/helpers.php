<?php
namespace App\Core;

class Helpers 
{
  public static function isEmail($value) {
    if(filter_var($value, FILTER_VALIDATE_EMAIL)) {
      return true;
    }
		else
		{
			return false;
		}
  }
}
