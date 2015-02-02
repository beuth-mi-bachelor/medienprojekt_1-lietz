/**
 * (C)opyright Michael Duve, Felix Maulwurf, Angelina Staeck
 *
 * @module: Utilities
 * @requires: jQuery
 *
 */

define(["jquery"], (function ($) {
    "use strict";

    return {
        timeFormat: function(time) {
            var millis = parseFloat(time) * 1000;
            var date = new Date(millis);
            var mins = date.getMinutes();
            var secs = date.getSeconds();
            var mills = date.getMilliseconds();
            return  this.fillZeros(mins, 1, "pre") + ":" + this.fillZeros(secs, 1, "pre") + "." + this.fillZeros(mills, 2, "post");
        },
        fillZeros: function(value, zeros, preORpost) {
            var fillWith = ((Math.pow(10, zeros)) + "0");
            var val = value + "";
            var placeholder = fillWith.slice(1+val.length,fillWith.length);
            if (preORpost === "pre") {
                return placeholder + val;
            } else if (preORpost === "post") {
                return val + placeholder;
            }
        },
        parseArguments: function(text) {
            text = text.replace(/\s+/g, ' ');
            var args = [];
            // Allow double quotes to not split args.
            text.split('"').forEach(function(t, i) {
                t = t.trim();
                if ((i % 2) === 1) {
                    args.push(t);
                } else {
                    args = args.concat(t.split(" "));
                }
            });
            return args;
        }
    };

}));


