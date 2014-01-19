/**
* Detect Element Resize Plugin for jQuery
*
* https://github.com/sdecima/javascript-detect-element-resize
* Sebastian Decima
*
* version: 0.4.1
**/

(function ( $ ) {
	var is_above_ie10 = !(window.ActiveXObject) && "ActiveXObject" in window;
	var supports_mutation_observer = 'MutationObserver' in window;
	
	var jQuery_resize = $.fn.resize;
	
	$.fn.resize = function(callback) {
		return this.each(function() {
			if(this == window)
				jQuery_resize.call(jQuery(this), callback);
			else
				addResizeListener(this, callback);
		});
	}

	$.fn.removeResize = function(callback) {
		return this.each(function() {
			removeResizeListener(this, callback);
		});
	}

	$.fn.flow = function(type, callback) {
		return this.each(function() {
			addFlowListener(this, type, callback);
		});
	}

	function addFlowListener(element, type, fn){
		var flow = type == 'over';
		element.addEventListener('OverflowEvent' in window ? 'overflowchanged' : type + 'flow', function(e){
			if (e.type == (type + 'flow') ||
			((e.orient == 0 && e.horizontalOverflow == flow) ||
			(e.orient == 1 && e.verticalOverflow == flow) ||
			(e.orient == 2 && e.horizontalOverflow == flow && e.verticalOverflow == flow))) {
				e.flow = type;
				return fn.call(this, e);
			}
		}, false);
	};

	function newResizeMutationObserverCallback(element, fn) {
		var oldWidth = element.clientWidth,
			oldHeight = element.clientHeight;
		return function() {
			if(oldWidth != element.clientWidth || oldHeight != element.clientHeight) {
				oldWidth = element.clientWidth;
				oldHeight = element.clientHeight;
				fn.call(element);
			}
		}
	}

	function addResizeMutationObserver(element, fn){
		var observer = new MutationObserver(newResizeMutationObserverCallback(element, fn));
		observer.observe(element, {
			attributes: true,
			subtree: true,
			attributeFilter: ['style']
		});
		return observer;
	};

	function fireEvent(element, type, data, options){
		var options = options || {},
			event = document.createEvent('Event');
		event.initEvent(type, 'bubbles' in options ? options.bubbles : true, 'cancelable' in options ? options.cancelable : true);
		for (var z in data) event[z] = data[z];
		element.dispatchEvent(event);
    };

	function addResizeListener(element, fn){
		if (is_above_ie10 && supports_mutation_observer) {
			fn._mutationObserver = addResizeMutationObserver(element, fn);
			var events = element._mutationObservers || (element._mutationObservers = []);
			if ($.inArray(fn, events) == -1) events.push(fn);
		} else {
			var supports_onresize = 'onresize' in element;
			if (!supports_onresize && !element._resizeSensor) {
				var sensor_style = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: -1;';
				var sensor = element._resizeSensor = document.createElement('div');
					sensor.className = 'resize-sensor';
					sensor.innerHTML = '<div class="resize-overflow" style="' + sensor_style
						+ '"><div></div></div><div class="resize-underflow" style="' + sensor_style
						+ '"><div></div></div>';
				
				var x = 0, y = 0,
					first = sensor.firstElementChild.firstChild,
					last = sensor.lastElementChild.firstChild,
					matchFlow = function(event){
						var change = false,
							width = element.offsetWidth;
						if (x != width) {
							first.style.width = width - 1 + 'px';	
							last.style.width = width + 1 + 'px';
							change = true;
							x = width;
						}
						var height = element.offsetHeight;
						if (y != height) {
							first.style.height = height - 1 + 'px';
							last.style.height = height + 1 + 'px';	
							change = true;
							y = height;
						}
						if (change && event.currentTarget != element) fireEvent(element, 'resize');
					};
				
				if (getComputedStyle(element).position == 'static'){
					element.style.position = 'relative';
					element._resizeSensor._resetPosition = true;
				}
				addFlowListener(sensor, 'over', matchFlow);
				addFlowListener(sensor, 'under', matchFlow);
				addFlowListener(sensor.firstElementChild, 'over', matchFlow);
				addFlowListener(sensor.lastElementChild, 'under', matchFlow);	
				element.appendChild(sensor);
				matchFlow({});
			}
			var events = element._flowEvents || (element._flowEvents = []);
			if ($.inArray(fn,events) == -1) events.push(fn);
			if (!supports_onresize) element.addEventListener('resize', fn, false);
			element.onresize = function(e){
				$.each(events, function(index, fn){
					fn.call(element, e);
				});
			};
		}
	};

	function removeResizeListener(element, fn){
		if (is_above_ie10 && supports_mutation_observer) {
			var index = $.inArray(fn, element._mutationObservers);
			if (index > -1) {
				var observer = element._mutationObservers[index]._mutationObserver;
				element._mutationObservers.splice(index, 1);
				observer.disconnect();
			}
		} else {
			var supports_onresize = 'onresize' in element;
			var index = $.inArray(fn, element._flowEvents);
			if (index > -1) element._flowEvents.splice(index, 1);
			if (!element._flowEvents.length) {
				var sensor = element._resizeSensor;
				if (sensor) {
					element.removeChild(sensor);
					if (sensor._resetPosition) element.style.position = 'static';
					try { delete element._resizeSensor; } catch(e) { /* delete arrays not supported on IE 7 and below */}
				}
				if (supports_onresize) element.onresize = null;
				try { delete element._flowEvents; } catch(e) { /* delete arrays not supported on IE 7 and below */}
			}
			if(!supports_onresize) element.removeEventListener('resize', fn);
		}
	};

}( jQuery ));