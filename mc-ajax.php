<?php

/**
 * The template for displaying pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages and that
 * other "pages" on your WordPress site will use a different template.
 *
 * @package mc-ajax
 * @subpackage mc-ajax
 * @since mc-ajax
 * Template Name: mc-ajax
 */


$now_id=get_the_ID();
$now_post=get_post($now_id);
$now_content=$now_post->post_content;

$arr[0]=$now_content;

$callback=$_GET['callback'];

echo $callback.'('.json_encode($arr).')';
?>