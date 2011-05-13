Runloop 1.0.3 - Documentation
=============================

#### 1.0.3 changelog

* New public property on the runloop object: (bool) `isPlaying`.

#### 1.0.2 changelog

* Filename now properly matches the version
* Automatic runloop reset at the end (once a runloop completes) was not working. Now, you no longer need to manually call runloop.reset() to reuse or re-execute a runloop.


### Runloop is A jQuery Plugin for Comprehensive Animations

From the Readme:

> With jQuery Runloop, you can create your own small runloop with keyframes at your own choosing, each with code to execute. You can put whatever code you want in each keyframe, rearrange keyframes easily, and use reusable maps of code and/or animations to share between runloops.

> Runloop was created to have more power, more control and less hassle than dealing with jQuery `.animate()` callbacks. It hooks into jQuery's Effects Queue by design, to avoid timing conflicts in the case of doing many multiple `.animate()` calls.

[Runloop Demo](http://files.farukat.es/creations/runloop/)

[Announcement post](http://farukat.es/p514)

## Basic Usage

Runloop is not a chainable jQuery plugin by design. Instead, you create a new variable for each runloop object you need, and use the methods on your new object to add keyframes with associated code, remove keyframes, start and stop the runloop, etc.

There is one very important thing to remember: **jQuery Runloop only supports keyframes at 5% intervals, and only at 10% intervals if you give it a duration of < 500ms!**

The reason for this is that it runs one `.animate()` call on a `div` in nodespace, triggering at every step. However, steps are not round integers by nature, and animation timings will often cause certain single integers to be skipped over when rounded. That’s why it reduces each step to its nearest mod-5 value, and in the case of < 500ms (main) animations, to its nearest mod-10 value.

This is a simple example:

	<!-- After including jQuery, include the plugin: -->
	<script src="jquery.runloop.1.0.js"></script>
	<script>
	var loop = jQuery.runloop();

	// Note: only use 5% intervals (10% for <500ms durations)!
	loop.addKey('25%', function(){ // Some code or animations here  });
	loop.addKey('50%', function(){ // Different code/animations  });
	loop.addKey('75%', function(){ // Even more different code/animations!  });

	loop.play(1000); // duration set in milliseconds
	</script>
	
# Public Properties

## .isPlaying

*boolean* This property will return `true` if a runloop is currently playing, `false` if not.

# Public Methods

The following are all the available public methods on your newly created runloop object:

## .addKey( atPercentage, func )

*Returns: nothing*

**atPercentage** Can be any 5% interval value, e.g. `35%`, `60%`, `95%`. Note, however, that if your overall Runloop animation is given a duration of less than 500 milliseconds, Runloop will execute only at 10% intervals, in which case all x5% keyframes are skipped.

**func** A function to be executed at the specified keyframe (`atPercentage`). You can have whatever code you want in this function, but be mindful of scope.

You can stack multiple function calls to the same keyframe location. If you do so, Runloop will wrap the existing functions inside a new function call and execute each function in the order you supplied it with.

## .removeKey( atPercentage )

*Returns: nothing*

**atPercentage** The keyframe to clear out. If multiple functions were stacked on a single keyframe, all of them will be removed.

## .addMap( newMap )

*Returns: nothing*

**newMap** A pre-compiled map (hash / associative array) with multiple keyframe-function associations. This allows you to reuse keyframes easily between multiple runloops. Internally uses .addKey() so it won’t overwrite any existing keyframes, merely add to them.

## .getMap()

*Returns: current Map object of the runloop*

If you ever need to examine the map of a runloop at any point, you can use `yourRunloop.getMap();`

## .reset()

*Returns: nothing*

Resets the runloop to initial state. The execution log will be cleared, and the runloop will be returned to (step) 0.

## .pause()

*Returns: nothing*

Pauses the runloop animation. **Important note**: this does not pause any animations you may have running as a result of keyframe function code being executed. It merely stops the main runloop in its track, continuing with the *next* step in the process when you call `.play()`.

## .play( [ duration ], [ callback ] )

*Returns: nothing*

Starts the runloop.

**duration** Specifies the duration of the runloop. If omitted, `duration` defaults to 500 milliseconds. Is ignored if the runloop has already started but was paused (but *not* reset).

**callback** Optional callback to be executed once the runloop reaches 100%. Is the same as doing `.addKey('100%', func)`.

# Acknowledgements

Thanks go out to:

* Ben Nadal for his concept inspiring me to make this plugin;
* Jonathan Snook for feedback along the way;
* Bradley Wright, Michael Burgstahler & Francesco Spreafico for IE testing.

Runloop is **Copyright © 2011 <a href="http://farukat.es/">Faruk Ateş</a>**, and is dual-licensed under the **MIT and BSD** licenses.