Runloop
=======

### A jQuery Plugin for Comprehensive Animations

With jQuery Runloop, you can create your own small runloop with keyframes
at your own choosing, each with code to execute. You can put whatever code
you want in each keyframe, rearrange keyframes easily, and use reusable maps
of code and/or animations to share between runloops.

Runloop was created to have more power, more control and less hassle than dealing
with jQuery .animate() callbacks. It hooks into jQuery's Effects Queue by design,
to avoid timing conflicts in the case of doing many multiple .animate() calls.

Full usage documentation will be prepared for the 1.0 release.

### Known issues

* Currently there is a bug in IE8 and below. It seems to have something to do with 
  the jQuery library, but we're still investigating it.

Runloop is Copyright © 2011 Faruk Ates; dual licensed under the MIT or BSD licenses.

