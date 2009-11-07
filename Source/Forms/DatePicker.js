/*
Script: DatePicker.js
	Allows the user to enter a date in many popuplar date formats or choose from a calendar.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var DatePicker;
(function(){
	var DPglobal = function() {
		if (DatePicker.pickers) return;
		DatePicker.pickers = [];
		DatePicker.hideAll = function(){
			DatePicker.pickers.each(function(picker){
				picker.hide();
			});
		};
	};
 	DatePicker = new Class({
		Implements: [Options, Events, StyleWriter],
		options: {
			format: "%x",
			defaultCss: 'div.calendarHolder {height:177px;position: absolute;top: -21px !important;top: -27px;left: -3px;width: 100%;}'+
				'div.calendarHolder table.cal {margin-right: 15px !important;margin-right: 8px;width: 205px;}'+
				'div.calendarHolder td {text-align:center;}'+
				'div.calendarHolder tr.dayRow td {padding: 2px;width: 22px;cursor: pointer;}'+
				'div.calendarHolder table.datePicker * {font-size:11px;line-height:16px;}'+
				'div.calendarHolder table.datePicker {margin: 0;padding:0 5px;float: left;}'+
				'div.calendarHolder table.datePicker table.cal td {cursor:pointer;}'+
				'div.calendarHolder tr.dateNav {font-weight: bold;height:22px;margin-top:8px;}'+
				'div.calendarHolder tr.dayNames {height: 23px;}'+
				'div.calendarHolder tr.dayNames td {color:#666;font-weight:700;border-bottom:1px solid #ddd;}'+
				'div.calendarHolder table.datePicker tr.dayRow td:hover {background:#ccc;}'+
				'div.calendarHolder table.datePicker tr.dayRow td {margin: 1px;}'+
				'div.calendarHolder td.today {color:#bb0904;}'+
				'div.calendarHolder td.otherMonthDate {border:1px solid #fff;color:#ccc;background:#f3f3f3 !important;margin: 0px !important;}'+
				'div.calendarHolder td.selectedDate {border: 1px solid #20397b;background:#dcddef;margin: 0px !important;}'+
				'div.calendarHolder a.leftScroll, div.calendarHolder a.rightScroll {cursor: pointer; color: #000}'+
				'div.datePickerSW div.body {height: 160px !important;height: 149px;}'+
				'div.datePickerSW .clearfix:after {content: ".";display: block;height: 0;clear: both;visibility: hidden;}'+
				'div.datePickerSW .clearfix {display: inline-table;}'+
				'* html div.datePickerSW .clearfix {height: 1%;}'+
				'div.datePickerSW .clearfix {display: block;}',
			calendarId: false,
			stickyWinOptions: {
				draggable: true,
				dragOptions: {},
				position: "bottomLeft",
				offset: {x:10, y:10},
				fadeDuration: 400
			},
			stickyWinUiOptions: {},
			updateOnBlur: true,
			additionalShowLinks: [],
			showOnInputFocus: true,
			useDefaultCss: true,
			hideCalendarOnPick: true,
			weekStartOffset: 0,
			showMoreThanOne: true,
			stickyWinToUse: StickyWin
/*		onPick: $empty,
			onShow: $empty,
			onHide: $empty */
		},
	
		initialize: function(input, options){
			DPglobal(); //make sure controller is setup
			if (document.id(input)) this.inputs = $H({start: document.id(input)});
	    	this.today = new Date();
			this.setOptions(options);
			if (this.options.useDefaultCss) this.createStyle(this.options.defaultCss, 'datePickerStyle');
			if (!this.inputs) return;
			this.whens = this.whens || ['start'];
			if (!this.calendarId) this.calendarId = "popupCalendar" + new Date().getTime();
			this.setUpObservers();
			this.getCalendar();
			this.formValidatorInterface();
			DatePicker.pickers.push(this);
		},
		formValidatorInterface: function(){
			this.inputs.each(function(input){
				var props;
				if (input.get('validatorProps')) props = input.get('validatorProps');
				if (props && props.dateFormat) {
					dbug.log('using date format specified in validatorProps property of element to play nice with Form.Validator');
					this.setOptions({ format: props.dateFormat });
				} else {
					if (!props) props = {};
					props.dateFormat = this.options.format;
					input.set('validatorProps', props);
				}
			}, this);
		},
		calWidth: 280,
		inputDates: {},
		selectedDates: {},
		setUpObservers: function(){
			this.inputs.each(function(input) {
				if (this.options.showOnInputFocus) input.addEvent('focus', this.show.bind(this));
				input.addEvent('blur', function(e){
					if (e) {
						this.selectedDates = this.getDates(null, true);
						this.fillCalendar(this.selectedDates.start);
						if (this.options.updateOnBlur) this.updateInput();
					}
				}.bind(this));
			}, this);
			this.options.additionalShowLinks.each(function(lnk){
				document.id(lnk).addEvent('click', this.show.bind(this));
			}, this);
		},
		getDates: function(dates, getFromInputs){
			var d = {};
			if (!getFromInputs) dates = dates||this.selectedDates;
			var getFromInput = function(when){
				var input = this.inputs.get(when);
				if (input) d[when] = this.validDate(input.get('value'));
			}.bind(this);
			this.whens.each(function(when) {
				switch($type(dates)){
					case "object":
						if (dates) d[when] = dates[when]?dates[when]:dates;
						if (!d[when] && !d[when].format) getFromInput(when);
						break;
					default:
						getFromInput(when);
						break;
				}
				if (!d[when]) d[when] = this.selectedDates[when]||new Date();
			}, this);
			return d;
		},
		updateInput: function(){
			var d = {};
			$each(this.getDates(), function(value, key){
				var input = this.inputs.get(key);
				if (!input) return;
				input.set('value', (value)?this.formatDate(value)||"":"");
			}, this);
			return this;
		},
		validDate: function(val) {
			if (!$chk(val)) return null;
			var date = Date.parse(val.trim());
			return isNaN(date)?null:date;
		},
		formatDate: function (date) {
			return date.format(this.options.format);
		},
		getCalendar: function() {
			if (!this.calendar) {
				var cal = new Element("table", {
					'id': this.options.calendarId || '',
					'border':'0',
					'cellpadding':'0',
					'cellspacing':'0',
					'class':'datePicker'
				});
				var tbody = new Element('tbody').inject(cal);
				var rows = [];
				(8).times(function(i){
					var row = new Element('tr').inject(tbody);
					(7).times(function(i){
						var td = new Element('td').inject(row).set('html', '&nbsp;');
					});
				});
				rows = tbody.getElements('tr');
				rows[0].addClass('dateNav');
				rows[1].addClass('dayNames');
				(6).times(function(i){
					rows[i+2].addClass('dayRow');
				});
				this.rows = rows;
				var dayCells = rows[1].getElements('td');
				dayCells.each(function(cell, i){
					cell.firstChild.data = Date.getMsg('days')[(i + this.options.weekStartOffset) % 7].substring(0,3);
				}, this);
				[6,5,4,3].each(function(i){ rows[0].getElements('td')[i].dispose(); });
				this.prevLnk = rows[0].getElement('td').setStyle('text-align', 'right');
				this.prevLnk.adopt(new Element('a').set('html', "&lt;").addClass('rightScroll'));
				this.month = rows[0].getElements('td')[1];
				this.month.set('colspan', 5);
				this.nextLnk = rows[0].getElements('td')[2].setStyle('text-align', 'left');
				this.nextLnk.adopt(new Element('a').set('html', '&gt;').addClass('leftScroll'));
				cal.addEvent('click', this.clickCalendar.bind(this));
				this.calendar = cal;
				this.container = new Element('div').adopt(cal).addClass('calendarHolder');
				this.content = StickyWin.ui('', this.container, $merge(this.options.stickyWinUiOptions, {
					cornerHandle: this.options.stickyWinOptions.draggable,
					width: this.calWidth
				}));
				var opts = $merge(this.options.stickyWinOptions, {
					content: this.content,
					className: 'datePickerSW',
					allowMultipleByClass: true,
					showNow: false,
					relativeTo: this.inputs.get('start')
				});
				this.stickyWin = new this.options.stickyWinToUse(opts);
				this.stickyWin.addEvent('onDisplay', this.positionClose.bind(this));
				
			}
			return this.calendar;
		},
		positionClose: function(){
			if (this.closePositioned) return;
			var closer = this.content.getElement('div.closeButton');
			if (closer) {
				closer.inject(this.container, 'after').setStyle('z-index', this.stickyWin.win.getStyle('z-index').toInt()+2);
				(function(){
					this.content.setStyle('width', this.calendar.getSize().x + (this.options.time ? 240 : 40));
					closer.position({relativeTo: this.stickyWin.win.getElement('.top'), position: 'upperRight', edge: 'upperRight'});
				}).delay(3, this);
			}
			this.closePositioned = true;
		},
		hide: function(){
			this.stickyWin.hide();
			this.fireEvent('onHide');
			return this;
		},
		hideOthers: function(){
			DatePicker.pickers.each(function(picker){
				if (picker != this) picker.hide();
			});
			return this;
		},
		show: function(){
			this.selectedDates = {};
			var dates = this.getDates(null, true);
			this.whens.each(function(when){
				this.inputDates[when] = dates[when]?dates[when].clone():dates.start?dates.start.clone():this.today;
		    this.selectedDates[when] = !this.inputDates[when] || isNaN(this.inputDates[when]) 
						? this.today 
						: this.inputDates[when].clone();
				this.getCalendar(when);
			}, this);
			this.fillCalendar(this.selectedDates.start);
			if (!this.options.showMoreThanOne) this.hideOthers();
			this.stickyWin.show();
			this.fireEvent('onShow');		
			return this;
		},
		handleScroll: function(e){
			if (e.target.hasClass('rightScroll')||e.target.hasClass('leftScroll')) {
				var newRef = e.target.hasClass('rightScroll')
					?this.rows[2].getElement('td').refDate - Date.units.day()
					:this.rows[7].getElements('td')[6].refDate + Date.units.day();
				this.fillCalendar(new Date(newRef));
				return true;
			}
			return false;
		},
		setSelectedDates: function(e, newDate){
			this.selectedDates.start = newDate;
		},
		onPick: function(){
			this.updateSelectors();
			this.inputs.each(function(input) {
				input.fireEvent("change");
				input.fireEvent("blur");
			});
			this.fireEvent('onPick');
			if (this.options.hideCalendarOnPick) this.hide();
		},
		clickCalendar: function(e) {
			if (this.handleScroll(e)) return;
			if (!e.target.firstChild || !e.target.firstChild.data) return;
			var val = e.target.firstChild.data;
			if (e.target.refDate) {
				var newDate = new Date(e.target.refDate);
				this.setSelectedDates(e, newDate);
				this.updateInput();
				this.onPick();
			}
		},
		fillCalendar: function (date) {
			if ($type(date) == "string") date = new Date(date);
			var startDate = (date)?new Date(date.getTime()):new Date();
			var hours = startDate.get('hours');
			startDate.setDate(1);
			var startDay = startDate.getDay( );						//line added
			if ( startDay < this.options.weekStartOffset ) startDay += 7;			//line added
			startDate.setTime((startDate.getTime() - (Date.units.day() * (startDay))) + 
				(Date.units.day() * this.options.weekStartOffset));
			var monthyr = new Element('span', {
				html: Date.getMsg('months')[date.getMonth()] + " " + date.getFullYear()
			});
			document.id(this.rows[0].getElements('td')[1]).empty().adopt(monthyr);
			var atDate = startDate.clone();
			this.rows.each(function(row, i){
				if (i < 2) return;
				row.getElements('td').each(function(td){
					atDate.set('hours', hours);
					td.firstChild.data = atDate.getDate();
					td.refDate = atDate.getTime();
					atDate.setTime(atDate.getTime() + Date.units.day());
				}, this);
			}, this);
			this.updateSelectors();
		},
		updateSelectors: function(){
			var atDate;
			var month = new Date(this.rows[5].getElement('td').refDate).getMonth();
			this.rows.each(function(row, i){
				if (i < 2) return;
				row.getElements('td').each(function(td){
					td.className = '';
					atDate = new Date(td.refDate);
					if (atDate.format("%x") == this.today.format("%x")) td.addClass('today');
					this.whens.each(function(when){
						var date = this.selectedDates[when];
						if (date && atDate.format("%x") == date.format("%x")) {
							td.addClass('selectedDate');
							this.fireEvent('selectedDateMatch', [td, when]);
						}
					}, this);
					this.fireEvent('rowDateEvaluated', [atDate, td]);
					if (atDate.getMonth() != month) td.addClass('otherMonthDate');
					atDate.setTime(atDate.getTime() + Date.units.day());
				}, this);
			}, this);
		}
	});
})();