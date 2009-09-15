Form.Validator.validators['validate-number'] = Form.Validator.validators['validate-integer'];
Form.Validator.add('validate-date-au', {
	errorMsg: 'Please use this date format: dd/mm/yyyy. For example 17/03/2006 for the 17th of March, 2006.',
	test: function(element) {
		if (Form.Validator.getValidator('IsEmpty').test(element)) return true;
    var regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(element.getValue())) return false;
    var d = new Date(element.getValue().replace(regex, '$2/$1/$3'));
    return (parseInt(RegExp.$2, 10) == (1+d.getMonth())) && 
       (parseInt(RegExp.$1, 10) == d.getDate()) && 
       (parseInt(RegExp.$3, 10) == d.getFullYear() );
	}
});
