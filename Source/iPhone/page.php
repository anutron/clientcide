<?php
sleep(1);

function echoPage($page) {
	$page++;
	echo "<ul class=\"menu\" style=\"margin-bottom: 10px;\">
			<li><a href='page.php?page=$page' class='go_forward' title='Item $page'>To item $page</a></li>
		</ul>";
	echo "<div style=\"width: 310px; margin-bottom: 5px; margin-left: 5px; text-align: center; font-size: 13px;\">
		Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.				
		</div>
		<a href='morecontent.php' class='load_more'></a>		
		";
}

echoPage($_GET['page']);

?>