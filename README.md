javascript-detect-element-resize
================================

A Cross-Browser, Event-based, Element Resize Detection.

In short, this implementation does NOT use an internal timer to detect size changes (as most implementations I found do).
It uses [MutationObservers][4] if supported by the browser, and [overflow and underflow events][2] if not. It also uses the ['onresize' event][5] on IE10 and below.

About the libraries
===================
I was searching for a library that allowed me to detect when an DOM element changes size, and all solutions I found had two problems:

 1. only available as jQuery libraries (so no standalone Javascript)
 2. all had terrible performance (because all of them use timers to intermittently poll the size of the elements to detect a change).

Then I came across this [great post][1] on [Back Alley Coder][3] about using [overflow and underflow events][2] to do event-based element resize detection; and it works great without consuming resources at all (just like any other browser originated event).

On the other hand, most new browsers implement [WC3 DOM4 MutationObservers][4], which allows to observe property changes and hence indirectly watch for resize changes.

The libraries on this repository are just a concrete implementation of a mixture of the above technologies/techniques.

Libraries
=========

Pure Javascript library usage
-----------------------------

```html
<script type="text/javascript" src="detect-element-resize.js"></script>
<script type="text/javascript">
  var resizeElement = document.getElementById('resizeElement'),
      resizeCallback = function() {
          /* do something */
      };
  addResizeListener(resizeElement, resizeCallback);
  removeResizeListener(resizeElement, resizeCallback);
</script>
```

jQuery plugin library usage
---------------------------
```html
<script type="text/javascript" src="jquery.js"></script>
<script type="text/javascript" src="jquery.resize.js"></script>
<script type="text/javascript">
  var myFunc = function() {
    /* do something */
  };
  
  $('#resizeElement').resize(myFunc);
  $('#resizeElement').removeResize(myFunc);
</script>
```

Compatibility
-------------
Works great on:

 - Chrome
 - Firefox
 - IE 10 and below (tested on 10, 9, 8 and 7)

Works but limited:

 - IE 11: due to lack of onresize/overflow events, it only detects changes through a MutationObserver;  
   i.e. only javascript generated resize changes and not CSS pseudo classes e.g. :hover, CSS animations, etc.

Doesn't work on:

 - ???

Please [let me know](https://github.com/sdecima/javascript-detect-element-resize/issues) if you test these libraries on any other browser, of if you run into issues with any of the above browsers.

TODO
====

 - Create minified version of the libraries.
 - Add support for standard jQuery bind method on 'resize' event.

Release Notes
=============
v0.4
----

 - Adds better cross-browser support, it now uses MutationObservers only on IE11.

v0.3
----

 - Adds support for MutationObservers.
 - Adds support for IE 11.
 - Wrapped the pure javascript version of the library (to hide non-public methods).

v0.2
----

 - Adds support for IE 8 and below.

v0.1
----

 - Implementation based on the [works][1] of [Back Alley Coder][3]
 - Adds jQuery plugin version


References
==========

Similar libraries (but they use timers)
---------------------------------------
[jQuery-mutate](http://www.jqui.net/jquery-projects/jquery-mutate-official/)

[jQuery-resize-plugin](http://benalman.com/projects/jquery-resize-plugin/)


Don't get me wrong, these are great libraries and work as advertised, it's just that they are not easy on browser resources.

External links
--------------
[Back Alley Coder: Cross-Browser, Event-based, Element Resize Detection][1]  
[Back Alley Coder: Overflow and Underflow Events][2]

[1]: http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/
[2]: http://www.backalleycoder.com/2013/03/14/oft-overlooked-overflow-and-underflow-events/
[3]: http://www.backalleycoder.com/
[4]: http://www.w3.org/TR/dom/#mutation-observers
[5]: http://msdn.microsoft.com/en-us/library/ie/ms536959
