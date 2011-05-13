Runloop 1.0.3
=============

### A jQuery Plugin for Comprehensive Animations

With jQuery Runloop, you can create your own small runloop with keyframes
at your own choosing, each with code to execute. You can put whatever code
you want in each keyframe, rearrange keyframes easily, and use reusable maps
of code and/or animations to share between runloops.

Runloop was created to have more power, more control and less hassle than dealing
with jQuery .animate() callbacks. It hooks into jQuery's Effects Queue by design,
to avoid timing conflicts in the case of doing many multiple .animate() calls.

### [Full documentation](https://github.com/KuraFire/runloop/blob/master/documentation.md) • [Demo](http://files.farukat.es/creations/runloop/)

### Known issues

Currently there are no known issues for the 1.0.3 release.

jQuery (1.5 and below) has [a bug in its .animate() step: method](http://bugs.jquery.com/ticket/8188), which triggers
an error in IE8 and below. The 1.0 version, however, has sidestepped this by
using "top" instead of "z-index".

Runloop is Copyright © 2011 [Faruk Ateş](http://farukat.es/); dual licensed under the MIT or BSD licenses.

