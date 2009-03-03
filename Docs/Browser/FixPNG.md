Hash: Browser {#Browser}
========================

Extends the Browser hash to add the fixPNG method.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/02-browser/01-fixpng

Browser Method: fixPNG {#Browser:fixPNG}
----------------------------------------

Makes transparent pngs show up correctly in IE. This function is based almost entirely on the function found here: [http://homepage.ntlworld.com/bobosola/pnginfo.htm][].

Note that this method is only marginally useful and must be fired after the image loads. There is a new method here: [http://www.twinhelix.com/css/iepngfix/][] that is *much/* more effective that I highly recommend using.

### Syntax

	Browser.fixPNG(el);

### Arguments

1. el - (*mixed*) a string of the id for an Element or an Element reference with a source or background image to fix

### Notes

There is an instances of this already set to fire on DomReady that will fix any png files with the class "fixPNG". This means one can just give the class "fixPNG" to any img tag or dom element tag and they are set BUT, the png will look wrong until the DOM loads, which may or may not be noticeable.

The alternative is to embed the call right after the image like so:

	<img src="png1.png" width="50" height="50" id="png1" />
	<img src="png2.png" width="50" height="50" id="png2" />
	
	$$('#png1', '#png2').each(function(png) {fixPNG(png);});
	//OR
	fixPNG('png1');
	fixPNG('png2');

OR add it inline as an onload method:

	<img src="png1.png" width="50" height="50" onload="fixPNG(this)" />
	
Browser Method: scanForPngs {#Browser:scanForPngs}
----------------------------------------

Scans the document or a specified element for img tags with a source url set to a png and adds a class name to each so that [Browser:fixPNG][] can access each one.

### Syntax

	Browser.scanForPngs(element, className);

### Arguments

1. element - (*mixed*, required) A string of the id for an Element or an Element reference that should be scanned for img elements
2. className - (*string*, optional) the class name to add to each img element found; defaults to *'fixPNG'*

### Examples

	<div id="aDiv">
		<img src="png1.png" width="50" height="50" id="png1" />
	</div>
	
	Browser.scanForPngs('aDiv'); //png1 now has a class of fixPNG
	Browser.scanForPngs('aDiv', 'alsoFixPNG'); //png1 now has a class of fixPNG and alsoFixPNG

### Returns

* nothing

[Browser:FixPNG]: #Browser:fixPNG
[http://homepage.ntlworld.com/bobosola/pnginfo.htm]: http://homepage.ntlworld.com/bobosola/pnginfo.htm
[http://www.twinhelix.com/css/iepngfix/]: http://www.twinhelix.com/css/iepngfix/
