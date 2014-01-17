/*
 * timeselector
 * https://github.com/nicolaszhao/timeselector
 *
 * Copyright (c) 2014 Nicolas Zhao
 * Licensed under the MIT license.
 */

(function($) {
	
	var Timeselector = function() {
		this._$div = null;
		this._inst = null;
		this._showing = false;
		
		this.uuid = new Date().getTime();
		this.initialized = false;
	};

	Timeselector.prototype = {
		constructor: Timeselector,
		
		_generateHtml: function() {
			return '<div id="timeselector-div" class="timeselector">' + 
					'<div class="timeselector-item timeselector-hour" data-type="hour">' + 
					'<a class="timeselector-button timeselector-up">+</a>' + 
					'<span class="timeselector-value"></span>' + 
					'<a class="timeselector-button timeselector-down">-</a>' + 
					'</div>' + 
					'<div class="timeselector-separator">:</div>' + 
					'<div class="timeselector-item timeselector-minute" data-type="minute">' + 
					'<a class="timeselector-button timeselector-up">+</a>' + 
					'<span class="timeselector-value"></span>' + 
					'<a class="timeselector-button timeselector-down">-</a>' + 
					'</div>' + 
					'</div>';
		},
		
		_setTime: function(type, step) {
			var inst = this._inst,
				date = inst.date;
			
			if (type) {
				date.setTime(+date + (1000 * 60 * (type === 'hour' ? 60 : step)));
			}
			
			inst.input.val(this._format(date, inst.options.hours12));
			inst.lastValue = inst.input.val();
		},
		
		_setTimeFromField: function(inst) {
			if (inst.input.val() === inst.lastValue) {
				return;
			}
			inst.lastValue = inst.input.val();
			
			var date = new Date(),
				matches, hour;
			
			matches = this._match(inst.lastValue);
			if (matches) {
				hour = parseInt(matches[0], 10);
				if (matches[2]) {
					if (matches[2].toLowerCase() === 'am' && hour === 12) {
						hour = 0;
					} else if (matches[2].toLowerCase() === 'pm' && hour > 0 && hour < 12) {
						hour = hour + 12;
					}
				}
				date.setHours(hour);
				date.setMinutes(parseInt(matches[1], 10));
			}
			
			inst.date = date;
		},
		
		_match: function(time) {
			var rtime = /^((?:1[012]|0[1-9])|(?:[01][0-9]|2[0-3])):([0-5][0-9])(?:\s(am|pm))?$/i,
				matches = rtime.exec(time);
			
			if (matches) {
				matches.splice(0, 1);
			}
			return matches;
		},
		
		_update: function(inst) {
			var time = this._format(inst.date, inst.options.hours12);
			
			time = this._match(time);
			this._$div.find('.timeselector-value').each(function(i) {
				$(this).text(time[i]);
			});
		},
		
		_format: function(date, hours12) {
			var hour = date.getHours(),
				minute = date.getMinutes(),
				leadZero = function(num) {
					return (num < 10 ? '0' : '') + num;
				};
				
			if (hours12) {
				if (hour === 0) {
					hour = 12;
				} else if (hour > 12) {
					hour = hour - 12;
				}
				
				return leadZero(hour) + ':' + leadZero(minute) + ' ' + (date.getHours() < 12 ? 'AM' : 'PM');
			}
			
			return leadZero(hour) + ':' + leadZero(minute);
		},
		
		_getInst: function(target) {
			return $(target).data('timeselector');
		},
		
		_selectTime: function(type, steps, delay) {
			delay = delay || 500;
			
			var that = this;
			
			clearTimeout(this._timer);
			this._timer = setTimeout(function() {
				that._selectTime(type, steps, 50);
			}, delay);
			
			this._setTime(type, steps * this._inst.options.step);
			this._update(this._inst);
		},
		
		_stop: function() {
			clearTimeout(this._timer);
		},
		
		_doKeyDown: function(event) {
			if (this._showing) {
				switch (event.which) {
					case 27: 
						this._hide();
						break;
					case 38:
						this._selectTime('minute', 1);
						break;
					case 40:
						this._selectTime('minute', -1);
						break;
					case 33:
						this._selectTime('hour', 1);
						break;
					case 34:
						this._selectTime('hour', -1);
						break;
				}
			}
		},
		
		_doKeyUp: function(event) {
			var inst = this._getInst(event.target);
			
			if (inst.input.val() !== inst.lastValue && this._showing) {
				this._setTimeFromField(inst);
				this._update(inst);
			}
			
			this._stop();
		},
		
		_show: function(input) {
			input = input.target || input;
			
			if (this._lastInput === input) {
				return;
			}
			
			var $input = $(input),
				inst = this._getInst(input),
				isFixed = false,
				pos;
			
			if (this._inst && this._inst !== inst) {
				this._inst.div.stop(true, true);
			}
			
			this._lastInput = input;
			this._setTimeFromField(inst);
			this._update(inst);
			
			$input.parents().each(function() {
				isFixed = $(this).css('position') === 'fixed';
				return !isFixed;
			});
			pos = $input.offset();
			pos.top += input.offsetHeight;
			pos.left -= isFixed ? $(document).scrollLeft() : 0;
			pos.top -= isFixed ? $(document).scrollTop() : 0;
			inst.div.css({
				position: (isFixed ? 'fixed' : 'absolute'),
				display: 'none',
				top: pos.top,
				left: pos.left,
				zIndex: this._zIndex(input) + 1
			});
			
			inst.div.fadeIn('fast');
			this._showing = true;
			this._inst = inst;
		},
		
		_hide: function() {
			var inst = this._inst;
			
			if (!inst || !this._showing) {
				return;
			}
			
			inst.div.fadeOut('fast');
			this._lastInput = null;
			this._showing = false;
		},
		
		_checkExternalClick: function(event) {
			if (!this._inst) {
				return;
			}
			
			var $target = $(event.target),
				inst = this._getInst($target[0]);
				
			if ((!inst && !$target.closest('#timeselector-div').length && this._showing) || 
					(inst && this._inst !== inst)) {
				this._hide();
			}	
		},
		
		_zIndex: function(elem) {
			elem = $(elem);
			
			var position, value;
			
			while (elem.length && elem[ 0 ] !== document) {
				position = elem.css('position');
				if (position === 'absolute' || position === 'relative' || position === 'fixed') {
					value = parseInt(elem.css('zIndex'), 10);
					if (!isNaN(value) && value !== 0) {
						return value;
					}
				}
				elem = elem.parent();
			}
			
			return 0;
		},
		
		option: function(target, options) {
			var inst = this._getInst(target);
			
			if (inst) {
				if (this._inst === inst) {
					this._hide();
				}
				
				$.extend(inst.options, options);
				this._setTime();
				this._update(inst);
			}
		},
		
		attach: function(target, options) {
			var inst;
			
			if (!target.id) {
				this.uuid += 1;
				target.id = 'timeselector-input-' + this.uuid;
			}
			
			inst = {
				id: target.id,
				input: $(target),
				div: this._$div,
				options: $.extend({}, options)
			};
			
			$(target).data('timeselector', inst)
				.on('keydown', $.proxy(this._doKeyDown, this))
				.on('keyup', $.proxy(this._doKeyUp, this))
				.on('focus', $.proxy(this._show, this))
				.on('blur', $.proxy(this._stop, this));
		},
		
		create: function() {
			var that = this;

			this._$div = $(this._generateHtml()).appendTo('body').hide()
				.on('mousedown.timeselector', '.timeselector-button', function(event) {
					var $button = $(this);
					
					if (that._inst.input[0] !== document.activeElement) {
						that._inst.input.focus();
					}
					
					$button.addClass('timeselector-state-active');
					that._selectTime($button.parent('.timeselector-item').data('type'), $button.hasClass('timeselector-up') ? 1 : -1);
					event.preventDefault();
				})
				.on('mouseup.timeselector', '.timeselector-button', function() {
					$(this).removeClass('timeselector-state-active');
					that._stop();
				})
				.on('mouseenter.timeselector', '.timeselector-button', function(event) {
					var $button = $(this);
					
					if ($button.hasClass('timeselector-state-active')) {
						that._selectTime($button.parent('.timeselector-item').data('type'), $button.hasClass('timeselector-up') ? 1 : -1);
					}
				})
				.on('mouseleave.timeselector', '.timeselector-button', $.proxy(this._stop, this))
				.on('click.timeselector', '.timeselector-value', function() {
					that._setTime();
					that._hide();
				});
				
			$(document).on('mousedown', $.proxy(this._checkExternalClick, this));
		}
	};

	$.fn.timeselector = function(options) {
		var args = Array.prototype.slice.call(arguments, 1);
		
		if (!$.fn.timeselector.timer.initialized) {
			$.fn.timeselector.timer.create();
			$.fn.timeselector.timer.initialized = true;
		}
		
		if (typeof options === 'string') {
			this.each(function() {
				var method = $.fn.timeselector.timer[options];
				
				if (typeof method === 'function' && options.charAt(0) !== '_') {
					method.apply($.fn.timeselector.timer, [this].concat(args));
				}
			});
		} else {
			options = $.extend({}, $.fn.timeselector.defaults, options);
			this.each(function() {
				$.fn.timeselector.timer.attach(this, options);
			});
		}
		
		return this;
	};
	
	$.fn.timeselector.defaults = {
		hours12: true,
		step: 2
	};
	
	$.fn.timeselector.timer = new Timeselector();

}(jQuery));