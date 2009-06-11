/*
Script: DatePicker.Extras.js
	Extends DatePicker to allow for range selection and time entry.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
DatePicker = Class.refactor(DatePicker, {
	options:{
		extraCSS: 'a.finish {position: relative;height: 13px !important;top: -31px !important;left: 85px !important;top: -34px;left: 77px;height: 16px;display:block;float: left;padding: 1px 12px 3px !important;}'+
			'div.calendarHolder div.time {border: #999 1px solid;width: 55px;position: relative;left: 3px;height: 17px;}'+
			'div.calendarHolder td.timeTD {width: 140px;} div.calendarHolder td.label{width:35px; text-align:right}'+
			'div.calendarHolder div.time select {font-size: 10px !important; font-size: 15px;padding: 0px;left:60px;position:absolute;top:-1px !important; width: auto !important;}'+
			'div.calendarHolder div.time input {width: 16px !important;width: 12px;padding: 2px;height: 13px;border: none !important;border: 1px solid #fff;}'+
			'div.calendarHolder div.timeSub {clear:both;position: relative;width: 65px;}'+
			'div.calendarHolder div.timeSub span {text-align: center;color: #999;margin: 5px;}'+
			'div.calendarHolder span.seperator {position:relative;top:-3px;}'+
			'div.calendarHolder table.stamp {position:relative;top: 35px !important;top: 50px;left: 0px;}'+
			'div.calendarHolder table.stamp a {left:123px;position:relative;top:9px;}'+
			'div.calendarHolder table.stamp td {border: none !important;}'+
			'div.calendarHolder td.selected_end {border-width: 1px 1px 1px 0px !important;margin: 0px 0px 0px 1px !important;}'+
			'div.calendarHolder td.selected_start {border-width: 1px 0px 1px 1px !important;margin: 0px 1px 0px 0px !important;}'+
			'div.calendarHolder table.datePicker td.range {background: #dcddef;border: solid #20397b;border-width: 1px 0px;margin: 0px 1px !important;}',
		range: false,
		time: false
	},
	initialize: function(inputs, options){
		if (options && (options.range || options.time)) {
			options = $merge({
				hideCalendarOnPick: false
			}, options);
		}
		if (options && options.time && !options.format) {
			options.format = "%x %X";
		}
		this.setOptions(options);
		this.whens = (this.options.range)?['start', 'end']:['start'];
		if ($type(inputs) == 'object') {
			this.inputs = $H(inputs);
		} else if ($type(document.id(inputs)) == "element") {
			this.inputs = $H({'start': document.id(inputs)});
		} else if ($type(inputs) == "array"){
			inputs = $$(inputs);
			this.inputs = $H({});
			this.whens.each(function(when, i){
				this.inputs.set(when, inputs[i]);
			}, this);
		}
		if (this.options.time) this.calWidth = 460;
		this.previous(inputs, this.options);
		this.createStyle(this.options.extraCSS, 'datePickerPlusStyle');
		this.addEvent('rowDateEvaluated', function(atDate, td){
			if (this.options.range && this.selectedDates.start.diff(atDate, 'minute') > 0 
					&& this.selectedDates.end.diff(atDate, 'minute') < 0) td.addClass('range');
		}.bind(this));
		this.addEvent('selectedDateMatch', function(td, when){
			if (this.options.range) td.addClass('selected_'+when);
		}.bind(this));
	},
	updateInput: function(){
		this.previous();
		if (this.options.time) this.updateView();
	},
	updateView: function() {
		this.whens.each(function(when){
			var stamp = this.stamps[when];
			var date = this.getDates()[when];
			stamp.date.set('html', date?date.format("%b. %d, %Y"):"");
			if (stamp.hr) {
				stamp.hr.set('value', date?date.format("%I"):"");
				stamp.min.set('value', date?date.format("%M"):"");
			}
		}, this);
	},
	stamps: {},
	setupWideView: function(){
		var timeStampMap = {
			hr: '%I',
			'min': '%M'
		};
		timeSetMap = {
			hr: 'setHours',
			'min':'setMinutes'
		};
		var dates = this.getDates();
	
		if (!this.options.range && !this.options.time) return;
		this.stamps.table = new Element('table', {
			'class':'stamp'
		}).inject(this.container);
		this.stamps.tbody = new Element('tbody').inject(this.stamps.table);
		this.whens.each(function(when){
			this.stamps[when] = {};
			var s = this.stamps[when]; //saving some bytes
			s.container = new Element('tr').addClass(when+'_stamp').inject(this.stamps.tbody);
			s.label = new Element('td').inject(s.container).addClass('label');
			if (this.whens.length == 1) {
				s.label.set('html', 'date:');
			} else {
				s.label.set('html', when=="start"?"from:":"to:");
			}
			s.date = new Element('td').inject(s.container);
			if (this.options.time) {
				currentWhen = dates[when]||new Date();
				s.time = new Element('tr').inject(this.stamps.tbody);
				new Element('td').inject(s.time);
				s.timeTD = new Element('td').inject(s.time);
				s.timeInputs = new Element('div').addClass('time clearfix').inject(s.timeTD);
				s.timeSub = new Element('div', {'class':'timeSub'}).inject(s.timeTD);
				['hr','min'].each(function(t, i){
					s[t] = new Element('input', {
						type: 'text',
						'class': t,
						name: t,
						events: {
							focus: function(){
								this.select();
							},
							change: function(){
								this.selectedDates[when][timeSetMap[t]](s[t].get('value'));
								this.selectedDates[when].setAMPM(s.ampm.get('value'));
								this.updateInput();
							}.bind(this)
						}
					}).inject(s.timeInputs);
					s[t].set('value', currentWhen.format(timeStampMap[t]));
					if (i < 1) s.timeInputs.adopt(new Element('span', {'class':'seperator'}).set('html', ":"));
					new Element('span', {
						'class': t
					}).set('html', t).inject(s.timeSub);
				}, this);
				s.ampm = new Element('select').inject(s.timeInputs);
				['AM','PM'].each(function(ampm){
					var opt = new Element('option', {
						value: ampm,
						text: ampm.toLowerCase()
					}).set('html', ampm).inject(s.ampm);
					if (ampm == currentWhen.format("%p")) opt.selected = true;
				});
				s.ampm.addEvent('change', function(){
					var date = this.getDates()[when];
					var ampm = s.ampm.get('value');
					if (ampm != date.format("%p")) {
						date.setAMPM(ampm);
						this.updateInput();
					}
				}.bind(this));
			}
		}, this);
		new Element('tr').inject(this.stamps.tbody).adopt(new Element('td', {colspan: 2}).adopt(new Element('a', {
			'class':'closeSticky button',
			events: {
				click: function(){
					this.hide();
				}.bind(this)
			}
		}).set('html', 'Ok')));
	},
	show: function(){
		this.previous();
		if (this.options.time) {
			if (!this.stamps.table) this.setupWideView();
			this.updateView();
		}
	},
	startSet: false,
	onPick: function(){
		if ((this.options.range && this.selectedDates.start && this.selectedDates.end) || !this.options.range) {
			this.previous();
		}
	},
	setSelectedDates: function(e, newDate) {
		if (this.options.range) {
			if (this.selectedDates.start && this.startSet) {
				if (this.selectedDates.start.getTime() > newDate.getTime()){
					this.selectedDates.end = new Date(this.selectedDates.start);
					this.selectedDates.start = newDate;
				} else {
					this.selectedDates.end = newDate;
				}
				this.startSet = false;
			} else {
				this.selectedDates.start = newDate;
				if (this.selectedDates.end && this.selectedDates.start.getTime() > this.selectedDates.end.getTime())
					this.selectedDates.end = new Date(newDate);
				this.startSet = true;
			}
		} else {
			this.previous(e, newDate);
		}
		if (this.options.time) {
			this.whens.each(function(when){
				var hr = this.stamps[when].hr.get('value').toInt();
				if (this.stamps[when].ampm.get('value') == "PM" && hr < 12) hr += 12;
				this.selectedDates[when].setHours(hr);
				this.selectedDates[when].setMinutes(this.stamps[when]['min'].get('value')||"0");
				this.selectedDates[when].setAMPM(this.stamps[when].ampm.get('value')||"AM");
			}, this);
		}
	}
});