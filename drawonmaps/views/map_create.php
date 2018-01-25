<?php 
/**
 * Google Maps Draw Module
 * @package drawonmaps
 * 
 * File: map_create.php
 * Description: Create new map page
 */
?>

	<div class="container">
		<h3 class="doc_title"><?php echo $vars['page_title']; ?></h3>
		<!-- Main component for a primary marketing message or call to action -->
		<div class="jumbotron">
			<?php include dirname(__FILE__) . '/html_draw_cpanel.php';?>

			<div class="row">
				<div class="popin">
					<div id="map"></div>
				</div>
			</div>
			<div class="row" id="map_form">
				<form  method="post" action="index.php?p=map_save" role="form" data-toggle="validator">
					<div class="row" id="allmarks"></div>  
					<div class="row" id="map_info">

						<div class="form-group">
							<label for="map_title" class="control-label"><?php echo $lang_msg['MAP_CREATE_FORM_TITLE']; ?></label>
							<input type="text" class="form-control" id="map_title" name="map_title" placeholder="<?php echo $lang_msg['MAP_CREATE_FORM_TITLE_NOTE']; ?>" required>
							<div class="help-block with-errors"></div>
						</div>
						<div class="form-group">
							<label for="map_description"><?php echo $lang_msg['MAP_CREATE_FORM_DESCRIPTION']; ?></label>
							<textarea class="form-control" rows="3" id="map_description" name="map_description" placeholder="<?php echo $lang_msg['MAP_CREATE_FORM_DESCRIPTION_NOTE']; ?>"></textarea>
						</div>
						<input type="hidden" id="map_center_lat" name="map_center_lat">
						<input type="hidden" id="map_center_lng" name="map_center_lng">
						<input type="hidden" id="map_zoom" name="map_zoom">
						<input type="hidden" id="map_typeid" name="map_typeid">
						<button type="submit" class="btn btn-default" id="addmap_btn"><?php echo $lang_msg['MAP_CREATE_FORM_DESCRIPTION_SUBMIT']; ?></button>

					</div>  
				</form>
			</div> 
		</div>
	</div> <!-- /container -->


