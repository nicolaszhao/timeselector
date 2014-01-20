(function($) {
	module('timeselector: user actions');
	
	test('input keydown', function() {
		var $timer = $('#timeselector').val('01:00 am').timeselector(),
			inst = $timer.data('timeselector'),
			event = $.Event('keydown');
		
		event.which = 38;
		$timer.trigger(event).trigger('keyup');
		equal($timer.val().toLowerCase(), '01:01 am', 'add a minute on UP key');
		
		event.which = 40;
		$timer.trigger(event).trigger('keyup');
		equal($timer.val().toLowerCase(), '01:00 am', 'reduce a minute on DOWN key');
		
		event.which = 33;
		$timer.trigger(event).trigger('keyup');
		equal($timer.val().toLowerCase(), '02:00 am', 'add a hour on PAGE UP key');
		
		event.which = 34;
		$timer.trigger(event).trigger('keyup');
		equal($timer.val().toLowerCase(), '01:00 am', 'reduce a hour on PAGE DOWN key');
		
		event.which = 27;
		$timer.trigger(event);
		equal(inst.div.finish().is(':hidden'), true, 'close the timeselector on ESCAPE key');
	});
	
	test('selector mouse actions', function() {
		var $timer = $('#timeselector').val('01:00 am').timeselector().focus(),
			inst = $timer.data('timeselector');
		
		inst.div.find('.timeselector-hour .timeselector-up').trigger('mousedown').trigger('mouseup');
		equal($timer.val().toLowerCase(), '02:00 am', 'click the up button of the timeselector hour');
		
		inst.div.find('.timeselector-hour .timeselector-down').trigger('mousedown').trigger('mouseup');
		equal($timer.val().toLowerCase(), '01:00 am', 'click the down button of the timeselector hour');
		
		inst.div.find('.timeselector-minute .timeselector-up').trigger('mousedown').trigger('mouseup');
		equal($timer.val().toLowerCase(), '01:01 am', 'click the up button of the timeselector minute');
		
		inst.div.find('.timeselector-minute .timeselector-down').trigger('mousedown').trigger('mouseup');
		equal($timer.val().toLowerCase(), '01:00 am', 'click the down button of the timeselector minute');
	});
	
	module('timeselector: options');
	
	test('hours12', function() {
		var $timer = $('#timeselector').val('01:00 pm').timeselector({
			hours12: false
		});
		
		equal($timer.val(), '13:00', '"01:00 pm" 24-hour is "13:00"');
	});
	
	test('step', function() {
		var $timer = $('#timeselector').val('01:00 am').timeselector({
				step: 2
			}).focus(),
			inst = $timer.data('timeselector');
		
		inst.div.find('.timeselector-minute .timeselector-up').trigger('mousedown').trigger('mouseup');
		equal($timer.val().toLowerCase(), '01:02 am', '2 size of step');
	});
	
	module('timeselector: methods');
	
	test('option', function() {
		var $timer = $('#timeselector').val('01:00 pm').timeselector(),
			inst = $timer.data('timeselector');
		
		$timer.timeselector('option', {
			hours12: false,
			step: 2
		});
		
		equal($timer.val(), '13:00');
		
		$timer.focus();
		inst.div.find('.timeselector-minute .timeselector-up').trigger('mousedown').trigger('mouseup');
		equal($timer.val(), '13:02');
	});
	
	test('refresh', function() {
		var $timer = $('#timeselector').timeselector(),
			event = $.Event('keydown');
		
		event.which = 38;
		$timer.val('01:00 am').timeselector('refresh').trigger(event).trigger('keyup');
		equal($timer.val().toLowerCase(), '01:01 am');
	});
}(jQuery));
