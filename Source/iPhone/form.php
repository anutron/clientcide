<?php 

$form1 = '
<p style="padding: 5px;">This form will be submitted and its response outputted in console below</p>
<hr size="1" noshade/>
<form action="form.php" class="do_update" update="console" style="margin-bottom: 10px; margin-top: 10px;">
<span style="font-weight: bold;font-size: 10px;">This textarea will be submitted as "myText"</span>
<textarea name="myText" style="width: 320px; height: 100px; border: 1px solid #aaa;"></textarea>
<br/>
<input type="checkbox" name="Check1"/>Check me 1<br/>
<input type="checkbox" name="Check2"/>Check me 2<br/>
<input type="submit" value="Submit"/>
</form>
<span style="font-weight: bold;font-size: 10px;">Console</span>
<div id="console" style="width: 320px; height: 75px; border: 1px solid #aaa; background-color: #eee;"></div>';

$form2 = '
<p style="padding: 5px;">This form will be submitted and its response outputted on the next page</p>
<hr size="1" noshade/>
<form action="form.php" class="do_update go_forward" style="margin-bottom: 10px; margin-top: 10px;">
<span style="font-weight: bold;font-size: 10px;">This textarea will be submitted as "myText"</span>
<textarea name="myText" style="width: 320px; height: 100px; border: 1px solid #aaa;"></textarea>
<br/>
<input type="checkbox" name="Check1"/>Check me 1<br/>
<input type="checkbox" name="Check2"/>Check me 2<br/>
<input type="submit" value="Submit"/>
</form>
';


if (isset($_GET['myText'])) {
	foreach ($_GET as $key => $value) {
		echo "<div style='font-size: 12px;'>$key: $value</div>";
	}
}
else {
	switch ($_GET['demo']) {
		default:
		case "1" : echo $form1; break;
		case "2" : echo $form2; break;
	}
}

?>