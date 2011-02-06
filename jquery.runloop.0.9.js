/*
 * jQuery Runloop Plugin
 * Copyright 2011, Faruk Ates
 * Dual licensed under the MIT or BSD licenses
 *
 * Based on the concept by Ben Nadel:
 * http://j.mp/ben-nadel-concept
 * 
 * A more detailed introduction is coming soon to:
 * http://farukat.es/
*/

/*
 * USAGE:
 * 
 * var loop = jQuery.runloop();
 * 
 * loop.addKey('25%', function(){ // Some code or animations here  });
 * loop.addKey('50%', function(){ // Different code/animations  });
 * loop.addKey('75%', function(){ // Even more different code/animations!  });
 * loop.play(1000); // duration set in milliseconds
 * 
 * Also available:
 * loop.pause()  - pauses the main run loop, but does NOT pause any animations triggered in keyframes
 * loop.reset()  - resets the main run loop to 0
 * loop.addMap() - add a map with multiple keyframes at once, e.g. { '20%': func, '50%': func2 }
 * loop.getMap() - to see what the keyframe map for the current runloop object is
 * loop.removeKey() - pass in a percentage/keyframe point to remove it from the current map
 * 
*/

(function( $ ){
   $.runloop = function(settings) {
      
      // Internal config, can be partially extended
      var config = {
         
         // roundType can be 'floor' or 'round'; used in the Math function for rounding each step to its closest 5% or 10% interval.
         'roundType': 'floor',
         
         // base 5 is used (and recommended to be left as-is) for loops from 500ms and up; < 500ms will always switch to base 10!
         'base': 5
      };
      if (settings) $.extend(config, settings);
      
      // Version!
      var version = "0.9",
      
      // Create the dummy object in nodespace that we're running the animation on
      runloop = document.createElement('div'),
      
      // Stores the callbacks for each runloop
      map = {},
      
      // Stores each mapped keyframe point once it has been executed, to prevent double executions
      execLog = [],
      
      // Internals for keeping track of things
      currentDuration = false,
      remainingDuration = false,
      currentStep = 0,
      
      // Private shortcut
      makeAt = function(at) {
         var val = parseInt(at.toString().match(/[0-9]+/g));
         return (isNaN(val)) ? false : "at" + val;
      };
      
      // Add indexOf support if needed:
      if (!Array.prototype.indexOf) {
         Array.prototype.indexOf = function(elt)
         {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0) {
               from += len;
            }
            for (; from < len; from++) {
               if (from in this && this[from] === elt) {
                  return from;
               }
            }
            return -1;
         };
      }

      // Public methods:
      return {
         
         // Add a keyframe at specified percentage point with code to execute
         addKey: function(atPercentage, func) {
            var at = makeAt(atPercentage);
            
            if (at) {
               var oldAt = map[at];
               if (typeof map[at] != 'function') {
                  map[at] = func;
               } else {
                  map[at] = function() {
                     if (oldAt) {
                        oldAt();
                     }
                     func();
                  };
               }
            }
         },

         // Remove a keyframe at specified percentage point
         removeKey: function(atPercentage) {
            var at = makeAt(atPercentage);
            if (at) {
               delete map[at];
            }
         },
         
         // Add a map of multiple keyframe-function associations
         addMap: function(newMap) {
            
            // Run through each newMap property
            for (var key in newMap){
               
               // Validate newMap item
               at = makeAt(key);
               
               // If valid on both counts, add to Runloop map
               if (at && typeof newMap[key] == "function") {
                  this.addKey(at, newMap[key]);
               }
            
            }
         },

         // This returns the current map for inspection
         getMap: function() {
            return map;
         },
         
         // Resets the runloop to state 0
         reset: function() {
         
            // Return internal variables to initial state
            currentDuration = false;
            remainingDuration = false;
            currentStep = 0;
            execLog = [];
            
            // Explicitly set runloop back to 0
            $(runloop).css({'top':0});
         },
         
         // Pauses the runloop at the current interval. 
         // 
         //                             WARNING !!
         // This will not pause any animations triggered by keyframe functions!
         // 
         pause: function() {

            // Get current time interval and store the remaining time
            remainingDuration = currentDuration - Math.round(currentDuration * (Math.floor(currentStep) / 100));
            
            $(runloop).stop();
         },

         // Starts playing the runloop; if paused, continues from where it was
         play: function(duration, callback) {
            
            // Default value
            duration = parseInt(duration) || 500;
            
            // If our entire runloop is less than 500ms, simplify map steps to 10% intervals
            if (duration < 500) {
               config.base = 10;
            }
            
            // We're in an ongoing runloop; shorten duration to remaining time
            if (remainingDuration) {
               duration = remainingDuration;
               $(runloop).css('top', Math.floor(currentStep)); // TODO: is this needed?
            }
            // It is important to note at this point that it is entirely possible to still have
            //   a config.base of 5, but a duration that is less than 500ms. This unusual scenario is,
            //   however, legitimate in case your original animation had x5% keyframes and was paused
            //   so close to the end that less than 500 ms remained on the overall duration time. 
            //   That said, it can still cause some intervals to get skipped, so it's not recommended
            //   to get into this kind of situation. :)
            
            // The optional play() callback is just a keyframe 100% function
            if (typeof callback == "function") {
               this.addKey('100%', callback);
            }
            
            // Store duration in case it gets paused
            currentDuration = duration;
            
            $(runloop).animate({'top':'100'}, {

               duration: duration,
               
               step: function( step ) {
                  console.log('step: ' + step);
                  currentStep = step;
                  
                  // Default is floor
                  if (config.roundType == "round") {
                     step = Math.round( step / config.base ) * config.base;
                  } else {
                     step = Math.floor( step / config.base ) * config.base;
                  }
                  
                  if (execLog.indexOf( 'at' + step ) == -1 && map['at' + step]) {
                     
                     // Log this keyframe location, to prevent double-execution
                     execLog.push( 'at' + step );
                     
                     // Execute the stored function for this keyframe
                     map['at' + step]();
                  }
               },
               easing: 'linear',
               
               complete: function() {
                  currentDuration = false;
                  remainingDuration = false;
                  currentStep = 0;
                  execLog = [];
               }
            });
         }
      };
  };
})( jQuery );