/**
 * (C)opyright Michael Duve, Felix Maulwurf, Angelina Staeck
 *
 * @module: PreviewVideo
 * @requires: jQuery
 * TODO: add more dependencies here
 *
 * this module shows a video and controls it
 */

define(["jquery"], (function ($) {
    "use strict";

    /**
     * initializes a new instance
     * @param settings {Object} a JSON-Object which holds all informations for the module
     * @constructor
     */
    function PreviewVideo(settings) {
        this.settings = {

        };

        // if settings where not set by initializing, fill with default settings
        $.extend(this.settings, settings || {});

        this.initialize();
    }

    PreviewVideo.prototype = {
        initialize: function () {

        },
        /**
         * describes this Object to the user
         * @returns {String} representation of this Object
         */
        toString: function () {
            return "PreviewVideo=[]";
        }
    };

    return PreviewVideo;

}));