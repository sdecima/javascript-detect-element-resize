/**
* Detect Element Resize
*
* https://github.com/sdecima/javascript-detect-element-resize
* Sebastian Decima
*
* version: 0.3
**/

(function ( $ ) {
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
		if ('MutationObserver' in window) {
			fn._mutationObserver = addResizeMutationObserver(element, fn);
			var events = element._mutationObservers || (element._mutationObservers = []);
			if (indexOf.call(events, fn) == -1) events.push(fn);		
		} else {
			var resize = 'onresize' in element;
			if (!resize && !element._resizeSensor) {
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
			if (indexOf.call(events, fn) == -1) events.push(fn);
			if (!resize) element.addEventListener('resize', fn, false);
			element.onresize = function(e){
				forEach.call(events, function(fn){
					fn.call(element, e);
				});
			};
		}
	};

	function removeResizeListener(element, fn){
		if ('MutationObserver' in window) {
			var index = indexOf.call(element._mutationObservers, fn);
			if (index > -1) {
				var observer = element._mutationObservers[index]._mutationObserver;
				element._mutationObservers.splice(index, 1);
				observer.disconnect();
			}
		} else {
			var resize = 'onresize' in element;
			var index = indexOf.call(element._flowEvents, fn);
			if (index > -1) element._flowEvents.splice(index, 1);
			if (!element._flowEvents.length) {
				var sensor = element._resizeSensor;
				if (sensor) {
					element.removeChild(sensor);
					if (sensor._resetPosition) element.style.position = 'static';
					try { delete element._resizeSensor; } catch(e) { /* delete arrays not supported on IE 7 and below */}
				}
				if (resize) element.onresize = null;
				try { delete element._flowEvents; } catch(e) { /* delete arrays not supported on IE 7 and below */}
			}
			if(!resize) element.removeEventListener('resize', fn);
		}
	};

	/* Array.indexOf for IE < 9 */
	var indexOf = function(needle) {
		if(typeof Array.prototype.indexOf === 'function') {
			indexOf = Array.prototype.indexOf;
		} else {
			indexOf = function(needle) {
				var i = -1, index = -1;

				for(i = 0; i < this.length; i++) {
					if(this[i] === needle) {
						index = i;
						break;
					}
				}

				return index;
			};
		}

		return indexOf.call(this, needle);
	};

	/* Array.forEach for IE < 9 */
	var forEach = function(action, that) {
		if(typeof Array.prototype.forEach === 'function') {
			forEach = Array.prototype.forEach;
		} else {
			forEach = function(action, that) {
			for (var i= 0, n= this.length; i<n; i++)
				if (i in this)
					action.call(that, this[i], i, this);
			};
		}

		return forEach.call(this, action, that);
	};
	
	window.addResizeListener = addResizeListener;
	window.removeResizeListener = removeResizeListener;
}());