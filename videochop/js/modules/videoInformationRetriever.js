/**
 * (C)opyright Michael Duve, Felix Maulwurf, Angelina Staeck
 *
 * @module: VideoInformationRetriever
 * @requires: jQuery
 *
 * module is for receiving detailed information about a videoItem
 */

define(["jquery"], (function ($) {
    "use strict";

    /**
     * initializes a new instance
     * @param settings {Object} a JSON-Object which holds all informations for the module
     * @constructor
     */
    function VideoInformationRetriever(settings) {
        this.settings = {

        };

        // if settings where not set by initializing, fill with default settings
        $.extend(this.settings, settings || {});

        this.initialize();
    }

    VideoInformationRetriever.prototype = {
        initialize: function () {

        },
        /**
         * describes this Object to the user
         * @returns {String} representation of this Object
         */
        toString: function () {
            return "VideoInformationRetriever=[]";
        }
    };

    return VideoInformationRetriever;

}));

    
