# Timeselector

A simple jQuery plugin for time selection in form.

**Current version:** [2.0.0](https://github.com/nicolaszhao/timeselector/archive/v2.0.0.tar.gz)

## Usage
Include jQuery and the plugin on your page. Then select a input element and call the timeselector method on DOM ready.

	<script src="jquery.js"></script>
	<script src="jquery.timeselector.js"></script>
	<script>
		$(function() {
			$('[name="time"]').timeselector();
		});
	</script>
	<input type="text" name="time" />

## Options
**hours12** (default: true)   
Type: Boolean   
Define whether or not to show AM/PM with selected time.

***

**step** (default: 1)   
Type: Number   
The step size to adjust minutes when click the timeselector buttons or press the UP/DOWN KEY on the keyboard.

***

**min** (default: '')

Type: String

The maximum time limit that can be set

***

**max** (default: '')

Type: String

The minimum time limit that can be set

## Methods
**option( options )**  
Returns: jQuery   
Set one or more options for the timeselector.
​	
* **options**   
	Type: Object   
	A map of option-value pairs to set.
	

**Code example:**
​	
	$('[name="time"]').timeselector('option', {hours12: false});

***

**refresh()**   
Returns: jQuery   
When the input value is set manually, need to call this method to manually update the timeselector and input value if the value is valid.

**Code example:**
​	
	$('[name="time"]').val('13:00').timeselector('refresh'); // input value will update to '01:00 PM'

## Keyboard interaction
* **UP**: Increment the minute by one step.
* **DOWN**: Decrement the minute by one step.
* **PAGE UP**: Increment one hour.
* **PAGE DOWN**: Decrement one hour.
* **ESCAPE**: Close the timeselector without selection.
	
## Theming
If timeselector specific styling is needed, the following CSS class names can be used:
* `timeselector`: The outer container of the timeselector.
	* `timeselector-item`: The outer container of the hour or the minute section. The hour section will additionally have a `timeselector-hour` class and the minute section will additionally have a `timeselector-minute` class. 
		* `timeselector-button`: The button controls used to increment and decrement the time's value. The up button will additionally have a `timeselector-up` class and the down button will additionally have a `timeselector-down` class.
		* `timeselector-value`: The element to display the time's value.
	* `timeselector-separator`: The separator of time.

## Dependencies
### Required
[jQuery, tested with 1.10.2](http://jquery.com)

## License
Copyright (c) 2014 Nicolas Zhao; Licensed MIT
