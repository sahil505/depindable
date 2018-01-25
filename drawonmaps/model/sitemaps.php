<?php
/**
 * Google Maps Draw Module
 * @package drawonmaps
 * 
 * Class: SiteMaps
 * File: sitemaps.php
 * Description: Generic class which load list's of maps
 */
 
	class SiteMaps {
		
		// get list of available maps
		public static function getMaps() {
			$db = DbConnect::getConnection();
			$sql = "SELECT * FROM maps ORDER BY id DESC";
			$result = mysqli_query($db, $sql) or die(mysqli_error($db));
			$rows = array();
			while ($row = mysqli_fetch_assoc($result)) {
				$rows[] = $row;
			}
			
			return $rows;	
		} 
		
		// get list of all available map objects
		public static function getMapsObjects() {
			$db = DbConnect::getConnection();
			$sql = "SELECT * FROM map_objects";
			$result = mysqli_query($db, $sql) or die(mysqli_error($db));
			$rows = array();
			while ($row = mysqli_fetch_assoc($result)) {
				$rows[] = $row;
			}
			
			return $rows;	
		} 		
				
    }
?>
