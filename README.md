javascript-detect-element-resize
================================

A Cross-Browser, Event-based, Element Resize Detection.

In short, this implementation does NOT use an internal timer to detect size changes (as most implementations I found).

About the libraries
===================
I was searching for a library that allowed me to detect when an DOM element changes size, and all solutions I found had two problems:

 1. only available as jQuery libraries (so no standalone Javascript)
 2. all had terrible performance (because all of them use timers to intermittently poll the size of the elements to detect a change).

Then I came across this [great post][1] on [Back Alley Coder][3] about using [overflow and underflow events][2] to do event-based element resize detection; and it works great without consuming resources at all (just like any other browser originated event).

The libraries on this repository are just a concrete implementation of that technique.

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
  $('#resizeElement').resize(function() {
    /* do something */
  });
</script>
```

Compatibility
-------------
Works great on:

 - Chrome
 - Firefox
 - IE 9

Doesn't work on:

 - IE 7
 - IE 8

TODO
====

 - Create minified version of the libraries.
 - Add support to IE7/8 (totally feasible, just need to update the code and test it properly).
 - Add support for standard jQuery bind method on 'resize' event.


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
