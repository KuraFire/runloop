/*!
 * jQuery Runloop Plugin -- version 1.0.3
 * Copyright 2011, Faruk Ates
 * Dual licensed under the MIT or BSD licenses
 *
 * Based on the concept by Ben Nadel:
 * http://j.mp/ben-nadel-concept
 * 
 * Documentation:
 * https://github.com/KuraFire/runloop/blob/master/documentation.md
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
      var version = "1.0.3",
      
      // Create the dummy object in nodespace that we're running the animation on
      runloop = document.createElement('div'),
      
      // Stores the callbacks for each runloop
      map = {},
      
      // Stores each mapped keyframe point once it has been executed, to prevent double executions
      execLog = {},
      
      // Internals for keeping track of things
      currentDuration = false,
      remainingDuration = false,
      currentStep = 0,
      
      // Our runloop return object
      r,
      
      // Private shortcut
      makeAt = function(at) {
         var val = parseInt(at.toString().match(/[0-9]+/g), 0);
         return isNaN(val) ? false : "at" + val;
      };

      // Public methods:
      return r = {
         
         isPlaying: false,
         
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
            execLog = {};
            
            // Explicitly set runloop back to 0
            $(runloop).css({'top':0});
         },
         
         // Pauses the runloop at the current interval. 
         // 
         //                             WARNING !!
         // This will not pause any animations triggered by keyframe functions!
         // 
         pause: function() {
         
            r.isPlaying = false;

            // Get current time interval and store the remaining time
            remainingDuration = currentDuration - Math.round(currentDuration * (Math.floor(currentStep) / 100));
            
            $(runloop).stop();
         },

         // Starts playing the runloop; if paused, continues from where it was
         play: function(duration, callback) {
            
            // If we're already playing, return/ignore
            if ( r.isPlaying ) {
               return;
            }
            r.isPlaying = true;
            
            // Default value
            duration = parseInt(duration, 0) || 500;
            
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
            
            // The optional callback on play() is just a keyframe 100% function
            if (typeof callback == "function") {
               this.addKey('100%', callback);
            }
            
            // Store duration in case it gets paused
            currentDuration = duration;
            
            $(runloop).animate({'top':'100'}, {

               duration: duration,
               
               step: function( step ) {
                  currentStep = step;
                  
                  // Default is floor
                  if (config.roundType == "round") {
                     step = Math.round( step / config.base ) * config.base;
                  } else {
                     step = Math.floor( step / config.base ) * config.base;
                  }
                  
                  if (!(step in execLog) && map['at' + step]) {
                     
                     // Log this keyframe location, to prevent double-execution
                     execLog[step] = true;
                     
                     // Execute the stored function for this keyframe
                     map['at' + step]();
                  }
               },
               easing: 'linear',
               
               complete: function() {
                  r.isPlaying = false;
                  r.reset();
               }
            });
         }
      };
  };
})( jQuery );