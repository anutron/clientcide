//returns a collection given an id or a selector
$G = function(elements) {
	return $splat(document.id(elements)||$$(elements));
};